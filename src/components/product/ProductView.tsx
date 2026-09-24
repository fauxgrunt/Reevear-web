"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ShopTheLook } from "@/components/product/ShopTheLook";
import { SizeGuide } from "@/components/product/SizeGuide";
import type { ShopProduct } from "@/data/products";

export function ProductView({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [colourId, setColourId] = useState(product.colourVariants[0]?.id ?? "");
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const colour = useMemo(
    () =>
      product.colourVariants.find((entry) => entry.id === colourId) ??
      product.colourVariants[0],
    [colourId, product.colourVariants],
  );

  const selectedSize = product.sizes.find((entry) => entry.id === sizeId);

  function addToBag() {
    setError(null);
    if (product.status === "sold-out") {
      setError("This piece is currently unavailable.");
      return;
    }
    if (!selectedSize) {
      setError("Select a size.");
      return;
    }
    if (!selectedSize.available) {
      setError("That size is unavailable.");
      return;
    }
    setStatus("loading");
    window.setTimeout(() => {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        colour: colour?.name ?? product.colour,
        size: selectedSize.label,
        quantity,
      });
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1600);
    }, 350);
  }

  const details = [
    product.fabric ? ["Fabric", product.fabric] : null,
    product.composition ? ["Composition", product.composition] : null,
    product.construction ? ["Construction", product.construction] : null,
    product.care ? ["Care", product.care] : null,
    product.countryOfManufacture
      ? ["Made in", product.countryOfManufacture]
      : null,
  ].filter((row): row is [string, string] => Boolean(row));

  const sections = [
    product.description
      ? {
          id: "description",
          label: "Description",
          body: product.description,
        }
      : null,
    product.fitNotes || product.fit
      ? {
          id: "fit",
          label: "Fit",
          body: product.fitNotes ?? product.fit,
        }
      : null,
    details.length > 0
      ? {
          id: "details",
          label: "Details & care",
          body: details.map(([label, value]) => `${label}: ${value}`).join("\n"),
        }
      : null,
    {
      id: "shipping",
      label: "Shipping & returns",
      body: "See Shipping and Returns for the current delivery and returns information. Complimentary UK shipping is stated in the announcement bar. Checkout is not connected yet.",
    },
  ].filter((section): section is { id: string; label: string; body: string } =>
    Boolean(section),
  );

  return (
    <>
      <div className="home-gutter pt-24 pb-8 md:pt-28 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-start lg:gap-12 xl:gap-20">
        <ProductGallery product={product} />

        <aside className="mt-10 lg:sticky lg:top-28 lg:mt-0 lg:self-start">
          <h1 className="product-title">{product.name}</h1>
          <p className="mt-3 text-sm text-[#171715]">
            {product.compareAtPrice ? (
              <>
                <span className="mr-2 text-[var(--home-muted)] line-through">
                  {product.compareAtPrice}
                </span>
                {product.price}
              </>
            ) : (
              product.price
            )}
          </p>
          {product.descriptor ? (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--home-muted)]">
              {product.descriptor}
            </p>
          ) : null}

          {product.colourVariants.length > 0 ? (
            <fieldset className="mt-8">
              <legend className="shop-label">
                Colour — {colour?.name ?? product.colour}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
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
            </fieldset>
          ) : null}

          <fieldset className="mt-8">
            <legend className="shop-label">Size</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  disabled={!entry.available}
                  className={`shop-size ${sizeId === entry.id ? "is-active" : ""}`}
                  onClick={() => {
                    setSizeId(entry.id);
                    setError(null);
                  }}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="shop-control mt-4"
              onClick={() => setGuideOpen(true)}
            >
              Size guide
            </button>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="shop-label">Quantity</legend>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="shop-size"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm">{quantity}</span>
              <button
                type="button"
                className="shop-size"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(10, value + 1))}
              >
                +
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            className="shop-bag mt-8"
            onClick={addToBag}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Adding"
              : status === "added"
                ? "Added to bag"
                : "Add to bag"}
          </button>
          {error ? (
            <p className="mt-3 text-sm text-[#171715]" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-12 border-t border-[var(--home-line)]">
            {sections.map((section) => {
              const open = openSection === section.id;
              return (
                <div key={section.id} className="border-b border-[var(--home-line)]">
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center justify-between py-3 text-left"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenSection((current) =>
                        current === section.id ? null : section.id,
                      )
                    }
                  >
                    <span className="shop-label">{section.label}</span>
                    <span aria-hidden className="text-sm text-[var(--home-muted)]">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                  {open ? (
                    section.id === "shipping" ? (
                      <p className="pb-5 text-sm leading-relaxed text-[var(--home-muted)]">
                        See{" "}
                        <Link href="/pages/shipping" className="underline underline-offset-4">
                          Shipping
                        </Link>{" "}
                        and{" "}
                        <Link href="/pages/returns" className="underline underline-offset-4">
                          Returns
                        </Link>{" "}
                        for current delivery and returns information. Complimentary
                        UK shipping is stated in the announcement bar. Checkout is
                        not connected yet.
                      </p>
                    ) : (
                      <p className="pb-5 text-sm leading-relaxed whitespace-pre-line text-[var(--home-muted)]">
                        {section.body}
                      </p>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <ShopTheLook product={product} />
      <RelatedProducts product={product} />
      <SizeGuide
        product={product}
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </>
  );
}
