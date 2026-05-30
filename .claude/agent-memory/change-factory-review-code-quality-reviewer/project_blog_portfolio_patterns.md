---
name: project-blog-portfolio-patterns
description: Codebase-specific patterns for the blog/portfolio Next.js 15 static-export project; navigation conventions, component structure, animation patterns
metadata:
  type: project
---

Portfolio components live under `frontend/src/app/_components/portfolio/`.

Navigation: portfolio layer uses plain `<a href>` and `window.location.assign()` — NOT Next.js `useRouter`/`Link`. Intentional for the static-export target.

Custom event bus `window.dispatchEvent(new Event("open-cmdk"))` appears in three call sites (CmdkHint.tsx line 9, SiteNav.tsx line 56 inline). CommandPalette.tsx listens on `window`. The string literal "open-cmdk" is the only coupling point — not extracted to a constant.

Canvas animation: DependencyGraph.tsx is the only canvas/RAF component in the codebase (as of 2026-05-30). Single rAF loop, DPR capped at 2, ResizeObserver on parent, visibility-pause. No prior art to compare against.

`n.heal` uses 0 as a sentinel for "not healing" and 0.0001 as a kick-off value, then `n.heal === 0` is tested with strict equality. This is fragile if the accumulation arithmetic ever lands exactly on 0 (unlikely in practice given `Math.min(1, ...)` ceiling, but worth noting).

**Why:** Learned from diff review on worktree-bold-hero branch (2026-05-30).
**How to apply:** When reviewing future canvas or animation components, compare against DependencyGraph's patterns. For event-bus patterns, check whether "open-cmdk" constant has been extracted.
