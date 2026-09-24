"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import type { ShopProduct } from "@/data/products";

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="home-arrivals-arrow-icon">
      {direction === "prev" ? (
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 5.5 16 12l-6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function ProductCaption({
  product,
  showPlus,
}: {
  product: ShopProduct;
  showPlus?: boolean;
}) {
  return (
    <div className="home-arrivals-meta">
      <p className="home-arrivals-name">{product.name}</p>
      {showPlus ? (
        <span className="home-arrivals-plus" aria-hidden="true">
          +
        </span>
      ) : null}
      <p className="home-arrivals-price">
        {product.compareAtPrice ? (
          <>
            <span className="home-arrivals-price-was">{product.compareAtPrice}</span>
            {product.price}
          </>
        ) : (
          product.price
        )}
      </p>
    </div>
  );
}

type HomeProductCarouselProps = {
  products: ShopProduct[];
  ariaLabel: string;
  dotsLabel: string;
  showPlus?: boolean;
};

export function HomeProductCarousel({
  products,
  ariaLabel,
  dotsLabel,
  showPlus = false,
}: HomeProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, dragging: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(products.length > 1);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const slideWidth = slide ? slide.getBoundingClientRect().width + gap : clientWidth;
    const index = slideWidth > 0 ? Math.round(scrollLeft / slideWidth) : 0;

    setActive(Math.min(products.length - 1, Math.max(0, index)));
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, [products.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollBySlide = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
    el.scrollBy({
      left: direction * (slide.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
    el.scrollTo({
      left: index * (slide.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="home-arrivals-slider">
      <div
        ref={scrollerRef}
        className="home-arrivals-track"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollBySlide(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollBySlide(-1);
          }
        }}
        onPointerDown={(event) => {
          dragRef.current = { startX: event.clientX, dragging: false };
        }}
        onPointerMove={(event) => {
          if (Math.abs(event.clientX - dragRef.current.startX) > 8) {
            dragRef.current.dragging = true;
          }
        }}
        onPointerUp={() => {
          window.setTimeout(() => {
            dragRef.current.dragging = false;
          }, 0);
        }}
      >
        {products.map((product) => (
          <article key={product.id} className="home-arrivals-slide" data-slide>
            <Link
              href={`/products/${product.slug}`}
              className="home-arrivals-link group"
              onClick={(event) => {
                if (dragRef.current.dragging) event.preventDefault();
              }}
            >
              <div className="home-arrivals-media">
                <ProductMedia
                  src={product.media.primary}
                  hoverSrc={product.media.hover}
                  alt={product.name}
                  className="absolute inset-0"
                  sizes="(max-width: 1023px) 89vw, 36vw"
                />
              </div>
              <ProductCaption product={product} showPlus={showPlus} />
            </Link>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="home-arrivals-arrow home-arrivals-arrow-prev"
        aria-label="Previous products"
        disabled={!canPrev}
        onClick={() => scrollBySlide(-1)}
      >
        <ArrowIcon direction="prev" />
      </button>
      <button
        type="button"
        className="home-arrivals-arrow home-arrivals-arrow-next"
        aria-label="Next products"
        disabled={!canNext}
        onClick={() => scrollBySlide(1)}
      >
        <ArrowIcon direction="next" />
      </button>

      <div className="home-arrivals-dots" aria-label={dotsLabel}>
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Show ${product.name}`}
            aria-current={index === active ? "true" : undefined}
            className="home-arrivals-dot"
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
