import Link from "next/link";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";
import { collectionPages } from "@/data/navigation";
import { getProductsByIds } from "@/data/products";

export function HomeArrivals() {
  const pieces = getProductsByIds(collectionPages["new-in"].productIds);

  if (pieces.length === 0) return null;

  return (
    <section className="home-arrivals" aria-label="New arrivals">
      <div className="home-arrivals-copy">
        <h2 className="home-arrivals-headline">New Arrivals</h2>
        <p className="home-arrivals-lede">In our latest styles.</p>
        <Link href="/collections/new-in" className="home-arrivals-cta">
          Shop now
          <span aria-hidden="true"> →</span>
        </Link>
      </div>

      <HomeProductCarousel
        products={pieces}
        ariaLabel="New arrival products"
        dotsLabel="New arrival slides"
        showPlus
      />
    </section>
  );
}
