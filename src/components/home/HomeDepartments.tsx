import Image from "next/image";
import Link from "next/link";

const MOVE_HREF = "/collections/activewear";
const MOVE_MEDIA_SRC = "/tiles/made-to-move.jpg";
const MOVE_MEDIA_ALT = "Man in a black performance shirt training in a gym";

export function HomeDepartments() {
  return (
    <section className="home-move" aria-label="Made to move">
      <Link href={MOVE_HREF} className="home-move-tile">
        <div className="home-move-media">
          {MOVE_MEDIA_SRC ? (
            <Image
              src={MOVE_MEDIA_SRC}
              alt={MOVE_MEDIA_ALT}
              fill
              sizes="100vw"
              className="object-cover"
              quality={95}
            />
          ) : (
            <div className="home-move-fill" aria-hidden="true" />
          )}
        </div>
        <div className="home-move-copy">
          <h2 className="home-move-headline">Made to move</h2>
          <p className="home-move-lede">
            Performance pieces for training and everyday life.
          </p>
          <span className="home-move-cta">
            Explore activewear
            <span aria-hidden="true"> →</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
