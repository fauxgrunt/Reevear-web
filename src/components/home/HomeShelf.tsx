import Link from "next/link";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";
import { collectionPages } from "@/data/navigation";
import { getProductsByIds } from "@/data/products";

export function HomeShelf() {
  const pieces = getProductsByIds(collectionPages["signature-pieces"].productIds);

  if (pieces.length === 0) return null;

  return (
    <section className="home-arrivals home-shelf" aria-label="Signature pieces">
      <div className="home-arrivals-copy">
        <h2 className="home-arrivals-headline home-shelf-headline">
          <span>Signature</span>
          <span>Pieces</span>
        </h2>
        <p className="home-arrivals-lede">
          A selection of pieces that define Reevear.
        </p>
        <Link href="/collections/all" className="home-arrivals-cta">
          Shop all
          <span aria-hidden="true"> →</span>
        </Link>
      </div>

      <HomeProductCarousel
        products={pieces}
        ariaLabel="Signature piece products"
        dotsLabel="Signature piece slides"
      />
    </section>
  );
}
