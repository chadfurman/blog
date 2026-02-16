# Service Tier Architecture — Working Document

> **Date:** 2026-02-16
> **Status:** Decisions finalized (Feb 16 evening session). Ready for implementation.
> **Purpose:** Single source of truth for tier/pricing across all services.
> **Related docs:**
> - `docs/plans/2026-02-16-competitive-pricing-research.md` — Full market research
> - `docs/plans/2026-02-16-services-redesign-design.md` — Page design/layout brainstorm
> - `docs/brand-guidelines.md` — Visual/voice guidelines

---

## Table of Contents

1. [Core Business Constraints](#1-core-business-constraints)
2. [Pricing Model](#2-pricing-model)
3. [WordPress Care Tiers](#3-wordpress-care-tiers)
4. [Marketing (formerly "Growth")](#4-marketing-formerly-growth)
5. [E-Commerce](#5-e-commerce)
6. [Starter Site](#6-starter-site)
7. [Cross-Cutting Concepts](#7-cross-cutting-concepts)
8. [Shipping & Tax Research Summary](#8-shipping--tax-research-summary)
9. [Remaining Open Questions](#9-remaining-open-questions)
10. [Competitive Research Highlights](#10-competitive-research-highlights)
11. [Image Strategy](#11-image-strategy)
12. [Summary of All Decisions](#12-summary-of-all-decisions)

---

## 1. Core Business Constraints

These are non-negotiable and every pricing decision must pass through this filter.

- **Solo operator + AI.** Manual work is hard. Scriptable/AI-assisted work is easy.
- **Target billable rate: $300/hr** via scripting and automation.
- **Discount rate: $150/hr** for bulk packaging / annual pricing.
- **Anything requiring a lot of custom thought and attention — skip it.** Offer it but price it high enough to be worth it, or don't offer it at all.
- **This is a side business.** Timelines are aggressive. Must be realistic about capacity.
- **Annual commitments preferred.** They provide predictable revenue and justify onboarding investment.

---

## 2. Pricing Model

### Annual = Base Price

All pricing is quoted as annual (monthly equivalent). Monthly billing carries a **50% premium**.

| Scenario | Calculation |
|---|---|
| Annual rate | Base price (e.g., $99/mo billed $1,188/yr) |
| Monthly rate | Base * 1.5 (e.g., $149/mo) |

### Onboarding / Setup Fees

Setup fees vary by service. They are NOT waived — setup work is substantial and front-loaded.

| Service | Monthly clients | Annual clients |
|---|---|---|
| WordPress Care | $300 | Waived |
| Marketing | $3,000 | $1,500 |
| E-Commerce | Quote per project (from $1,500) | Quote per project (from $1,500) |
| Starter Site | N/A (one-time project) | N/A |

### Toggle Display (Service Pages)

- Default position: Annual (selected)
- Show dollar savings, not percentage ("Save $600/yr" > "Save 33%")
- Monthly framed as "month-to-month flexibility," not as a penalty

---

## 3. WordPress Care Tiers

### What BigScoots Gives Us (All Tiers)

Everything below comes from BigScoots managed hosting. We white-label it — **no "BigScoots" branding** on the service page. Just "managed hosting on enterprise infrastructure."

- Managed WordPress hosting
- SSL certificate
- CDN (Cloudflare Enterprise) — **includes image compression** (Cloudflare Polish/Mirage)
- Staging environment (all tiers)
- Daily backups with one-click restore
- Free site migration
- Daily malware scans
- Firewall & DDoS protection
- Malware removal / hack-fix guarantee
- 99.99% uptime SLA
- 24/7 support portal for clients

### Tier Pricing

| | Essential | Professional (Rec.) | Business |
|---|---|---|---|
| **Annual** | $99/mo ($1,188/yr) | $149/mo ($1,788/yr) | $249/mo ($2,988/yr) |
| **Monthly** | $149/mo | $224/mo | $374/mo |
| **Onboarding** | $300 (monthly) / Waived (annual) | $300 (monthly) / Waived (annual) | $300 (monthly) / Waived (annual) |

### Support Model ✅ DECIDED

**Premium Support Tokens** — establishes implicit boundaries without being punitive. Not rigorously enforced, but sets expectations.

| | Essential | Professional | Business |
|---|---|---|---|
| 24/7 support portal | Unlimited | Unlimited | Unlimited |
| Premium support tokens | 2/mo | 4/mo | 8/mo |
| Token scope | < 30 min tasks | < 30 min tasks | < 30 min tasks |
| Email support | — | Yes | Yes |
| Text/call | — | — | Yes |
| Additional tokens | $50 each | $45 each | $40 each |

"Unlimited 24/7 support portal access for hosting issues. Premium support tokens for site changes, content updates, and custom requests (< 30 min each). Anything beyond token scope billed at $300/hr ($150/hr for annual clients)."

Simple credit tracking system (spreadsheet/Notion per client to start, no software until 10+ clients).

### Other Features by Tier

| Feature | Essential | Professional | Business |
|---|---|---|---|
| Core/theme/plugin updates | Yes | Yes | Yes |
| Plugin audit | One-time at onboarding | One-time at onboarding | One-time at onboarding |
| Monthly performance report | Yes | Yes | Yes |
| Speed optimization | Basic | Advanced | Priority |
| Core Web Vitals monitoring | — | Yes | Yes |
| Strategy check-in | — | — | Monthly (30 min) |

### Hosting-Only Tier ✅ DECIDED: DROPPED

Not worth the complexity. Clients who want hosting get WordPress Care. Thin margins on reselling BigScoots alone don't justify a separate product.

### Hourly Math

- Essential annual: $1,188/yr. BigScoots ~$400/yr. Net ~$788. Effort ~2-3 hrs/yr. Rate: ~$260-395/hr. **Good.**
- Professional annual: $1,788/yr. Net ~$1,388. Effort ~6-8 hrs/yr. Rate: ~$174-231/hr. **OK for upsell.**
- Business annual: $2,988/yr. Net ~$2,588. Effort ~10-15 hrs/yr (includes check-ins). Rate: ~$172-259/hr. **Good if calls are efficient.**

---

## 4. Marketing (formerly "Growth") ✅ RENAMED

**Renamed from "Growth" to "Marketing"** to avoid collision with WP Care tier naming and to be clearer about what the service is.

### Single Package (No Tiers) ✅ DECIDED

Simplified from three tiers (Grow/Accelerate/Scale) to **one Marketing package**. Scope differences are handled in the setup/scoping conversation, not on the pricing page.

**Requires a care or maintenance plan** (WordPress Care or Store Care). Marketing is always an add-on — it needs site access for SEO, plugin integration, etc.

### Pricing ✅ DECIDED

| | Flat | Performance |
|---|---|---|
| **Annual** | $500/mo ($6,000/yr) | $250/mo + rev share ($3,000/yr + share) |
| **Monthly** | $1,000/mo | $500/mo + rev share |
| **Setup (annual)** | $1,500 | $1,500 |
| **Setup (monthly)** | $3,000 | $3,000 |

**Performance pricing is the default pitch:**

> "All Marketing plans include performance-based pricing by default — my success is tied to yours. Prefer a flat rate? We can do that too."

**Revenue share:** 5-10% of attributed marketing revenue above a baseline threshold. Attribution via Klaviyo (email) and Google Analytics (SEO).

### What's Included

- Full SEO audit & ongoing optimization
- Google Search Console monitoring & action
- Klaviyo integration, flows, and campaigns
- Done-for-you content (AI-assisted, Chad reviews)
- List hygiene & deliverability monitoring
- Revenue attribution reporting
- Monthly 30-min strategy check-in
- Additional Klaviyo flows: $150 each (add-on)

**Scope determined during setup:** Number of flows, depth of SEO work, campaign frequency, local SEO — all scoped in the discovery call and reflected in setup cost. A simple client might be $1,500 setup. A complex one could be $4,000+.

### Klaviyo Flows

The 7 core flows (allocated during setup based on client needs):

1. Welcome series
2. Cart abandonment
3. Post-purchase
4. Browse abandonment
5. Win-back
6. Cross-sell
7. VIP/Loyalty (TBD)

**Flow setup economics:**
- First flow: manual to establish style/voice (~2hrs)
- Subsequent flows: leverage template (~30min each)
- Klaviyo integration config: ~1hr

**A la carte flows:** $150 each, available as add-on to existing Marketing plans only. Not sold standalone.

### Content Ownership ✅ DECIDED

**"Done-for-you" positioning.** AI generates first drafts, Chad reviews/approves, system sends. Clients don't care how the sausage is made — they care that it gets done and it works.

### Campaigns

Frequency scoped per client during setup. AI-assisted content creation, Chad reviews before sending.

### Meetings ✅ DECIDED

Monthly 30-min check-in for all Marketing clients. Quick review of the report, what's working, what to adjust. Deeper strategy sessions billed hourly.

For larger projects (10+ hours of work): 2-hour meeting per 10 hours as a ratio.

### Social Media ✅ DECIDED: DEFERRED

**Not on services page for now.** One-liner on the Marketing detail page:

> "Social media management coming soon. Contact me if you need help now."

Chad is building social media expertise over the next 6 months via a side project. Will add as a proper service offering once tooling, process, and pricing are validated.

### "Hands Off" Audit/Report Tier ✅ DECIDED: DROPPED

Dilutes the "done-for-you" brand positioning. Clients who want self-serve monitoring can use SEMrush and Klaviyo dashboards themselves.

### Email List Maintenance ✅ DECIDED: BAKED IN

Included in all Marketing plans as a standard feature. List cleaning, re-engagement campaigns, unsubscribe management, deliverability monitoring. Not a separate service.

### Revenue Attribution

**What it is:** Tracking which marketing activities (SEO, email) directly led to revenue.

**How it works:** Klaviyo has built-in revenue attribution for email flows and campaigns. Google Analytics + Search Console provide organic traffic attribution. We report on these numbers monthly.

**Why it matters:** It proves ROI and makes performance pricing work. If a client pays $250/mo base and we show $5,000/mo in attributed revenue, the service sells itself.

---

## 5. E-Commerce

### Setup Pricing

Every store is different — no fixed tiers for setup. **Quote per project.**

| Component | Included in $1,500 Base | Add-On |
|---|---|---|
| Theme selection + customization | Yes | — |
| Payment gateway (1) | Yes (Stripe/WooPayments/Shopify Payments) | Additional: $300-600 |
| Basic domestic shipping (1-2 zones, flat rate) | Yes | — |
| Basic tax (single state/region) | Yes | — |
| 2 hours training | Yes | Additional: $300/2hrs |
| Weight-based shipping | — | $450-1,800 |
| Real-time carrier rates | — | $450-1,800 |
| International shipping (per region) | — | $600-2,400 |
| US multi-state tax automation | — | $450-1,800 |
| EU VAT configuration | — | $600-2,400 |
| Additional payment gateway | — | $150-600 |

**Product entry:** Customer adds their own products. OR fixed price per 5 product photos. Photo sessions billed hourly ($300/hr).

**Design:** Theme + customize. **No full custom.** Hard boundary to protect time.

**Plugin/tool costs:** Client-paid. We configure. Clear note on service page: "Third-party tools (Klaviyo, shipping plugins, tax automation) are billed directly by those providers. I'll help you choose the right ones and handle all the setup." ✅ DECIDED

### Maintenance Tiers

| | Store Care | Store Growth (Rec.) |
|---|---|---|
| **Annual** | $249/mo ($2,988/yr) | $449/mo ($5,388/yr) |
| **Monthly** | $374/mo | $674/mo |
| **Includes WP Care tier** | Professional | Business |
| **CRO** | Basic monitoring | Active optimization |
| **Support** | Portal + Email + 4 tokens | Portal + Email + Text/Call + 8 tokens |
| **Monthly report** | Yes | Yes + revenue analysis |
| **Strategy call** | — | Monthly (30 min) |

### Store Care + Marketing Bundle ✅ DECIDED

| | Flat | Performance |
|---|---|---|
| **Annual** | $449/mo (vs $498 separate — $49 discount) | ~$225/mo base + rev share |
| **Monthly** | $898/mo | ~$449/mo base + rev share |

Bundle incentivizes the high-LTV combo. Performance pricing is the natural fit for bundles.

### Platform Notes

- WooCommerce stores: BigScoots handles server-level caching, Cloudflare handles CDN + image optimization
- Shopify stores: Client pays Shopify directly; our maintenance covers management and optimization
- Shopify clients needing Marketing require Store Care (not WP Care)

### Process & ETA (Realistic for Side Business)

| Phase | Timeline |
|---|---|
| Discovery call | Week 1 |
| Theme + setup | Weeks 2-4 |
| Content + products | Weeks 3-5 (customer provides) |
| Testing + training | Week 5-6 |
| Launch | Week 6 |

~6 weeks for a standard store. More complex = longer.

---

## 6. Starter Site

### Pricing

| Scenario | Price |
|---|---|
| Standalone (requires WP Care) | $500 one-time |
| With annual WordPress Care | $300 one-time |
| Additional pages | $100/page |
| Training | 2 hours included, $300 per additional 2hrs |

### Hosting Requirement ✅ DECIDED

**Starter Site requires a WordPress Care plan.** No hosting-only option. The pitch:

> "$500 for the site (or $300 with an annual care plan). WordPress Care from $99/mo keeps it running."

This simplifies everything:
- Client gets hosting + maintenance + support in one package
- No need for a hosting-only tier
- Care plan creates recurring revenue from day one
- First month of WordPress Care free (existing callout)

### What's Included

- 5-page WordPress site (Home, About, Services, Contact, Blog)
- Custom theme setup (theme + customize, not full custom)
- Mobile-responsive design
- SEO-ready structure & meta tags
- Contact form integration
- Google Analytics setup
- Launched within 2 weeks

### Hourly Math

- $500 standalone: AI-assisted setup ~2-3hrs. Rate: $167-250/hr. **Good.**
- $300 with annual care: Same work but LTV justifies it. $300 + $1,188/yr care = $1,488 first year.

---

## 7. Cross-Cutting Concepts

### All Third-Party Tool Costs: Client-Paid ✅ DECIDED

Clear note on all service pages:

> "Third-party tools (Klaviyo, shipping plugins, tax automation) are billed directly by those providers. I'll help you choose the right ones and handle all the setup."

This applies to:
- Klaviyo subscription
- WooCommerce plugins (shipping, tax, etc.)
- Shopify plan fees
- SEO tools (if any)

We don't bundle tool costs into our pricing. This avoids eating cost increases, managing renewals, and taking blame for third-party price changes.

### Performance-Based Pricing

Default pitch for Marketing. Available on bundles. Structure:

- Base monthly fee (reduced from flat rate) + 5-10% of attributed revenue above a baseline threshold
- Baseline threshold protects against paying commission on existing revenue
- Revenue attribution via Klaviyo (email) and Google Analytics (SEO)
- "Your success = my success."

Not a separate system or page — negotiated in the sales conversation per client.

---

## 8. Shipping & Tax Research Summary

Full research in the shipping/tax agent output. Key findings:

### Time Estimates

| Scenario | WooCommerce | Shopify |
|---|---|---|
| Basic domestic (flat rate, 1-2 zones) | 1-2 hrs | 0.5-1 hr |
| Weight-based/table rate | 4-8 hrs | 2-4 hrs |
| Real-time carrier rates | 4-6 hrs | 1-2 hrs |
| International shipping (per region) | 4-8 hrs | 4-8 hrs |
| Single-state tax | 1-2 hrs | 0.5-1 hr |
| Multi-state US tax (automated) | 3-6 hrs | 1-2 hrs |
| EU VAT | 8-12 hrs | 4-6 hrs |
| Payment gateway (each) | 1-2 hrs | 0.5-1 hr |

### Key Insights

1. **Tax is the hidden complexity monster.** Basic = 1hr. Full international = 20+ hrs.
2. **Shopify is faster to configure** but costs more in platform fees.
3. **WooCommerce shipping is plugin-heavy.** Each feature needs a plugin ($49-129/yr).
4. **Payment gateways are the easy part.** 1-2 hrs each, max.
5. **International doubles everything.** Always quote separately.

### Plugin Costs (Client-Paid)

| Plugin | Annual Cost |
|---|---|
| WooCommerce Table Rate Shipping | ~$99/yr |
| Real-time carrier plugin (USPS/FedEx/UPS) | ~$79-129/yr each |
| TaxJar (tax automation) | ~$1,069/yr |
| Avalara (enterprise tax) | ~$1,000+/yr |
| Shopify Tax | Built-in (Shopify plan) |

---

## 9. Remaining Open Questions

Most questions from the previous session have been resolved. These remain:

1. **Flow #7 TBD** — VIP/Loyalty? Back-in-stock? Sunset/re-engagement? Review request? Decide per client during setup.

2. **Social media details** — Deferred until Chad completes side project (~6 months). Will need: platform scope, posting frequency, monitoring tools, pricing structure.

3. **Performance pricing specifics** — What's the right revenue share percentage (5% vs 10%)? What baseline threshold formula? Decide per client in sales conversation for now; standardize later with experience.

4. **Marketing setup cost variability** — $1,500 is the floor for annual clients. How high does it go for complex setups? Need a rough scoping guide (e.g., $1,500 for basic, $3,000 for medium, $5,000+ for complex). Build this after first few Marketing clients.

---

## 10. Competitive Research Highlights

Full research in `docs/plans/2026-02-16-competitive-pricing-research.md`. Key takeaways:

### WordPress Care ($99/mo)
- Direct competitors: SkyrocketWP Delta 4 ($99), WP Buffs Maintain ($89), CMSMinds Starter ($99)
- SkyrocketWP includes: 1 hr/mo support, CDN, staging, image compression, spam protection, malware removal
- **Our biggest gap (now closed):** malware removal, CDN, staging — all come from BigScoots
- Industry average mid-tier: ~$246/mo

### E-Commerce
- Store setup: Freelancer $3k-$5k (standard), Agency $20k-$30k
- Our $1,500 sits below typical freelancer rates
- Maintenance: Fantail.cloud $199-299/mo, Agency $500-1,200/mo
- Our $249/mo maintenance sits between maintenance services and agency retainers

### Marketing
- SEO-only budget: $199-299/mo
- Klaviyo management freelancer: $300-1,500/mo
- No competitor bundles both SEO + Klaviyo at our price points
- Combined market value of our features: ~$1,500-3,000/mo
- Our $500/mo flat (annual) is competitive; performance option is a differentiator

### Starter Site ($500)
- Fiverr professional: $300-500
- US freelancer: $500-1,500
- Our $500 = "premium theme + professional setup" category
- Per-page add-ons: Market $80-150, ours $100
- 2-week delivery is a major differentiator (industry avg 4-8 weeks)

---

## 11. Image Strategy

### Confirmed Decisions

- **Hero illustrations:** 1 per service page (4 total). ~400x400px display, 800x800px generated for retina. Line art style matching brand (dark outlines #0F172A, blue #2563EB accents, white background).
- **Process step illustrations:** 3-4 per service page (12-16 total). ~300x300px display, 600x600px generated. Same line art style.
- **No feature deep-dive images yet.** Save for a later phase.
- **Trust bar icons:** Use open-source SVG icon libraries (Lucide, Phosphor, or Heroicons). NOT AI-generated. SVGs stay crisp at all sizes.
- **Existing icons:** Keep the 4 current icons (icon-wordpress-care.png, icon-ecommerce.png, icon-growth.png, icon-cta.png) for service cards on the overview page.

### Generation Plan (Phased)

| Phase | What | Count | Priority |
|---|---|---|---|
| 1 (MVP) | Trust bar SVG icons + use existing service icons | ~12 SVGs | Now |
| 2 | 4 service hero illustrations (AI-generated) | 4 images | Soon |
| 3 | 12-16 process step illustrations (AI-generated) | 12-16 images | Later |

### Generation Tool

OpenAI DALL-E 3 or Gemini Imagen. Review each against brand palette. Post-process if blue doesn't match #2563EB exactly. Format: PNG at 2x resolution.

### Prompt Pattern

"Clean line art illustration of [subject], dark slate outlines (#0F172A), blue (#2563EB) accent on [key elements], white background, minimal style, no text, no gradients"

---

## 12. Summary of All Decisions

### Confirmed ✅

1. **Annual pricing as base, 50% monthly premium**
2. **No "BigScoots" branding** — white-label the hosting
3. **Plugin audit: one-time at onboarding** (not recurring)
4. **Staging environment: all tiers** (BigScoots provides it)
5. **Image compression: bundled via Cloudflare** (not a tier differentiator)
6. **Theme + customize for e-commerce** (no full custom)
7. **Products added by customer** (or fixed per-5-photos price)
8. **Training: 2hrs included, $300/additional 2hrs**
9. **First email flow manual for style, rest leverage template**
10. **Starter site needs hosting** → Requires WordPress Care plan
11. **Support model: Premium Support Tokens** — 2/4/8 per tier, < 30 min each, additional at $50/$45/$40. Simple tracking. Not rigidly enforced.
12. **Service renamed: "Growth" → "Marketing"**
13. **Marketing: single package** (no Grow/Accelerate/Scale tiers). Scope in setup call.
14. **Marketing pricing: $500/mo flat (annual) or $250/mo + rev share (annual)**. Monthly at 50% premium.
15. **Marketing setup fee: $1,500 (annual) / $3,000 (monthly)**. Not waived.
16. **Content ownership: done-for-you** — AI generates, Chad reviews, system sends.
17. **A la carte Klaviyo flows: $150 each** — add-on to existing Marketing plans only.
18. **Email list maintenance: baked into Marketing** — not a separate service.
19. **Social media: deferred** — one-liner on Marketing page, full offering in ~6 months.
20. **"Hands off" audit tier: dropped** — dilutes brand.
21. **Hosting-only tier: dropped** — not worth the complexity.
22. **Bundle discount: Store Care + Marketing = $449/mo** (vs $498 separate).
23. **Meeting cadence: monthly 30-min check-in** for all Marketing clients. Deeper sessions billed hourly.
24. **Plugin/tool costs: client-paid** — clear note on all service pages.
25. **Performance pricing: default pitch for Marketing** — base + 5-10% attributed revenue above threshold. Negotiated per client.

### Remaining Open

1. Flow #7 selection (decide per client)
2. Social media full offering (deferred ~6 months)
3. Performance pricing specific percentages (decide per client for now)
4. Marketing setup cost scoping guide (build after first clients)
