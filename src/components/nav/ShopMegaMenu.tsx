import Link from "next/link";
import { MegaTiles } from "@/components/nav/MegaTiles";
import { shopAllLink, shopFeatureTiles, shopMenuGroups } from "@/data/navigation";

export function ShopMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="home-mega-panel">
      <nav className="home-mega-nav" aria-label="Shop">
        <div className="home-mega-groups">
          {shopMenuGroups.map((group) => (
            <div key={group.label} className="home-mega-group">
              <Link
                href={group.href}
                className="home-mega-group-title"
                onClick={onNavigate}
              >
                {group.label}
              </Link>
              {group.links.length > 0 ? (
                <ul className="home-mega-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="home-mega-link"
                        onClick={onNavigate}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        <Link href={shopAllLink.href} className="home-mega-all" onClick={onNavigate}>
          {shopAllLink.label}
        </Link>
      </nav>
      <MegaTiles tiles={shopFeatureTiles} actionLabel="Shop" onNavigate={onNavigate} />
    </div>
  );
}
