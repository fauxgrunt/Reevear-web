import Image from "next/image";
import Link from "next/link";

type CategoryTile = {
  name: string;
  href: string;
  mediaSrc?: string;
  mediaAlt: string;
  aspectRatio: string;
};

const categories: CategoryTile[] = [
  {
    name: "Everyday",
    href: "/collections/everyday",
    mediaSrc: "/tiles/Everyday.jpeg",
    mediaAlt: "Man in an olive shirt over a white t-shirt",
    aspectRatio: "4 / 5",
  },
  {
    name: "Outerwear",
    href: "/collections/outerwear",
    mediaSrc: "/tiles/Outerwear.jpeg",
    mediaAlt: "Olive field jacket worn on a city street",
    aspectRatio: "4 / 5",
  },
  {
    name: "Denim & Trousers",
    href: "/collections/denim-trousers",
    mediaSrc: "/tiles/Jeans and Trousers.png",
    mediaAlt: "Mid-blue jeans worn with a white t-shirt",
    aspectRatio: "4 / 5",
  },
  {
    name: "Activewear",
    href: "/collections/activewear",
    mediaSrc: "/tiles/Activewear.jpeg",
    mediaAlt: "Man in a black performance shirt and training shorts in a gym",
    aspectRatio: "4 / 5",
  },
];

function CategoryCard({
  name,
  href,
  mediaSrc,
  mediaAlt,
  aspectRatio,
}: CategoryTile) {
  return (
    <Link href={href} className="home-campaign-tile" style={{ aspectRatio }}>
      <div className="home-campaign-media">
        {mediaSrc ? (
          <Image
            src={mediaSrc}
            alt={mediaAlt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
            style={name === "Activewear" ? { objectPosition: "center 18%" } : undefined}
            quality={95}
            priority={name === "Everyday"}
          />
        ) : (
          <div
            className="home-campaign-media-fill"
            role="img"
            aria-label={mediaAlt}
          />
        )}
      </div>
      <div className="home-campaign-caption">
        <h2 className="home-campaign-tile-title">{name}</h2>
        <span className="home-campaign-shop">
          Shop
          <span aria-hidden="true"> →</span>
        </span>
      </div>
    </Link>
  );
}

export function HomeCampaign() {
  return (
    <section className="home-campaign" aria-label="Shop by collection">
      {categories.map((category) => (
        <CategoryCard key={category.name} {...category} />
      ))}
    </section>
  );
}
