import Link from "next/link";
import {
  exploreMenuLinks,
  mobileMenuFoot,
  mobileShopLinks,
} from "@/data/navigation";

type MobileGroup = "shop" | "explore" | null;

export function MobileNavigation({
  open,
  group,
  menuId,
  onClose,
  onToggleGroup,
}: {
  open: boolean;
  group: MobileGroup;
  menuId: string;
  onClose: () => void;
  onToggleGroup: (next: Exclude<MobileGroup, null>) => void;
}) {
  const shopOpen = group === "shop";
  const exploreOpen = group === "explore";

  return (
    <div id={menuId} className={`home-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="home-menu-panel" data-open={open}>
        <div className="home-menu-inner">
          <nav className="home-menu-nav" aria-label="Mobile">
            <Link
              href="/collections/new-in"
              className="home-menu-link"
              tabIndex={open ? 0 : -1}
              onClick={onClose}
            >
              New In
            </Link>

            <div className={`home-menu-group${shopOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="home-menu-link home-menu-link-toggle"
                aria-expanded={shopOpen}
                tabIndex={open ? 0 : -1}
                onClick={() => onToggleGroup("shop")}
              >
                Shop
                <span aria-hidden="true">{shopOpen ? "−" : "+"}</span>
              </button>
              <div className="home-menu-sub">
                <div className="home-menu-sub-inner">
                  {mobileShopLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="home-menu-sublink"
                      tabIndex={open && shopOpen ? 0 : -1}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className={`home-menu-group${exploreOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="home-menu-link home-menu-link-toggle"
                aria-expanded={exploreOpen}
                tabIndex={open ? 0 : -1}
                onClick={() => onToggleGroup("explore")}
              >
                Explore
                <span aria-hidden="true">{exploreOpen ? "−" : "+"}</span>
              </button>
              <div className="home-menu-sub">
                <div className="home-menu-sub-inner">
                  {exploreMenuLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="home-menu-sublink"
                      tabIndex={open && exploreOpen ? 0 : -1}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="home-menu-foot">
            {mobileMenuFoot.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="home-menu-foot-link"
                tabIndex={open ? 0 : -1}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
