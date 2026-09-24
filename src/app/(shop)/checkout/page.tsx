import type { Metadata } from "next";
import { CheckoutView } from "@/components/pages/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Reevear",
  description: "Checkout is not connected yet.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
