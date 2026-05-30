---
name: portfolio-risk-profile
description: Risk characteristics of the frontend/ portfolio app — static export, trusted-data palette, canvas rAF hero
metadata:
  type: project
---

The `frontend/` app is a Next.js 15 **static export** personal portfolio (no server runtime, no DB, no auth).

**Security posture is intentionally thin.** All navigable data lives in `frontend/src/data/portfolio.ts` (navLinks, projects, profile.github/linkedin/email) — trusted, in-repo constants compiled into the bundle. The ⌘K CommandPalette (`_components/portfolio/CommandPalette.tsx`) navigates only from that static list; the only untrusted input is a local filter string used for `String.includes` matching, never for navigation. So injection / open-redirect threat models mostly do NOT apply here.

**How to apply:** Don't invent untrusted-input threats for this app. Real security findings would require a NEW data source (user content, query params, CMS, external fetch). `window.open(..., "noopener,noreferrer")` is already used correctly.

**Performance hot path:** `DependencyGraph.tsx` is the one rAF render loop. Node count is hard-capped (`Math.min(52, ...)`), edges derived from 2-3 nearest neighbors (deduped, ≲80). `nearestNeighbors` is O(n²·log n) but init-only on ≤52 nodes (~trivial). Loop correctly pauses on `visibilitychange`, honors prefers-reduced-motion, and cleans up listeners + ResizeObserver. `createRadialGradient` allocates once/frame (acceptable), not per-node.

**How to apply:** Perf bar for this hero is mobile battery / main-thread jank, not throughput. Flag per-node per-frame allocations or removal of the visibility pause; the current caps make most asymptotic concerns nice-to-have.

Learned-from: Chad, 2026-05-30 (review of branch worktree-bold-hero).
