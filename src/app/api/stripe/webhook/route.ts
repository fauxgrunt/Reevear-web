import { escapeHtml, getMailer, sendEmail } from "@/lib/mail";
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
        expand: ["line_items"],
      });
      await notifyOrder(session);
    }
  }

  return Response.json({ received: true });
}

async function notifyOrder(session: Stripe.Checkout.Session) {
  const mailer = getMailer();
  if (!mailer) return;

  const email = session.customer_details?.email ?? "No email";
  const shipping = session.collected_information?.shipping_details;
  const name = session.customer_details?.name ?? shipping?.name ?? "";
  const address = formatAddress(shipping?.address);
  const lines = session.line_items?.data ?? [];
  const amount = formatPence(session.amount_total ?? 0);
  const reference = session.id;

  const text = [
    `New paid order ${reference}`,
    name ? `Name: ${name}` : null,
    `Email: ${email}`,
    address ? `Delivery:\n${address}` : null,
    "",
    ...lines.map(
      (line) =>
        `${line.quantity ?? 1} × ${line.description} — ${formatPence(line.amount_total ?? 0)}`,
    ),
    "",
    `Total: ${amount}`,
  ]
    .filter((line): line is string => line != null)
    .join("\n");

  const html = `
    <p>New paid order <strong>${escapeHtml(reference)}</strong></p>
    ${name ? `<p>${escapeHtml(name)}</p>` : ""}
    <p>${escapeHtml(email)}</p>
    ${address ? `<p>${escapeHtml(address).replaceAll("\n", "<br />")}</p>` : ""}
    <ul>
      ${lines
        .map(
          (line) =>
            `<li>${line.quantity ?? 1} × ${escapeHtml(line.description ?? "")} — ${escapeHtml(formatPence(line.amount_total ?? 0))}</li>`,
        )
        .join("")}
    </ul>
    <p>Total: ${escapeHtml(amount)}</p>
  `;

  await sendEmail({
    ...mailer,
    subject: `Reevear order ${reference}`,
    text,
    html,
  });
}

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return "";
  return [address.line1, address.line2, address.city, address.postal_code, address.country]
    .filter(Boolean)
    .join("\n");
}

function formatPence(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount / 100);
}
