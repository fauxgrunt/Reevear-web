import { priceCheckout } from "@/lib/checkout";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Card payment is not switched on yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The bag could not be read." }, { status: 400 });
  }

  const priced = priceCheckout(body);
  if (!priced.ok) {
    return Response.json({ error: priced.error }, { status: 400 });
  }

  const origin = siteOrigin(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "en-GB",
      currency: "gbp",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["GB"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "gbp" },
            display_name: "Complimentary UK delivery",
          },
        },
      ],
      line_items: priced.lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "gbp",
          unit_amount: line.unitAmount,
          product_data: {
            name: line.name,
            description: line.description,
            metadata: {
              productId: line.productId,
              colour: line.colour,
              size: line.size,
            },
          },
        },
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
    });

    if (!session.url) {
      return Response.json(
        { error: "Payment could not be started." },
        { status: 502 },
      );
    }

    return Response.json({ url: session.url });
  } catch {
    return Response.json(
      { error: "Payment could not be started." },
      { status: 502 },
    );
  }
}

function siteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
