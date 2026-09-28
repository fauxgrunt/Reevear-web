"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const LEAVE_MS = 1000;
const ENTER_MS = 1000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isPlainClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function destination(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.origin !== window.location.origin) return null;
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function isMobile() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  const stageRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const pending = useRef(false);

  routerRef.current = router;

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    if (first.current) {
      first.current = false;
      return;
    }

    pending.current = false;
    node.style.pointerEvents = "";
    node.querySelectorAll("main, img, video, iframe").forEach((media) => {
      media.getAnimations().forEach((animation) => animation.cancel());
    });
    node.getAnimations().forEach((animation) => animation.cancel());

    if (prefersReducedMotion()) return;

    const enter = node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: ENTER_MS,
      easing: "ease",
      fill: "both",
    });
    enter.finished.then(() => enter.cancel()).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !isPlainClick(event)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const next = destination(anchor);
      if (!next) return;

      const node = stageRef.current;
      if (!node || prefersReducedMotion()) return;
      if (pending.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      pending.current = true;
      node.style.pointerEvents = "none";

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        routerRef.current.push(next);
      };

      const mobile = isMobile();
      const blurMs = mobile ? 800 : 400;

      if (mobile) {
        node.querySelectorAll("main").forEach((main) => {
          main.animate([{ filter: "blur(0px)" }, { filter: "blur(32px)" }], {
            duration: blurMs,
            easing: "ease",
            fill: "forwards",
          });
        });
      } else {
        node.querySelectorAll("main img, main video, main iframe").forEach((media) => {
          media.animate([{ filter: "blur(0px)" }, { filter: "blur(32px)" }], {
            duration: blurMs,
            easing: "ease",
            fill: "forwards",
          });
        });
      }

      node
        .querySelectorAll(".collection-card-meta, .collection-card-swatches")
        .forEach((card) => {
          card.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            easing: "ease",
            fill: "forwards",
          });
        });

      const fade = node.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: LEAVE_MS,
        easing: "ease",
        fill: "forwards",
      });

      fade.finished.then(go).catch(go);
      window.setTimeout(go, LEAVE_MS + 200);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className="page-transition">
      <div ref={stageRef} className="page-stage">
        {children}
      </div>
    </div>
  );
}
