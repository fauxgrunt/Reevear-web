import { escapeHtml, getMailer, sendEmail } from "@/lib/mail";
import { orderFromSession, persistPaidOrder, type PaidOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) {
    return Response.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const completed = event.data.object as Stripe.Checkout.Session;
    if (completed.payment_status === "paid") {
      const session = await stripe.checkout.sessions.retrieve(completed.id, {
        expand: ["line_items.data.price.product"],
      });
      try {
        const order = orderFromSession(session);
        const stored = await persistPaidOrder(order);
        if (stored === "unconfigured") {
          console.error("DATABASE_URL is not set. The paid order was not stored.");
        }
        if (stored !== "exists") {
          try {
            await notifyOrder(order);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
        return Response.json({ error: "Order could not be recorded." }, { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}

async function notifyOrder(order: PaidOrder) {
  const mailer = getMailer();
  if (!mailer) return;

  const email = order.email || "No email";
  const address = [
    order.shippingLine1,
    order.shippingLine2,
    order.shippingCity,
    order.shippingPostalCode,
    order.shippingCountry,
  ]
    .filter(Boolean)
    .join("\n");
  const amount = formatPence(order.amountTotal);

  const text = [
    `New paid order ${order.id}`,
    order.customerName ? `Name: ${order.customerName}` : null,
    `Email: ${email}`,
    address ? `Delivery:\n${address}` : null,
    "",
    ...order.lines.map((line) => `${lineLabel(line)} — ${formatPence(line.amountTotal)}`),
    "",
    `Total: ${amount}`,
  ]
    .filter((line): line is string => line != null)
    .join("\n");

  const html = `
    <p>New paid order <strong>${escapeHtml(order.id)}</strong></p>
    ${order.customerName ? `<p>${escapeHtml(order.customerName)}</p>` : ""}
    <p>${escapeHtml(email)}</p>
    ${address ? `<p>${escapeHtml(address).replaceAll("\n", "<br />")}</p>` : ""}
    <ul>
      ${order.lines
        .map(
          (line) =>
            `<li>${escapeHtml(lineLabel(line))} — ${escapeHtml(formatPence(line.amountTotal))}</li>`,
        )
        .join("")}
    </ul>
    <p>Total: ${escapeHtml(amount)}</p>
  `;

  await sendEmail({
    ...mailer,
    subject: `Reevear order ${order.id}`,
    text,
    html,
  });
}

function lineLabel(line: PaidOrder["lines"][number]) {
  const detail = [line.colour, line.size ? `size ${line.size}` : ""].filter(Boolean).join(", ");
  return `${line.quantity} × ${line.name}${detail ? ` (${detail})` : ""}`;
}

function formatPence(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount / 100);
}
