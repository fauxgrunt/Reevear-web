"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { getColourways, type ShopProduct } from "@/data/products";

function swatchHex(product: ShopProduct) {
  return (
    product.colourVariants.find((entry) => entry.name === product.colour)?.hex ??
    product.swatches[0] ??
    "#171715"
  );
}

export function ProductCard({ product }: { product: ShopProduct }) {
  const { format } = useCurrency();
  const sizes = product.sizes.filter((entry) => entry.available);
  const colourways = product.group ? getColourways(product.group) : [];
  const [colourId, setColourId] = useState(product.colourVariants[0]?.id ?? "");
  const colour =
    product.colourVariants.find((entry) => entry.id === colourId) ??
    product.colourVariants[0];
  const image = product.group
    ? product.media.primary
    : (colour?.image ?? product.media.primary);
  const colourName = product.group ? product.colour : colour?.name;

  return (
    <article className="collection-card">
      <Link href={`/products/${product.slug}`} className="collection-card-link">
        <div className="collection-card-media">
          <ProductMedia
            src={image}
            hoverSrc={product.media.hover}
            alt={colourName ? `${product.name}, ${colourName}` : product.name}
            className="absolute inset-0"
          />
          {product.isNew ? <span className="collection-card-badge">New</span> : null}
          {sizes.length > 0 ? (
            <div className="collection-card-sizes" aria-hidden="true">
              {sizes.map((entry) => (
                <span key={entry.id}>{entry.label}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="collection-card-meta">
          <h2>{product.name}</h2>
          <p className="collection-card-price">{format(product.priceValue)}</p>
        </div>
      </Link>
      {colourways.length > 1 ? (
        <div className="collection-card-swatches">
          {colourways.map((entry) => (
            <Link
              key={entry.id}
              href={`/products/${entry.slug}`}
              className={`collection-swatch${entry.id === product.id ? " is-active" : ""}`}
              style={{ background: swatchHex(entry) }}
              aria-label={entry.colour}
              aria-current={entry.id === product.id ? "true" : undefined}
              title={entry.colour}
            >
              <span className="collection-swatch-name">{entry.colour}</span>
            </Link>
          ))}
        </div>
      ) : product.colourVariants.length > 1 ? (
        <div className="collection-card-swatches">
          {product.colourVariants.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`shop-swatch ${colourId === entry.id ? "is-active" : ""}`}
              style={{ background: entry.hex }}
              aria-label={entry.name}
              aria-pressed={colourId === entry.id}
              onClick={() => setColourId(entry.id)}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
