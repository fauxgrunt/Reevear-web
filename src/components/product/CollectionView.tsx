"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ShopProduct } from "@/data/products";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

type PriceBand = {
  id: string;
  label: string;
  match: (value: number) => boolean;
};

type CollectionViewProps = {
  title: string;
  description: string;
  products: ShopProduct[];
};

const sortOptions = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
] as const;

const categoryLabels: Record<string, string> = {
  "t-shirts": "T-Shirts",
  hoodies: "Hoodies",
  sweatshirts: "Sweatshirts",
  shirts: "Shirts",
  trousers: "Trousers",
  jeans: "Jeans",
  jackets: "Jackets",
};

const priceBandDefs: PriceBand[] = [
  { id: "under-50", label: "Under £50", match: (value) => value < 50 },
  { id: "50-100", label: "£50 – £100", match: (value) => value >= 50 && value <= 100 },
  { id: "over-100", label: "Over £100", match: (value) => value > 100 },
];

function categoryLabel(value: string) {
  return categoryLabels[value] ?? value;
}

type Facet = "filters" | "colour" | "size" | "category";
type Columns = 2 | 3 | 4;

export function CollectionView({
  title,
  description,
  products,
}: CollectionViewProps) {
  const [facet, setFacet] = useState<Facet | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [columns, setColumns] = useState<Columns>(4);
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(null);
  const [fit, setFit] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const sizes = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) =>
      product.sizes.forEach((entry) => values.add(entry.label)),
    );
    return [...values];
  }, [products]);

  const colours = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => {
      if (product.group) values.add(product.colour);
      else product.colourVariants.forEach((entry) => values.add(entry.name));
    });
    return [...values];
  }, [products]);

  const colourHex = useMemo(() => {
    const values = new Map<string, string>();
    products.forEach((product) => {
      product.colourVariants.forEach((entry) => {
        if (!values.has(entry.name)) values.set(entry.name, entry.hex);
      });
    });
    return values;
  }, [products]);

  const fits = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => {
      if (product.fit) values.add(product.fit);
    });
    return [...values];
  }, [products]);

  const categories = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) => values.add(product.category));
    return [...values];
  }, [products]);

  const priceBands = useMemo(
    () =>
      priceBandDefs.filter((band) =>
        products.some((product) => band.match(product.priceValue)),
      ),
    [products],
  );

  const filtered = useMemo(() => {
    let next = products;
    if (size) {
      next = next.filter((product) =>
        product.sizes.some((entry) => entry.label === size && entry.available),
      );
    }
    if (colour) {
      next = next.filter((product) =>
        product.group
          ? product.colour === colour
          : product.colourVariants.some((entry) => entry.name === colour),
      );
    }
    if (fit) {
      next = next.filter((product) => product.fit === fit);
    }
    if (category) {
      next = next.filter((product) => product.category === category);
    }
    if (priceBand) {
      const band = priceBandDefs.find((entry) => entry.id === priceBand);
      if (band) next = next.filter((product) => band.match(product.priceValue));
    }
    const sorted = [...next];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "price-desc") sorted.sort((a, b) => b.priceValue - a.priceValue);
    if (sort === "newest") {
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }
    return sorted;
  }, [category, colour, fit, priceBand, products, size, sort]);

  const activeCount = [size, colour, fit, category, priceBand].filter(Boolean).length;
  const sortLabel = sortOptions.find(([value]) => value === sort)?.[1] ?? "Featured";

  const clearFilters = () => {
    setSize(null);
    setColour(null);
    setFit(null);
    setCategory(null);
    setPriceBand(null);
  };

  const closePanels = () => {
    setFacet(null);
    setSortOpen(false);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanels();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const root = document.querySelector(".home-root");
    const onScroll = () => {
      const node = toolbarRef.current;
      if (!node) return;
      const raw = root ? getComputedStyle(root).getPropertyValue("--home-chrome") : "88";
      const offset = Number.parseFloat(raw) || 88;
      setStuck(node.getBoundingClientRect().top <= offset + 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!sortOpen && !facet) return;
      if (toolbarRef.current?.contains(event.target as Node)) return;
      closePanels();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [facet, sortOpen]);

  const toggleValue = (
    current: string | null,
    next: string,
    setValue: (value: string | null) => void,
  ) => {
    setValue(current === next ? null : next);
  };

  const openFacet = (next: Facet) => {
    setSortOpen(false);
    setFacet((current) => (current === next ? null : next));
  };

  const facetOptions: Record<Exclude<Facet, "filters">, { value: string; label: string; hex?: string }[]> = {
    category: categories.map((value) => ({ value, label: categoryLabel(value) })),
    colour: colours.map((value) => ({
      value,
      label: value,
      hex: colourHex.get(value),
    })),
    size: sizes.map((value) => ({ value, label: value })),
  };

  const facetValue: Record<Exclude<Facet, "filters">, string | null> = {
    category,
    colour,
    size,
  };

  const setFacetValue: Record<Exclude<Facet, "filters">, (value: string | null) => void> = {
    category: setCategory,
    colour: setColour,
    size: setSize,
  };

  const showFilters = fits.length > 1 || priceBands.length > 1;
  const facets = (
    [
      ["filters", "Filters", showFilters],
      ["colour", "Colour", colours.length > 1],
      ["size", "Size", sizes.length > 0],
      ["category", "Type", categories.length > 1],
    ] as const
  ).filter((entry) => entry[2]);

  return (
    <div className="collection-page">
      <header className="collection-intro">
        <div className="collection-intro-name">
          <h1>{title}</h1>
        </div>
        {description ? <p>{description}</p> : null}
      </header>

      <div
        className={`collection-tools${facet || sortOpen ? " is-open" : ""}${stuck ? " is-stuck" : ""}`}
        ref={toolbarRef}
      >
        <div className="collection-toolbar">
          <div className="collection-facets">
            {facets.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`collection-facet${facet === id ? " is-open" : ""}${facetValue[id] ? " is-set" : ""}`}
                aria-expanded={facet === id}
                onClick={() => openFacet(id)}
              >
                {label}
              </button>
            ))}
            {activeCount > 0 ? (
              <button type="button" className="collection-clear" onClick={clearFilters}>
                Clear
              </button>
            ) : null}
          </div>

          <div className="collection-toolbar-end">
            <div className="collection-columns" role="group" aria-label="Columns">
              {([2, 3, 4] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={columns === count ? "is-active" : ""}
                  aria-label={`${count} columns`}
                  aria-pressed={columns === count}
                  onClick={() => setColumns(count)}
                >
                  {Array.from({ length: count }, (_, index) => (
                    <span key={index} />
                  ))}
                </button>
              ))}
            </div>

            <div className="collection-sort" ref={sortRef}>
              <button
                type="button"
                className={`collection-facet${sortOpen ? " is-open" : ""}`}
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                onClick={() => {
                  setSortOpen((open) => !open);
                  setFacet(null);
                }}
              >
                Sort
              </button>
            </div>
            {facet || sortOpen ? (
              <button type="button" className="collection-close" aria-label="Close" onClick={closePanels}>
                <span />
                <span />
              </button>
            ) : null}
          </div>
        </div>

        <div className={`collection-panel${facet || sortOpen ? " is-open" : ""}`}>
          {sortOpen ? (
            <div className="collection-panel-options" role="listbox" aria-label="Sort products">
              {sortOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={sort === value}
                  className={`collection-option${sort === value ? " is-active" : ""}`}
                  onClick={() => {
                    setSort(value);
                    setSortOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : facet === "filters" ? (
            <div className="collection-panel-groups">
              {fits.length > 1 ? (
                <div className="collection-panel-options" role="group" aria-label="Fit">
                  {fits.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`collection-option${fit === value ? " is-active" : ""}`}
                      aria-pressed={fit === value}
                      onClick={() => toggleValue(fit, value, setFit)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ) : null}
              {priceBands.length > 1 ? (
                <div className="collection-panel-options" role="group" aria-label="Price">
                  {priceBands.map((band) => (
                    <button
                      key={band.id}
                      type="button"
                      className={`collection-option${priceBand === band.id ? " is-active" : ""}`}
                      aria-pressed={priceBand === band.id}
                      onClick={() => toggleValue(priceBand, band.id, setPriceBand)}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : facet ? (
            <div className="collection-panel-options" role="group" aria-label={facet}>
              {facetOptions[facet].map((option) => {
                const selected = facetValue[facet] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`collection-option${selected ? " is-active" : ""}`}
                    aria-pressed={selected}
                    onClick={() =>
                      toggleValue(facetValue[facet], option.value, setFacetValue[facet])
                    }
                  >
                    {option.hex ? (
                      <span className="collection-option-swatch" style={{ background: option.hex }} />
                    ) : null}
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <p className="sr-only">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}. Sorted by {sortLabel}
        {category ? `, category ${categoryLabel(category)}` : ""}
        {size ? `, size ${size}` : ""}
        {colour ? `, colour ${colour}` : ""}
        {fit ? `, fit ${fit}` : ""}
        {priceBand
          ? `, ${priceBandDefs.find((band) => band.id === priceBand)?.label ?? ""}`
          : ""}
      </p>

      <div className="collection-grid-wrap">
        {products.length === 0 ? (
          <p className="collection-empty">Pieces for this collection will appear here.</p>
        ) : filtered.length > 0 ? (
          <ProductGrid products={filtered} columns={columns} />
        ) : (
          <p className="collection-empty">No pieces match those filters.</p>
        )}
      </div>
    </div>
  );
}
