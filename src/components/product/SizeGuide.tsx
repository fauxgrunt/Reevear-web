"use client";

import { useEffect, useId, useRef } from "react";
import type { ShopProduct } from "@/data/products";

export function SizeGuide({
  product,
  open,
  onClose,
}: {
  product: ShopProduct;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, open]);

  if (!open) return null;

  const measurements = product.measurements ?? [];
  const sizeLabels = product.sizes.map((size) => size.label);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-[#171715]/40"
        aria-label="Close size guide"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[86svh] w-full overflow-y-auto bg-[var(--paper)] px-6 py-8 md:max-w-xl md:px-10 md:py-10"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="shop-label">Size guide</p>
            <h2 id={titleId} className="product-title product-title-compact mt-2">
              {product.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="shop-control"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {measurements.length > 0 ? (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--home-line)]">
                  <th className="py-2 font-normal text-[var(--home-muted)]"> </th>
                  {sizeLabels.map((label) => (
                    <th key={label} className="py-2 font-normal">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {measurements.map((row) => (
                  <tr key={row.name} className="border-b border-[var(--home-line)]">
                    <td className="py-2 text-[var(--home-muted)]">
                      {row.name}
                      {row.unit ? ` (${row.unit})` : ""}
                    </td>
                    {sizeLabels.map((label) => (
                      <td key={label} className="py-2">
                        {row.bySize[label] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="mt-8 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <li
                key={size.id}
                className={`shop-chip ${size.available ? "" : "is-disabled"}`}
              >
                {size.label}
              </li>
            ))}
          </ul>
        )}

        {product.fitNotes ? (
          <p className="mt-6 text-sm leading-relaxed text-[var(--home-muted)]">
            {product.fitNotes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
