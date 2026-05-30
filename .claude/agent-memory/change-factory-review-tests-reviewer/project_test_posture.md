---
name: project-test-posture
description: This blog/portfolio repo has no unit test framework (no jest/vitest). Verification is build + Playwright visual checks. Committing test infra is not warranted for pure UI/animation diffs.
metadata:
  type: project
---

No unit or integration test framework is configured (confirmed via package.json — no jest, vitest, @testing-library, or playwright devDependency).

**Why:** Portfolio/blog site; verification strategy is `npm run build` + manual/Playwright visual checks. This is intentional and proportionate for the current scope.

**How to apply:** Do not flag missing unit tests as blocking findings. Do flag untestable seams (pure logic buried inside effects/canvas) as nice-to-have testability findings if they carry meaningful behavioral complexity worth protecting. Never recommend installing a test framework purely for decorative UI diffs.

learned-from: bold-hero branch diff review, 2026-05-30
