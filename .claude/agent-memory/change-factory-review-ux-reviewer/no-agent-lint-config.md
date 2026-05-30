---
name: no-agent-lint-config
description: This repo has no .claude/agent-lint.config and no resources/review-topics.yaml — the conditional enable gate cannot be evaluated
metadata:
  type: project
---

There is no `.claude/agent-lint.config` anywhere in `/Users/chadfurman/projects/blog` (checked repo-wide), and no `resources/review-topics.yaml` or `resources/review-protocol.md`.

**Why:** ux-reviewer is a conditional reviewer gated on `conditionalReviewers.ux-reviewer.enabled`. The standard infra (config + review-topics axis prose) does not exist in this consuming repo.

**How to apply:** When invoked directly by the user with an explicit UX review request (not via automated change-factory pipeline), treat the direct request as authorization and proceed, but flag the missing config/resources in the summary. If invoked by automation with no config, return the empty "disabled" review. Re-check for the config each time — it may get added later. Verified 2026-05-30.
