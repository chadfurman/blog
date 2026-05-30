---
name: frontend-ux-stack
description: Frontend is a Next.js app-router portfolio using Tailwind with custom design tokens and hand-rolled accessibility (no component library)
metadata:
  type: project
---

The `frontend/` app is Next.js (app router, "use client" components) styled with Tailwind. Portfolio UI lives under `frontend/src/app/_components/portfolio/`.

Key observations relevant to UX review:
- No component library (no Chakra/Radix/MUI). Interactive widgets are hand-built raw HTML + ARIA, so a11y correctness (focus trap, focus restore, aria-activedescendant) must be manually verified — it is not provided by a library.
- Design uses custom CSS tokens: `text-on-surface`, `text-on-surface-variant`, `border-border-subtle`, `text-brand`, `glass-card`, `bg-surface-deep`. Flag raw hex/hardcoded colors as divergence (note: DependencyGraph.tsx canvas uses raw rgb strings, which is acceptable for canvas drawing, not CSS).
- `prefers-reduced-motion` handling is centralized in `frontend/src/app/globals.css` (animation: none rules) plus per-component JS checks (e.g. DependencyGraph reads matchMedia).
- Mobile nav is a hamburger dropdown (`md:hidden`) in SiteNav.tsx; desktop-only controls use `hidden md:inline-flex`.

**Why:** Lets future reviews target the right a11y risks (manual ARIA correctness) and the right consistency baseline (token system).

**How to apply:** For new interactive elements, verify focus management end-to-end rather than assuming a library handles it. For any desktop-only (`md:`) control, check the mobile dropdown has an equivalent entry point. Verified 2026-05-30.
