import type { Metadata } from "next";
import { AccountView } from "@/components/pages/AccountView";
import { ordersForAccount } from "@/lib/accounts";
import { getDb } from "@/lib/db";
import { currentCustomer } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account | Reevear",
  description: "Sign in to see the orders placed with your email.",
};

type Props = {
  searchParams: Promise<{ notice?: string; reset?: string; forgot?: string }>;
};

export default async function AccountPage({ searchParams }: Props) {
  const query = await searchParams;
  const customer = await currentCustomer();
  const db = getDb();
  const orders = customer && db ? await ordersForAccount(db, customer.email) : [];

  return (
    <AccountView
      customer={customer}
      orders={orders}
      notice={query.notice}
      resetToken={query.reset}
      showForgot={query.forgot === "1"}
    />
  );
}
