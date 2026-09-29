"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { getProductById } from "@/data/products";

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function CheckoutView({
  cancelled,
  paymentsReady,
}: {
  cancelled: boolean;
  paymentsReady: boolean;
}) {
  const { items, setQuantity, removeItem } = useCart();
  const { format, converted } = useCurrency();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priced = items.map((item) => {
    const product = getProductById(item.productId);
    const unit = product?.status === "active" ? product.priceValue : null;
    return { item, unit, line: unit == null ? null : unit * item.quantity };
  });
  const ready = priced.every((entry) => entry.line != null);
  const total = priced.reduce((sum, entry) => sum + (entry.line ?? 0), 0);

  async function pay() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            colour: item.colour,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Payment could not be started.");
        setPending(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Payment could not be started.");
      setPending(false);
    }
  }

  return (
    <article className="foundation-page">
      <header className="foundation-intro">
        <h1>Checkout</h1>
        <p>You will be charged in pounds. UK delivery is complimentary.</p>
      </header>

      {items.length === 0 ? (
        <div className="editorial-prose">
          <p>Your bag is empty.</p>
          <p>
            <Link href="/collections/all" className="foundation-cta">
              Continue shopping
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>
      ) : (
        <div className="checkout-layout">
          <ul className="checkout-lines">
            {priced.map(({ item, line }) => (
              <li key={`${item.productId}-${item.size}-${item.colour}`}>
                <div>
                  <p className="checkout-name">{item.name}</p>
                  <p className="checkout-meta">
                    {item.colour} · Size {item.size}
                  </p>
                  <div className="checkout-qty">
                    <button
                      type="button"
                      aria-label={`Fewer ${item.name}`}
                      onClick={() =>
                        setQuantity(item, Math.max(0, item.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`More ${item.name}`}
                      onClick={() => setQuantity(item, Math.min(5, item.quantity + 1))}
                    >
                      +
                    </button>
                    <button type="button" onClick={() => removeItem(item)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p>{line == null ? item.price : pounds.format(line)}</p>
              </li>
            ))}
          </ul>

          <div className="checkout-summary">
            <p>
              <span>Delivery</span>
              <span>Complimentary</span>
            </p>
            <p className="checkout-total">
              <span>Total</span>
              <span>{pounds.format(total)}</span>
            </p>
            <p className="checkout-note">
              Card details are taken by Stripe. Reevear does not store them.
            </p>
            {converted ? (
              <p className="checkout-note">About {format(total)} at the latest rate.</p>
            ) : null}
            {cancelled ? (
              <p className="checkout-note">Payment was cancelled. Your bag is still here.</p>
            ) : null}
            {error ? <p className="checkout-error">{error}</p> : null}
            {!paymentsReady ? (
              <p className="checkout-note">Card payment is not switched on yet.</p>
            ) : null}
            <button
              type="button"
              className="checkout-pay"
              disabled={pending || !ready || !paymentsReady}
              onClick={pay}
            >
              {pending ? "Opening payment" : "Pay now"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
