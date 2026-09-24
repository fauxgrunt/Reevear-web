import Image from "next/image";
import Link from "next/link";
import { HomeProductCarousel } from "@/components/home/HomeProductCarousel";
import { getProductsByIds } from "@/data/products";

const SALE_HREF = "/collections/sale";
const SALE_MEDIA_SRC = "/sale-banner.jpg";
const SALE_MEDIA_ALT = "Folded olive jacket and cream knit on pale stone";
const SELECTED_HREF = "/collections/all";
const selectedProductIds = ["5", "14", "8", "10", "13"] as const;

export function HomeSale() {
  const pieces = getProductsByIds(selectedProductIds);

  return (
    <>
      {pieces.length > 0 ? (
        <section className="home-arrivals home-selected" aria-label="Selected pieces">
          <div className="home-arrivals-copy">
            <h2 className="home-arrivals-headline home-shelf-headline">
              <span>Selected</span>
              <span>Pieces</span>
            </h2>
            <p className="home-arrivals-lede">A few pieces, selected for now.</p>
            <Link href={SELECTED_HREF} className="home-arrivals-cta">
              Shop all
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <HomeProductCarousel
            products={pieces}
            ariaLabel="Selected piece products"
            dotsLabel="Selected piece slides"
          />
        </section>
      ) : null}

      <section className="home-sale-end" aria-label="Sale">
        <Link href={SALE_HREF} className="home-sale-tile">
          <div className="home-sale-media">
            <Image
              src={SALE_MEDIA_SRC}
              alt={SALE_MEDIA_ALT}
              fill
              sizes="100vw"
              quality={95}
              unoptimized
              className="home-sale-image object-cover"
            />
          </div>
          <div className="home-sale-copy">
            <h2 className="home-sale-headline">
              <span>Made to last.</span>
              <span>Priced for now.</span>
            </h2>
            <span className="home-sale-cta">
              Shop the sale
              <span aria-hidden="true"> →</span>
            </span>
          </div>
        </Link>
      </section>
    </>
  );
}
