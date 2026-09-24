import Image from "next/image";
import Link from "next/link";

const HERO_DESKTOP_SRC = "/Hero/hero-editorial.jpg";
const HERO_MOBILE_SRC = "/Hero/hero-mobile.jpg";
const HERO_ALT = "Man wearing an olive field jacket and grey trousers";

function HeroCopy() {
  return (
    <div className="home-hero-copy">
      <h1 className="home-hero-headline">
        <span>Made to be </span>
        <span>Worn.</span>
      </h1>
      <p className="home-hero-lede">Every day. All week. Your way.</p>
      <Link href="/collections/new-in" className="home-discover">
        Discover
        <span aria-hidden> →</span>
      </Link>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="home-hero">
      <Image
        src={HERO_DESKTOP_SRC}
        alt={HERO_ALT}
        fill
        priority
        sizes="100vw"
        quality={95}
        unoptimized
        className="home-hero-image home-hero-image--desktop object-cover"
      />
      <Image
        src={HERO_MOBILE_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={95}
        unoptimized
        className="home-hero-image home-hero-image--mobile object-cover"
      />
      <HeroCopy />
    </section>
  );
}
