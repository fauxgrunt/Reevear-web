import type { Metadata } from "next";
import { CheckoutView } from "@/components/pages/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Reevear",
  description: "Pay for your Reevear order in pounds. UK delivery is complimentary.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const params = await searchParams;

  return (
    <CheckoutView
      cancelled={params.cancelled === "1"}
      paymentsReady={Boolean(process.env.STRIPE_SECRET_KEY?.trim())}
    />
  );
}
