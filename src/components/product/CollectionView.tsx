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
  shirts: "Shirts",
  hoodies: "Hoodies",
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

export function CollectionView({
  title,
  description,
  products,
}: CollectionViewProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(null);
  const [fit, setFit] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const closeFilterRef = useRef<HTMLButtonElement>(null);

  const sizes = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) =>
      product.sizes.forEach((entry) => values.add(entry.label)),
    );
    return [...values];
  }, [products]);

  const colours = useMemo(() => {
    const values = new Set<string>();
    products.forEach((product) =>
      product.colourVariants.forEach((entry) => values.add(entry.name)),
    );
    return [...values];
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
        product.colourVariants.some((entry) => entry.name === colour),
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
    setFilterOpen(false);
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
    const onPointerDown = (event: PointerEvent) => {
      if (!sortOpen) return;
      if (sortRef.current?.contains(event.target as Node)) return;
      setSortOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [sortOpen]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const lock = filterOpen && mobile.matches;
    document.body.style.overflow = lock ? "hidden" : "";
    if (lock) closeFilterRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const toggleValue = (
    current: string | null,
    next: string,
    setValue: (value: string | null) => void,
  ) => {
    setValue(current === next ? null : next);
  };

  return (
    <div className="collection-page">
      <header className="collection-intro">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="collection-toolbar">
        <div className="collection-toolbar-actions">
          <button
            type="button"
            className="collection-control"
            aria-expanded={filterOpen}
            aria-controls="collection-filters"
            onClick={() => {
              setFilterOpen((open) => !open);
              setSortOpen(false);
            }}
          >
            Filters
            {activeCount > 0 ? <span>({activeCount})</span> : null}
          </button>

          <div className="collection-sort" ref={sortRef}>
            <button
              type="button"
              className="collection-control"
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setSortOpen((open) => !open);
                setFilterOpen(false);
              }}
            >
              Sort
            </button>
            <ul
              className={`collection-sort-menu${sortOpen ? " is-open" : ""}`}
              role="listbox"
              aria-hidden={!sortOpen}
              aria-label="Sort products"
            >
              {sortOptions.map(([value, label]) => (
                <li key={value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sort === value}
                    className={sort === value ? "is-active" : ""}
                    tabIndex={sortOpen ? 0 : -1}
                    onClick={() => {
                      setSort(value);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="collection-count">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div
        id="collection-filters"
        className={`collection-filters${filterOpen ? " is-open" : ""}`}
        aria-hidden={!filterOpen}
      >
        <button
          type="button"
          className="collection-filters-backdrop"
          tabIndex={filterOpen ? 0 : -1}
          aria-label="Close filters"
          onClick={() => setFilterOpen(false)}
        />
        <div className="collection-filters-panel">
          <div className="collection-filters-inner">
          <div className="collection-filters-top">
            <p>Filters</p>
            <button
              ref={closeFilterRef}
              type="button"
              className="collection-control"
              aria-label="Close filters"
              tabIndex={filterOpen ? 0 : -1}
              onClick={() => setFilterOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="collection-filter-grid">
            {categories.length > 1 ? (
              <fieldset>
                <legend>Category</legend>
                <div className="collection-filter-options">
                  {categories.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`shop-chip${category === value ? " is-active" : ""}`}
                      tabIndex={filterOpen ? 0 : -1}
                      onClick={() => toggleValue(category, value, setCategory)}
                    >
                      {categoryLabel(value)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {sizes.length > 0 ? (
              <fieldset>
                <legend>Size</legend>
                <div className="collection-filter-options">
                  {sizes.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`shop-chip${size === value ? " is-active" : ""}`}
                      tabIndex={filterOpen ? 0 : -1}
                      onClick={() => toggleValue(size, value, setSize)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {colours.length > 1 ? (
              <fieldset>
                <legend>Colour</legend>
                <div className="collection-filter-options">
                  {colours.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`shop-chip${colour === value ? " is-active" : ""}`}
                      tabIndex={filterOpen ? 0 : -1}
                      onClick={() => toggleValue(colour, value, setColour)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {priceBands.length > 1 ? (
              <fieldset>
                <legend>Price</legend>
                <div className="collection-filter-options">
                  {priceBands.map((band) => (
                    <button
                      key={band.id}
                      type="button"
                      className={`shop-chip${priceBand === band.id ? " is-active" : ""}`}
                      tabIndex={filterOpen ? 0 : -1}
                      onClick={() => toggleValue(priceBand, band.id, setPriceBand)}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {fits.length > 0 ? (
              <fieldset>
                <legend>Fit</legend>
                <div className="collection-filter-options">
                  {fits.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`shop-chip${fit === value ? " is-active" : ""}`}
                      tabIndex={filterOpen ? 0 : -1}
                      onClick={() => toggleValue(fit, value, setFit)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          {activeCount > 0 ? (
            <button
              type="button"
              className="collection-clear"
              tabIndex={filterOpen ? 0 : -1}
              onClick={clearFilters}
            >
              Clear all
            </button>
          ) : null}
          </div>
        </div>
      </div>

      <p className="sr-only">
        Sorted by {sortLabel}
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
          <ProductGrid products={filtered} />
        ) : (
          <p className="collection-empty">No pieces match those filters.</p>
        )}
      </div>
    </div>
  );
}
