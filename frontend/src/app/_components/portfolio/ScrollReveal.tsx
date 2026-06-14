"use client";

import {useEffect} from "react";

// Reveals [data-reveal] elements as they scroll into view (adds .reveal-in).
// Elements are grouped by their nearest [data-reveal-group] or <section>, and a
// whole group reveals together the moment that section enters view — so a
// heading and its content fade in at the same time instead of staggering as you
// scroll. Per-item --reveal-delay still cascades within the group.
// Respects reduced-motion and degrades to "show everything" without IO support.
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    // Group each element under the container that should trigger its reveal.
    const groups = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const root = el.closest("[data-reveal-group]") ?? el.closest("section") ?? el;
      const members = groups.get(root);
      if (members) members.push(el);
      else groups.set(root, [el]);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const member of groups.get(entry.target) ?? []) {
            member.classList.add("reveal-in");
          }
          io.unobserve(entry.target);
        }
      },
      {threshold: 0, rootMargin: "0px 0px -12% 0px"},
    );

    groups.forEach((_members, root) => io.observe(root));
    return () => io.disconnect();
  }, []);

  return null;
}
