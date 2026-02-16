# Service Tier Architecture — Working Document

> **Date:** 2026-02-16
> **Status:** In Progress — Capturing all decisions, research, and open questions
> **Purpose:** Preserve everything between context windows. This is the single source of truth for tier/pricing discussions.
> **Related docs:**
> - `docs/plans/2026-02-16-competitive-pricing-research.md` — Full market research
> - `docs/plans/2026-02-16-services-redesign-design.md` — Page design/layout brainstorm
> - `docs/brand-guidelines.md` — Visual/voice guidelines

---

## Table of Contents

1. [Core Business Constraints](#1-core-business-constraints)
2. [Pricing Model](#2-pricing-model)
3. [WordPress Care Tiers](#3-wordpress-care-tiers)
4. [Marketing Tiers (formerly "Growth")](#4-marketing-tiers-formerly-growth)
5. [E-Commerce](#5-e-commerce)
6. [Starter Site](#6-starter-site)
7. [Cross-Cutting Concepts](#7-cross-cutting-concepts)
8. [Shipping & Tax Research Summary](#8-shipping--tax-research-summary)
9. [Open Questions & Chad's Notes](#9-open-questions--chads-notes)
10. [Competitive Research Highlights](#10-competitive-research-highlights)

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

### Onboarding

| Plan type | Onboarding fee |
|---|---|
| Annual | Waived ($0) |
| Monthly | $300 |

**Open question:** Is $300 onboarding enough for monthly marketing customers? The setup work (Klaviyo config, initial flows, SEO audit) is substantial. See notes in Section 9.

### Toggle Display

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
- Staging environment (all tiers, not just higher ones)
- Daily backups with one-click restore
- Free site migration
- Daily malware scans
- Firewall & DDoS protection
- Malware removal / hack-fix guarantee
- 99.99% uptime SLA
- 24/7 support portal for clients

**Note:** Image compression comes bundled with Cloudflare, not as a separate add-on. This simplifies the feature matrix.

### Tier Pricing

| | Essential | Professional (Rec.) | Business |
|---|---|---|---|
| **Annual** | $99/mo ($1,188/yr) | $149/mo ($1,788/yr) | $249/mo ($2,988/yr) |
| **Monthly** | $149/mo | $224/mo | $374/mo |

### Support Model

**Chad's preference:** Simplify. Don't bill per conversation — that's too nitty-gritty. Instead:

| | Essential | Professional | Business |
|---|---|---|---|
| BigScoots Portal | 24/7 | 24/7 | 24/7 |
| Email support | — | Yes | Yes |
| Text/call support | — | — | Yes |

**Old "support tokens" concept:** 2/4/8 tokens per month at ~15-30 min each. **Under review.** Chad noted "support tokens feels high" (at $50/token = $300/hr for 10-min tasks). May be too expensive for clients or too complex to explain.

**Alternative under consideration:** Just include "24/7 support portal" for all tiers, add "email support" on Professional, add "email, text, or call" on Business. Keep it simple. Bill hourly ($300/hr or $150/hr with annual plan) for anything beyond what BigScoots handles.

### Other Features by Tier

| Feature | Essential | Professional | Business |
|---|---|---|---|
| Core/theme/plugin updates | Yes | Yes | Yes |
| Plugin audit | One-time at onboarding | One-time at onboarding | One-time at onboarding |
| Monthly performance report | Yes | Yes | Yes |
| Speed optimization | Basic | Advanced | Priority |
| Core Web Vitals monitoring | — | Yes | Yes |
| Strategy review | — | Quarterly check-in? | Monthly check-in? |

**Open question:** "Strategy Review" vs "Quarterly Check-in" — what's the right naming/scope? See Section 9.

### Hosting-Only Option

Chad is considering a **hosting-only tier** (no maintenance):

| | Hosting Only |
|---|---|
| Annual | ~$40/mo ($480/yr) |
| Monthly | ~$75/mo |

This would be for clients who want managed hosting but handle their own updates/maintenance. It's essentially reselling BigScoots at a markup.

**Consideration:** BigScoots costs ~$30-40/mo. At $40/mo annual we're barely marking up. At $75/mo monthly, the margin is better. Need to decide if this tier is worth the complexity.

### Hourly Math

- Essential annual: $1,188/yr. BigScoots ~$400/yr. Net ~$788. Effort ~2-3 hrs/yr. Rate: ~$260-395/hr. **Good.**
- Professional annual: $1,788/yr. Net ~$1,388. Effort ~6-8 hrs/yr. Rate: ~$174-231/hr. **OK for upsell.**
- Business annual: $2,988/yr. Net ~$2,588. Effort ~10-15 hrs/yr (includes check-ins). Rate: ~$172-259/hr. **Good if calls are efficient.**

---

## 4. Marketing Tiers (formerly "Growth")

**Renamed from "Growth"** to avoid collision with WP Care tier naming. The service was called "Growth" in the current site; consider renaming to "Marketing" or "Growth Marketing."

### Tier Pricing

| | Grow | Accelerate (Rec.) | Scale |
|---|---|---|---|
| **Annual** | $249/mo ($2,988/yr) | $449/mo ($5,388/yr) | $749/mo ($8,988/yr) |
| **Monthly** | $374/mo | $674/mo | $1,124/mo |

**Chad's note:** "monthly costs seem low on marketing? But maybe okay?" — Under review. The concern is that at $249/mo with AI doing most of the ongoing work (~1hr/mo real manual time), the math works at $150-187/hr. But if it requires more manual attention, the rate drops fast.

### SEO (All Tiers)

| | Grow | Accelerate | Scale |
|---|---|---|---|
| Initial SEO audit | Yes | Yes | Yes |
| On-page optimization | AI-assisted | AI-assisted | AI-assisted |
| Google Search Console | Monitored | Monitored + action | Monitored + action |
| Content recommendations | Monthly | Bi-weekly | Weekly |
| Local SEO setup | — | Yes | Yes |

**Note:** SEO page optimization is "easy-ish after initial setup" per Chad. Initial audit is manual (~2-3hrs), ongoing is heavily AI-assisted.

### Klaviyo Email

| | Grow | Accelerate | Scale |
|---|---|---|---|
| Klaviyo integration config (~1hr) | Yes | Yes | Yes |
| Email flows configured | 3 flows | 5 flows | All 7 flows |
| Campaigns/month | 1 | 2 | 4 (max 1/week) |
| A/B testing | — | Yes | Yes |
| List segmentation | Basic | Advanced | Advanced |

**The 7 core flows:**

| # | Flow | Grow | Accelerate | Scale |
|---|---|---|---|---|
| 1 | Welcome series | Yes | Yes | Yes |
| 2 | Cart abandonment | Yes | Yes | Yes |
| 3 | Post-purchase | Yes | Yes | Yes |
| 4 | Browse abandonment | — | Yes | Yes |
| 5 | Win-back | — | Yes | Yes |
| 6 | Cross-sell | — | — | Yes |
| 7 | VIP/Loyalty (TBD) | — | — | Yes |

**Flow setup economics:**
- First flow: manual to establish style/voice (~2hrs)
- Subsequent flows: leverage template (~30min each)
- Klaviyo integration config: ~1hr
- Total setup time: Grow ~4hrs, Accelerate ~5.5hrs, Scale ~6.5hrs
- Plus Klaviyo integration: +1hr

**A la carte flows:** Chad wants to allow buying individual flows outside of a tier. Price TBD — probably $300-600 per flow ($300/hr * 1-2hrs).

**Klaviyo subscription pricing:** NOT included in our price. Client pays Klaviyo directly. Klaviyo has a free tier for small lists. We should make this clear on the service page.

**Email list maintenance:** Chad mentioned this as a potential service. Scope TBD — could include list cleaning, re-engagement campaigns, unsubscribe management, deliverability monitoring.

### Social Media

**Chad's decision: A la carte AND as a tier feature.** Both setup and automated posting.

| | Grow | Accelerate | Scale |
|---|---|---|---|
| Social profile setup | — | Yes | Yes |
| Automated posting | — | — | Yes (AI-assisted) |

**Open questions about social:**
- What does "social" include? Posts? Images? Content creation?
- Part of a separate plan? Add-on to Marketing?
- Post frequency? Image creation?
- Which platforms? (Facebook, Instagram, LinkedIn, X, TikTok?)
- AI-generated content vs human-reviewed content?

### Campaigns

- 1 / 2 / 4 per month (max 1/week)
- "Campaigns are hard" per Chad — this is where real manual time goes
- Content creation: AI-assisted at lower tiers, more automated at higher tiers

**Open question:** "All content in all tiers: needed? or user owned?" — Who creates the campaign content? Options:
1. We create everything (more work, higher value)
2. Client provides content, we send/optimize (less work)
3. AI generates, we review (middle ground)

**Chad's instinct:** "Less work, but less success?" — There's tension between offering less (to match capacity) and the client getting less value (fewer results).

### Strategy Calls

| | Grow | Accelerate | Scale |
|---|---|---|---|
| Strategy call | — | Quarterly | Monthly |

**Chad's note:** Is it "Strategy Review" or "Quarterly Check-in"? The scope matters:
- **Check-in** = quick 30-min status update, review reports, answer questions
- **Strategy Review** = deeper 60-min session, review data, adjust approach, plan next quarter

For bigger projects (10+ hrs), Chad suggests: **2hr meeting per 10hrs of work** as a ratio.

### "Hands Off" Tier Concept

Chad floated the idea of a **passive maintenance/audit/report** tier — lower price, less active work:
- Monthly SEO monitoring + report
- Klaviyo performance report
- Recommendations but no execution
- Client acts on recommendations themselves

This could be a "Grow Lite" at ~$149-199/mo. Mostly automated reporting with AI-generated recommendations.

### Revenue Attribution — Explanation

**What it is:** Tracking which marketing activities (SEO, email, social) directly led to revenue. For example:
- "This email campaign generated $2,400 in sales"
- "Organic search drove 340 visitors who made $1,200 in purchases"
- "The win-back flow recovered $800 from churned customers"

**How it works:** Klaviyo has built-in revenue attribution for email flows and campaigns. Google Analytics + Search Console provide organic traffic attribution. We report on these numbers monthly.

**Why it matters:** It proves ROI. If a client pays $249/mo and we show $3,000/mo in attributed revenue, the service sells itself.

### Performance Pricing

Available at all tiers: base fee + 5-10% of attributed email/marketing revenue above a threshold.

"Your success = my success."

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

**Design:** Theme + customize. **No full custom.** This is a hard boundary to protect time.

**Shipping plugins:** Client pays for plugin licenses (WooCommerce table rate ~$99/yr, carrier plugins ~$79-129/yr each). We configure them. On Shopify, shipping is built-in for most scenarios.

**CRO — Explanation:** Conversion Rate Optimization. Making the store convert more visitors into buyers. Includes: product page optimization, checkout flow improvement, A/B testing, speed optimization. At our $249/mo maintenance tier, this means basic monitoring + AI-assisted recommendations, NOT the $990+/mo agency-level CRO.

### Maintenance Tiers

| | Store Care | Store Growth (Rec.) |
|---|---|---|
| **Annual** | $249/mo ($2,988/yr) | $449/mo ($5,388/yr) |
| **Monthly** | $374/mo | $674/mo |
| **Includes WP Care tier** | Professional | Business |
| **CRO** | Basic monitoring | Active optimization |
| **Support** | Portal + Email | Portal + Email + Text/Call |
| **Monthly report** | Yes | Yes + revenue analysis |
| **Strategy call** | — | Monthly |

**Store Care includes hosting costs** — WP Care Professional is bundled in, which includes BigScoots hosting. For Shopify stores, the client pays Shopify directly; our maintenance covers management and optimization.

**Caching, image optimization, WPO/BigScoots, Shopify, WooCommerce:**
- WooCommerce stores: BigScoots handles server-level caching, Cloudflare handles CDN + image optimization
- Shopify stores: Shopify handles hosting/CDN natively; we optimize theme, images, and apps
- WPO (WordPress Optimization): included in WP Care tiers

**Open question:** Is store maintenance priced to account for all add-on costs (plugins, shipping plugins, tax automation subscriptions)? Currently these are client-paid. Should we bundle some/all into the maintenance price?

### Process & ETA (Realistic for Side Business)

| Phase | Timeline |
|---|---|
| Discovery call | Week 1 |
| Theme + setup | Weeks 2-4 |
| Content + products | Weeks 3-5 (customer provides) |
| Testing + training | Week 5-6 |
| Launch | Week 6 |

~6 weeks for a standard store. More complex = longer.

### Marketing Bundle

**Thinking out loud (not committed):** Bundle Store Care/Growth with Marketing at a discount. High-LTV combo. Maybe 15% off Marketing when paired with E-Commerce maintenance.

---

## 6. Starter Site

### Pricing

| Scenario | Price |
|---|---|
| Standalone | $500 one-time |
| With annual WordPress Care | $300 one-time (onboarding waived) |
| Additional pages | $100/page |
| Training | 2 hours included, $300 per additional 2hrs |

### Key Decisions Under Consideration

**1. Starter Site requires a Care Plan (hosting)**

The site needs to live somewhere. Options:

| Option | Model |
|---|---|
| A. Require annual WP Care | $500 site + $99/mo care = $1,688 year 1 |
| B. $500 includes 1 year hosting | $500 all-in, then $99/mo after year 1 |
| C. Require annual hosting-only | $500 site + $40/mo hosting = $980 year 1 |
| D. Offer hosting-only at $75/mo or $40/mo annual | Separate from site build |

**Chad is leaning toward:** Some form of required hosting. The site needs a home. Including 1 year of hosting in the $500 price is clean and simple for the client. After year 1, they transition to a Care plan or hosting-only plan.

**2. The $300 vs $500 inconsistency**

Current callout on WP Care says "Starter sites from $300 with a care plan." Starter Site service says "$500." Need to reconcile:
- $500 standalone
- $300 when purchased with annual WP Care (the care plan discount)

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

### Support Token System (Under Review)

Original proposal: 2/4/8 tokens per month, 1 token = ~15-30 min task, additional tokens at $50 each.

**Chad's concern:** "Support tokens feels high" at $50 each. The $50/token = $100-300/hr effective rate depending on task length, which is steep for small requests.

**Alternative being considered:** Drop tokens entirely. Use BigScoots portal for hosting/security issues (free, 24/7). Our support tiers are just communication channels:
- Essential: BigScoots portal only
- Professional: Portal + email
- Business: Portal + email + text/call

Anything that requires real development work (beyond BigScoots scope) is billed hourly at $300/hr ($150 for annual clients).

**Side note from Chad:** "4 convos/month" — possibly cap at 4 support conversations per month on lower tiers? And "Topics/Month" — or limit by number of topics addressed?

### Content Ownership Question

"All content in all tiers: needed? or user owned?"

This applies to Marketing campaigns, social posts, email copy, and blog content:
- **Option A:** We create all content (AI-assisted) — more work, more value
- **Option B:** Client provides content, we optimize/send — less work, less value
- **Option C:** AI generates, human reviews — middle ground

The philosophical tension: "Less work, but less success?" — If we reduce what we do, clients may get less results, which hurts retention and referrals.

**Practical answer for a solo operator:** AI generates first drafts, Chad reviews/approves, system sends. This is the only scalable approach.

### Meeting Structure

For larger projects (10+ hours of work):
- Include a **2-hour meeting per 10 hours** of work
- This covers planning, review, and alignment
- Smaller projects: async communication (email/text)

### Performance-Based Pricing

Available on all Marketing tiers:
- Base monthly fee + 5-10% of attributed revenue above a threshold
- Threshold protects against paying commission on existing revenue
- Revenue attribution via Klaviyo (email) and Google Analytics (SEO)

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

## 9. Open Questions & Chad's Notes

### From Latest Conversation (Feb 16 afternoon)

These are Chad's raw notes, preserved for discussion:

1. **Support model:** "I think we should bill per support conversation outside of BigScoots? Or maybe that's too nitty? Maybe we just say '24/7 support portal' and 'email support' and offer 'email' on the medium and 'email, text, or call' on the higher tier?" → **Leaning toward simple channel-based tiers, no tokens.**

2. **Support tokens feels high** — $50/token may be too steep. Revisit pricing or drop tokens entirely.

3. **4 convos/month** — Should we cap support conversations per month? Topics per month?

4. **Strategy Review vs Quarterly Check-in** — What's the right scope and name?

5. **Meetings for bigger projects** — 2hr call per 10hrs of work.

6. **Image compression: Cloudflare, bundled** — Already included via BigScoots/Cloudflare. Remove from feature differentiation.

7. **Allow flows a la carte** — Individual email flows purchasable outside of a Marketing tier.

8. **Email list maintenance service** — Separate service? Add-on? Scope?

9. **Social a la carte** — Social media as standalone add-on. What does it include? Posts? Images? Content? Which platforms?

10. **Revenue attribution** — Need to explain clearly on the services page. It means tracking which marketing activities led to actual sales.

11. **Content in all tiers: needed or user-owned?** — Who creates campaign/email/social content?

12. **"Less work, but less success?"** — The tension between reducing scope (to match solo capacity) and delivering results (to retain clients).

13. **"Hands off" maintenance/audit/report tier** — A cheaper tier that just monitors and reports, doesn't actively manage.

14. **Klaviyo pricing: included?** — No. Client pays Klaviyo directly. Must be clear on page.

15. **Setup cost too cheap on monthly** — $300 onboarding for monthly Marketing customers may not cover the Klaviyo config + initial flows setup (~4-6.5 hrs = $1,200-1,950 at $300/hr).

16. **Monthly costs seem low on Marketing? But maybe okay?** — At $249/mo Grow with AI doing most ongoing work, the math works IF manual time stays under ~1.5hrs/mo.

17. **CRO** — Conversion Rate Optimization. Need to define what "basic CRO" means at our price point vs agency-level $990+/mo CRO.

18. **Store Care includes hosting costs?** — Yes, WP Care is bundled. For Shopify, client pays Shopify directly.

19. **Priced to account for all add-ons?** — Should maintenance pricing include plugin/tool subscription costs? Currently client-paid.

20. **Cache, img optimization, WPO/BigScoots, Shopify, WooCommerce?** — Need to clarify what's included per platform in each tier.

21. **Shipping plugins** — Client pays for plugin licenses. We configure. Need to state this clearly.

22. **Site Setup requires Care Plan (Hosting)** — Can't deliver a site without somewhere to host it.

23. **Hosting Only: $75/mo or $40/mo annual** — A tier below Essential that's just hosting, no maintenance.

24. **Require annual hosting? $500 + hosting? Or 1 year hosting included in $500?** — How to bundle starter site + hosting.

### From Earlier Conversations

25. **"Growth" vs "Marketing" naming** — Service name collision with WP Care tier names. Options: rename service to "Marketing" OR use different WP Care tier names (Care/Secure/Perform).

26. **Flow #7 TBD** — VIP/Loyalty? Back-in-stock? Sunset/re-engagement? Review request?

27. **Bundle discount structure** — 15% off Marketing when paired with E-Commerce maintenance? Math needs validation.

28. **$300 vs $500 Starter Site inconsistency** — WP Care callout says "from $300 with care plan" but Starter Site says "$500."

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

### Marketing/Growth
- SEO-only budget: $199-299/mo
- Klaviyo management freelancer: $300-1,500/mo
- No competitor bundles both SEO + Klaviyo at $249/mo
- Combined market value of our features: ~$1,500-3,000/mo
- **Biggest money left on table: Growth at $249/mo**

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

## Summary of Confirmed Decisions

These are things Chad has confirmed or strongly leaned toward:

1. **Annual pricing as base, 50% monthly premium** ✅
2. **$300 onboarding, waived for annual** ✅
3. **No "BigScoots" branding** — white-label the hosting ✅
4. **Plugin audit: one-time at onboarding** (not recurring) ✅
5. **Staging environment: all tiers** (BigScoots provides it) ✅
6. **Image compression: bundled via Cloudflare** (not a tier differentiator) ✅
7. **Theme + customize for e-commerce** (no full custom) ✅
8. **Products added by customer** (or fixed per-5-photos price) ✅
9. **Training: 2hrs included, $300/additional 2hrs** ✅
10. **Campaigns: 1/2/4 per month, max 1/week** ✅
11. **First email flow manual for style, rest leverage template** ✅
12. **Social media: both setup and posting as tiers** ✅
13. **Performance pricing available at all Marketing tiers** ✅
14. **Support: BigScoots Portal → + Email → + Text/Call** (simplified) ✅
15. **Starter site needs hosting** (some form required) ✅

## Summary of Unresolved Decisions

These need further discussion:

1. Support model (tokens vs conversations vs channel-only)
2. Token/conversation pricing
3. Marketing tier pricing (low enough? too low?)
4. Hosting-only tier ($75/$40)
5. Starter site + hosting bundling model
6. Social media scope and pricing
7. Content ownership (who creates?)
8. "Hands off" audit/report tier
9. Email list maintenance service
10. A la carte flow pricing
11. Service renaming (Growth → Marketing)
12. Bundle discount structure
13. Meeting cadence/structure
14. Plugin/tool costs: client-paid vs bundled
