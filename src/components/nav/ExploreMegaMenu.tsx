import Link from "next/link";
import { MegaTiles } from "@/components/nav/MegaTiles";
import { exploreFeatureTiles, exploreMenuLinks } from "@/data/navigation";

export function ExploreMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="home-mega-panel home-mega-panel-explore">
      <nav className="home-mega-nav home-mega-nav-explore" aria-label="Explore">
        <ul className="home-mega-explore-list">
          {exploreMenuLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="home-mega-explore-link"
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <MegaTiles tiles={exploreFeatureTiles} onNavigate={onNavigate} />
    </div>
  );
}
