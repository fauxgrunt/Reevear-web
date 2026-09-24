"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useCart } from "@/components/cart/CartProvider";
import { ExploreMegaMenu } from "@/components/nav/ExploreMegaMenu";
import { MobileNavigation } from "@/components/nav/MobileNavigation";
import { ShopMegaMenu } from "@/components/nav/ShopMegaMenu";
import { searchCollections, searchPopular } from "@/data/navigation";
import { products } from "@/data/products";

type Mega = "shop" | "explore" | null;
type MobileGroup = "shop" | "explore" | null;

function SearchIcon() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="home-nav-icon">
      <circle cx="9.5" cy="9.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M14.2 14.2 19 19" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="home-nav-icon">
      <circle cx="11" cy="7.2" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M4.8 18.2c.8-3.2 3.2-5 6.2-5s5.4 1.8 6.2 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className="home-nav-icon">
      <path
        d="M6 8.2h10l-.7 9.2H6.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 8.2V7.1a2.8 2.8 0 0 1 5.6 0v1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className={`home-burger${open ? " is-open" : ""}`} aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export function GlobalHeader() {
  const { count, items } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<MobileGroup>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mega, setMega] = useState<Mega>(null);
  const menuId = useId();
  const searchId = useId();
  const searchFieldId = useId();
  const bagId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const megaTimer = useRef<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMobileGroup(null);
    setMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeMenu();
    setMega(null);
    setSearchOpen(false);
    setBagOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeMenu();
      setSearchOpen(false);
      setBagOpen(false);
      setMega(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen || bagOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen, bagOpen]);

  useEffect(() => {
    if (menuOpen) closeRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!mega && !searchOpen) return;
      const node = event.target as Node;
      if (shellRef.current?.contains(node)) return;
      setMega(null);
      setSearchOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [mega, searchOpen]);

  const results = query.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];

  const trending = products.filter((product) => product.featured).slice(0, 4);
  const solid =
    (mounted && pathname !== "/") ||
    scrolled ||
    menuOpen ||
    searchOpen ||
    bagOpen ||
    mega !== null;

  useEffect(() => {
    const onResize = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      closeMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openMega = (next: Mega) => {
    window.clearTimeout(megaTimer.current);
    if (next) {
      setSearchOpen(false);
      setBagOpen(false);
    }
    setMega(next);
  };

  const closeMega = () => {
    window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMega(null), 160);
  };

  const keepMega = () => window.clearTimeout(megaTimer.current);

  const toggleMobileGroup = (next: Exclude<MobileGroup, null>) => {
    setMobileGroup((current) => (current === next ? null : next));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        solid ? "home-header-solid" : "home-header-clear"
      }`}
    >
      <p className="home-announce">Complimentary UK shipping</p>

      <div
        ref={shellRef}
        className="home-nav-shell"
        onMouseLeave={closeMega}
        onMouseEnter={keepMega}
      >
        <div className="home-nav-bar">
          <button
            ref={closeRef}
            type="button"
            className="home-nav-icon-btn home-nav-mobile-only"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => {
              setSearchOpen(false);
              setBagOpen(false);
              setMega(null);
              if (menuOpen) closeMenu();
              else {
                setMobileGroup(null);
                setMenuOpen(true);
              }
            }}
          >
            <BurgerIcon open={menuOpen} />
          </button>

          <Link href="/" aria-label="Reevear home" className="home-nav-logo">
            <BrandLogo variant="header" />
          </Link>

          <nav className="home-nav-center" aria-label="Primary">
            <Link
              href="/collections/new-in"
              className="home-nav-link"
              onMouseEnter={() => openMega(null)}
            >
              New In
            </Link>
            <div className={`home-nav-item${mega === "shop" ? " is-open" : ""}`}>
              <button
                type="button"
                className="home-nav-link"
                aria-expanded={mega === "shop"}
                aria-haspopup="true"
                onMouseEnter={() => openMega("shop")}
                onFocus={() => openMega("shop")}
                onClick={() => openMega(mega === "shop" ? null : "shop")}
              >
                Shop
              </button>
            </div>
            <div className={`home-nav-item${mega === "explore" ? " is-open" : ""}`}>
              <button
                type="button"
                className="home-nav-link"
                aria-expanded={mega === "explore"}
                aria-haspopup="true"
                onMouseEnter={() => openMega("explore")}
                onFocus={() => openMega("explore")}
                onClick={() => openMega(mega === "explore" ? null : "explore")}
              >
                Explore
              </button>
            </div>
          </nav>

          <div className="home-nav-actions">
            <button
              type="button"
              className="home-nav-icon-btn"
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-controls={searchId}
              onMouseEnter={() => openMega(null)}
              onFocus={() => openMega(null)}
              onClick={() => {
                closeMenu();
                setMega(null);
                setBagOpen(false);
                setSearchOpen((value) => !value);
              }}
            >
              <SearchIcon />
            </button>
            <Link
              href="/pages/account"
              className="home-nav-icon-btn home-nav-desktop-only"
              aria-label="Account"
              onMouseEnter={() => openMega(null)}
              onFocus={() => openMega(null)}
            >
              <AccountIcon />
            </Link>
            <button
              type="button"
              className={`home-nav-icon-btn${count > 0 ? " has-count" : ""}`}
              aria-label={count > 0 ? `Bag, ${count} items` : "Bag"}
              aria-expanded={bagOpen}
              aria-controls={bagId}
              onMouseEnter={() => openMega(null)}
              onFocus={() => openMega(null)}
              onClick={() => {
                closeMenu();
                setMega(null);
                setSearchOpen(false);
                setBagOpen((value) => !value);
              }}
            >
              <BagIcon />
              {count > 0 ? <span className="home-nav-bag-count">{count}</span> : null}
            </button>
          </div>
        </div>

        <div className={`home-mega${mega ? " is-open" : ""}`} aria-hidden={!mega}>
          {mega === "explore" ? (
            <ExploreMegaMenu onNavigate={() => setMega(null)} />
          ) : (
            <ShopMegaMenu onNavigate={() => setMega(null)} />
          )}
        </div>

        <div
          id={searchId}
          className={`home-search-panel${searchOpen ? " is-open" : ""}`}
          aria-hidden={!searchOpen}
        >
          <div className="home-search-inner">
            <label htmlFor={searchFieldId} className="sr-only">
              Search products
            </label>
            <input
              ref={searchInputRef}
              id={searchFieldId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search"
              className="home-search-input"
              tabIndex={searchOpen ? 0 : -1}
            />

            {results.length > 0 ? (
              <ul className="home-search-results">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="home-search-result"
                      onClick={() => setSearchOpen(false)}
                      tabIndex={searchOpen ? 0 : -1}
                    >
                      <span>{product.name}</span>
                      <span>{product.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="home-search-grid">
                <div>
                  <p className="home-search-heading">Popular collections</p>
                  <ul className="home-search-aside">
                    {searchCollections.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setSearchOpen(false)}
                          tabIndex={searchOpen ? 0 : -1}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="home-search-heading">Popular searches</p>
                  <ul className="home-search-aside">
                    {searchPopular.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setSearchOpen(false)}
                          tabIndex={searchOpen ? 0 : -1}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="home-search-heading">Trending items</p>
                  <ul className="home-search-aside">
                    {trending.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          tabIndex={searchOpen ? 0 : -1}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <aside
        id={bagId}
        className={`home-bag${bagOpen ? " is-open" : ""}`}
        aria-hidden={!bagOpen}
        aria-label="Bag"
      >
        <div className="home-bag-head">
          <h2>Bag</h2>
          <button
            type="button"
            className="home-nav-icon-btn"
            aria-label="Close bag"
            tabIndex={bagOpen ? 0 : -1}
            onClick={() => setBagOpen(false)}
          >
            Close
          </button>
        </div>
        {items.length === 0 ? (
          <div className="home-bag-empty">
            <p>Your bag is empty</p>
            <Link
              href="/collections/all"
              tabIndex={bagOpen ? 0 : -1}
              onClick={() => setBagOpen(false)}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="home-bag-list">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.colour}`}>
                  <p>{item.name}</p>
                  <p>
                    {item.size} · {item.colour} · {item.quantity}
                  </p>
                  <p>{item.price}</p>
                </li>
              ))}
            </ul>
            <div className="home-bag-actions">
              <Link
                href="/checkout"
                tabIndex={bagOpen ? 0 : -1}
                onClick={() => setBagOpen(false)}
              >
                Checkout
              </Link>
              <Link
                href="/collections/all"
                tabIndex={bagOpen ? 0 : -1}
                onClick={() => setBagOpen(false)}
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>

      <MobileNavigation
        open={menuOpen}
        group={mobileGroup}
        menuId={menuId}
        onClose={closeMenu}
        onToggleGroup={toggleMobileGroup}
      />
    </header>
  );
}
