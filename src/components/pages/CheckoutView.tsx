"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CheckoutView() {
  const { items, count } = useCart();

  return (
    <article className="foundation-page">
      <header className="foundation-intro">
        <h1>Checkout</h1>
        <p>Payment is not connected yet. No order will be placed.</p>
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
        <div className="editorial-prose">
          <p>
            {count} {count === 1 ? "item" : "items"} in the bag. Checkout, payment,
            and order records are not implemented on this site.
          </p>
          <ul className="legal-list">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.colour}`}>
                {item.name} — {item.size} · {item.colour} · {item.quantity} ·{" "}
                {item.price}
              </li>
            ))}
          </ul>
          <p>
            <Link href="/collections/all" className="foundation-cta">
              Continue shopping
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>
      )}
    </article>
  );
}
