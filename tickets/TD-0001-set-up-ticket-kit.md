---
id: TD-0001
title: set up ticket-kit
status: done
priority: P2
rank: 100
area: infra
pillars: []
blocked-by: []
created: 2026-06-14
---

# TD-0001 · set up ticket-kit

## Why

Capture site work as tickets in-repo instead of an external tracker, so the
backlog lives next to the code and the git history is the audit log.

## What

Scaffold ticket-kit: `.tickets.json` (static board mode), `tickets/` dir, npm
scripts, and a CLAUDE.md note pointing work items here rather than Jira.

## Acceptance

- [x] `.tickets.json` + `tickets/` exist and `check` passes
- [x] npm scripts (`tickets`, `tickets:serve`, `tickets:generate`) wired
- [x] CLAUDE.md directs work items to ticket-kit, not Jira
