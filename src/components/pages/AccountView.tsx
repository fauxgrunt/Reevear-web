import { signOut } from "@/app/actions/account";
import { AccountForms } from "@/components/pages/AccountForms";
import type { AccountCustomer, AccountOrder } from "@/lib/accounts";

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const dates = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function AccountView({
  customer,
  orders,
  notice,
  resetToken,
  showForgot,
}: {
  customer: AccountCustomer | null;
  orders: AccountOrder[];
  notice?: string;
  resetToken?: string;
  showForgot: boolean;
}) {
  return (
    <article className="foundation-page account-page">
      <header className="foundation-intro">
        <h1>Account</h1>
        <p>
          {customer
            ? `Signed in as ${customer.email}.`
            : "Sign in to see orders placed with your email. Checkout does not require an account."}
        </p>
      </header>

      {customer ? (
        <section className="account-block">
          <h2>Orders</h2>
          {orders.length === 0 ? (
            <p className="contact-note">No paid orders for this email yet.</p>
          ) : (
            <ol className="account-orders">
              {orders.map((order) => (
                <li key={order.id}>
                  <p>
                    {dates.format(new Date(order.createdAt))} · {pounds.format(order.amountTotal / 100)}
                  </p>
                  {order.lines.map((line) => (
                    <p key={`${line.name}-${line.colour}-${line.size}`}>
                      {line.quantity} × {line.name}
                      {line.colour || line.size
                        ? ` (${[line.colour, line.size ? `size ${line.size}` : ""].filter(Boolean).join(", ")})`
                        : ""}
                    </p>
                  ))}
                  {order.city || order.postalCode ? (
                    <p className="contact-note">
                      {[order.city, order.postalCode].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
          <form action={signOut}>
            <button type="submit" className="foundation-cta">
              Sign out
              <span aria-hidden="true"> →</span>
            </button>
          </form>
        </section>
      ) : (
        <AccountForms resetToken={resetToken} showForgot={showForgot} notice={notice} />
      )}
    </article>
  );
}
