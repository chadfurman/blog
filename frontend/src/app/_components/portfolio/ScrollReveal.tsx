"use client";

import {useEffect} from "react";

// Reveals any [data-reveal] element as it scrolls into view (adds .reveal-in).
// Respects reduced-motion and degrades to "show everything" without IO support.
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.12, rootMargin: "0px 0px -8% 0px"},
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
