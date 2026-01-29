import { useEffect, useRef } from "react";

/**
 * Locks document scrolling without losing the current scroll position.
 * Uses the "body position: fixed" technique which is reliable on mobile Safari.
 */
export function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);
  const previousBodyCssTextRef = useRef<string | null>(null);
  const previousHtmlCssTextRef = useRef<string | null>(null);

  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const html = document.documentElement;

    scrollYRef.current = window.scrollY;
    previousBodyCssTextRef.current = body.style.cssText;
    previousHtmlCssTextRef.current = html.style.cssText;

    // Prevent scroll chaining / rubber banding.
    html.style.overscrollBehavior = "none";

    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      // Restore styles exactly.
      body.style.cssText = previousBodyCssTextRef.current ?? "";
      html.style.cssText = previousHtmlCssTextRef.current ?? "";

      window.scrollTo({ top: scrollYRef.current, behavior: "auto" });
    };
  }, [locked]);
}
