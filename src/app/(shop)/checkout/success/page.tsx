import type { Metadata } from "next";
import Link from "next/link";
import { ClearBag } from "@/components/pages/ClearBag";
import { getStripe } from "@/lib/stripe";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}): Promise<Metadata> {
  const { session_id: sessionId } = await searchParams;
  const payment = await readPayment(sessionId);
  return {
    title: payment.paid
      ? "Payment received | Reevear"
      : "Payment not completed | Reevear",
    description: payment.paid
      ? "Your Reevear payment has been received."
      : "This Reevear payment could not be confirmed.",
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const payment = await readPayment(sessionId);

  return (
    <article className="foundation-page">
      <header className="foundation-intro">
        <h1>{payment.paid ? "Payment received" : "Payment not completed"}</h1>
        <p>
          {payment.paid
            ? "Thank you. A receipt is on its way from Stripe."
            : "We could not confirm this payment."}
        </p>
      </header>
      {payment.paid ? <ClearBag /> : null}
      <div className="editorial-prose">
        {payment.paid && payment.total ? <p>Charged {payment.total}.</p> : null}
        {payment.paid && payment.email ? <p>Receipt sent to {payment.email}.</p> : null}
        <p>
          <Link href="/collections/all" className="foundation-cta">
            Continue shopping
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </div>
    </article>
  );
}

async function readPayment(sessionId: string | undefined) {
  const stripe = getStripe();
  if (!stripe || !sessionId || !sessionId.startsWith("cs_")) {
    return { paid: false as const };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    return {
      paid,
      email: session.customer_details?.email ?? undefined,
      total:
        paid && session.amount_total != null
          ? new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
            }).format(session.amount_total / 100)
          : undefined,
    };
  } catch {
    return { paid: false as const };
  }
}
