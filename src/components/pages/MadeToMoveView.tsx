import Link from "next/link";
import { Placeholder } from "@/components/pages/Placeholder";

export function MadeToMoveView() {
  return (
    <article className="foundation-page move-page">
      <Link href="/collections/activewear" className="move-page-hero">
        <div className="move-page-media" aria-hidden="true" />
        <div className="move-page-copy">
          <h1>Made to move</h1>
          <p>Performance pieces for training and everyday life.</p>
          <span className="foundation-cta foundation-cta-on-dark">
            Explore activewear
            <span aria-hidden="true"> →</span>
          </span>
        </div>
      </Link>

      <div className="editorial-prose">
        <p>
          Made to Move is Reevear activewear: pieces intended for training and
          for sporty everyday wear. It is not a separate lifestyle brand, and it
          is not a women’s collection.
        </p>
        <p>
          The current activewear line is small. What is listed on the Activewear
          collection is what is available now.
        </p>
      </div>

      <div className="move-page-split">
        <div className="editorial-media" role="img" aria-label="Reevear activewear campaign media" />
        <section>
          <h2>Training, then the rest of the day</h2>
          <p>
            The campaign is written for movement that does not stop at the gym
            door — training, travel, and ordinary days that still ask something
            of the clothes.
          </p>
          <p>
            Technical claims, fabrics, and manufacturing details will be added
            here only when they can be confirmed.{" "}
            <Placeholder>[PRODUCT AND FABRIC DETAIL TO BE ADDED]</Placeholder>
          </p>
        </section>
      </div>

      <div className="editorial-close">
        <h2>Shop the collection</h2>
        <p>
          See the current activewear pieces, with prices and sizes as listed.
        </p>
        <Link href="/collections/activewear" className="foundation-cta">
          Explore activewear
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}
