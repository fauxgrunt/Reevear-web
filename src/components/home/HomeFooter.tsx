"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { submitNewsletter } from "@/app/actions/newsletter";

const shop = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Everyday", href: "/collections/everyday" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "Denim & Trousers", href: "/collections/denim-trousers" },
  { label: "Activewear", href: "/collections/activewear" },
  { label: "Shop All", href: "/collections/all" },
] as const;

const explore = [
  { label: "Our Story", href: "/pages/our-story" },
  { label: "Made to Move", href: "/pages/made-to-move" },
  { label: "Signature Pieces", href: "/pages/signature-pieces" },
  { label: "Contact", href: "/pages/contact" },
] as const;

const help = [
  { label: "Shipping & Delivery", href: "/pages/shipping" },
  { label: "Returns & Refunds", href: "/pages/returns" },
  { label: "Size Guide", href: "/pages/size-guide" },
] as const;

const legal = [
  { label: "Privacy", href: "/pages/privacy" },
  { label: "Cookies", href: "/pages/cookies" },
  { label: "Terms", href: "/pages/terms" },
] as const;

const social = [
  { label: "Instagram", href: "https://www.instagram.com/reevear" },
  { label: "TikTok", href: "https://www.tiktok.com/@reevear" },
] as const;

function SubscribeForm() {
  const emailId = useId();
  const consentId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "failed">(
    "idle",
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !consent) {
      setStatus("error");
      return;
    }

    setPending(true);
    let result: Awaited<ReturnType<typeof submitNewsletter>>;
    try {
      result = await submitNewsletter(new FormData(event.currentTarget));
    } catch {
      setPending(false);
      setStatus("failed");
      return;
    }
    setPending(false);

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.code === "invalid" || result.code === "invalid-email") {
      setStatus("error");
      return;
    }

    setStatus("failed");
  };

  if (status === "success") {
    return (
      <p className="home-footer-thanks" role="status">
        Thank you. We’ve received your signup.
      </p>
    );
  }

  return (
    <form className="home-footer-form-wrap" onSubmit={onSubmit}>
      <div className="home-footer-form">
        <label className="sr-only" htmlFor={emailId}>
          Your email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Your email address*"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" aria-label="Subscribe" disabled={pending}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <label className="home-footer-consent" htmlFor={consentId}>
        <input
          id={consentId}
          type="checkbox"
          name="consent"
          checked={consent}
          required
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I want emails about Reevear collections and offers. See{" "}
          <Link href="/pages/privacy">Privacy</Link>. You can unsubscribe later.
        </span>
      </label>
      {status === "error" ? (
        <p id={statusId} className="home-footer-form-error" role="alert">
          Enter your email and tick the box if you want marketing emails. The
          box is not ticked for you.
        </p>
      ) : null}
      {status === "failed" ? (
        <p id={statusId} className="home-footer-form-error" role="alert">
          Signup could not be sent. Please try again.
        </p>
      ) : null}
    </form>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="home-footer-group-title">{title}</p>
      <ul className="home-footer-list">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    let frame = 0;

    const update = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        footer.style.transform = "none";
        return;
      }

      const top = footer.offsetTop;
      const height = footer.offsetHeight;
      const view = window.innerHeight;
      const start = top - view;
      const end = top + height - view;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / Math.max(1, end - start)),
      );
      footer.style.transform = `translateY(${(1 - progress) * 40}%)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <footer ref={footerRef} className="home-footer">
      <div className="home-footer-sheet">
        <h2 className="home-footer-title">
          <span>Made to be</span>
          <span>worn.</span>
        </h2>

        <div className="home-footer-main">
          <div className="home-footer-menus">
            <FooterGroup title="Shop" links={shop} />
            <FooterGroup title="Explore" links={explore} />
            <FooterGroup title="Help" links={help} />
            <div>
              <FooterGroup title="Legal" links={legal} />
              <ul className="home-footer-list home-footer-social">
                {social.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="home-footer-subscribe">
            <p className="home-footer-kicker">Stay in touch</p>
            <SubscribeForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
