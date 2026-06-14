---
id: TD-0002
title: Add a writing surface — essays / notes in Chad's voice
status: open
priority: P2
rank: 20
area: web
pillars: []
blocked-by: []
created: 2026-06-14
---

# TD-0002 · Add a writing surface — essays / notes in Chad's voice

## Why

The site lists what Chad did; it doesn't show how he thinks. Staff+/EM
opportunities turn on judgment, and a few high-signal posts (the
LeetCode-vs-production take was the seed) reframe the site from résumé to voice.
It also feeds the "Ask my work" chat a richer corpus to retrieve over.

## What

A lightweight notes/essays section — not a heavyweight CMS.

- A `/notes` (or `/writing`) index + per-post pages, statically rendered
  (fits the current `output: 'export'` site).
- Author posts as markdown/MDX in-repo; no admin UI.
- Start with 3–4 posts seeded from existing material (LeetCode-vs-prod,
  modular monoliths, AI-ready interview process, the Emmy/WebRTC story).
- Linked from nav; consistent with the existing visual system.

## Acceptance

- [ ] Notes index lists posts; each post renders at its own URL
- [ ] Posts authored as in-repo markdown/MDX, no server required
- [ ] 3–4 real posts published in Chad's voice
- [ ] Linked from primary nav, styled to match the site
