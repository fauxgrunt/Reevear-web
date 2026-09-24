import Image from "next/image";
import Link from "next/link";
import type { NavTile } from "@/data/navigation";

export function MegaTiles({
  tiles,
  onNavigate,
  actionLabel,
}: {
  tiles: readonly NavTile[];
  onNavigate: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="home-mega-cards">
      {tiles.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="home-mega-card"
          onClick={onNavigate}
        >
          <span className="home-mega-card-media">
            {tile.mediaSrc ? (
              <Image
                src={tile.mediaSrc}
                alt={tile.mediaAlt ?? ""}
                fill
                sizes="(min-width: 1280px) 22vw, 30vw"
                className="object-cover"
                style={
                  tile.objectPosition
                    ? { objectPosition: tile.objectPosition }
                    : undefined
                }
                quality={95}
              />
            ) : null}
          </span>
          <span className="home-mega-card-copy">
            <span className="home-mega-card-title">{tile.label}</span>
            {actionLabel ? (
              <span className="home-mega-card-shop">{actionLabel}</span>
            ) : null}
          </span>
        </Link>
      ))}
    </div>
  );
}
