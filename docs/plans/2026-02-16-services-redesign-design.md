# Services Pages Redesign -- Design Document

> **Date:** 2026-02-16
> **Status:** Draft / Brainstorm
> **Depends on:** `2026-02-15-design-overhaul.md`, `2026-02-16-competitive-pricing-research.md`, `docs/brand-guidelines.md`
> **Goal:** Transform sparse service cards into rich, conversion-optimized marketing pages that compete with BigScoots, WP Engine, CuriousM, and GoBarrelRoll.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Main Services Page (`/services`)](#2-main-services-page-services)
3. [Service Detail Pages (`/services/[slug]`)](#3-service-detail-pages-servicesslug)
4. [WordPress Care Tier Structure](#4-wordpress-care-tier-structure)
5. [Component Designs](#5-component-designs)
6. [Content Strategy Per Service](#6-content-strategy-per-service)
7. [Animation & Interaction Plan](#7-animation--interaction-plan)
8. [Image Generation Plan](#8-image-generation-plan)
9. [Data Architecture](#9-data-architecture)
10. [Mobile Considerations](#10-mobile-considerations)
11. [Open Questions](#11-open-questions)

---

## 1. Design Principles

These principles guide every decision in the redesign. They come from research into high-converting SaaS pricing pages and the competitive landscape.

### 1.1 Progressive Trust Building

Every section on the page should reduce a specific objection or build a specific kind of trust. The section order follows a proven conversion funnel:

```
Hero (what is this, why should I care?)
  -> Trust Bar (who else trusts you?)
  -> Pricing Tiers (what does it cost, what do I get?)
  -> Feature Comparison (how do tiers differ?)
  -> How We Do It (what's the process?)
  -> Trust Signals / Stats (prove it)
  -> FAQ (address remaining objections)
  -> Final CTA (make it easy to act)
```

### 1.2 Clarity Over Cleverness

Small business owners are not developers. Every section needs to be scannable in 3 seconds. Use short headlines, bullet points, and visual hierarchy. No jargon without immediate explanation. Pricing is always visible -- never hidden behind "Contact Us."

### 1.3 Show, Don't Tell

Instead of saying "fast support," show "< 90 second average response time." Instead of saying "secure," show "99.99% uptime, daily malware scans, 0 breaches." Stats are more persuasive than adjectives.

### 1.4 One Clear Path Per Page

Each service page should have ONE primary CTA ("Get Started" / "Choose This Plan") that appears in at least 3 locations: hero, after pricing, and bottom of page. Secondary CTAs ("Contact Me" / "Ask a Question") appear alongside but never compete visually.

### 1.5 Respect the Brand

All designs follow `docs/brand-guidelines.md`:
- Colors: primary blue #2563EB, accent teal #0D9488, alternating section backgrounds
- Fonts: Plus Jakarta Sans (headings), Source Sans 3 (body)
- Voice: first-person, conversational, transparent
- Icons: line art with dark outlines and blue accent highlights
- Shadows: `--card-shadow` / `--card-shadow-hover`

---

## 2. Main Services Page (`/services`)

The current page is a heading, a 2x2 card grid, two small info cards, and a CTA. It needs to become a compelling overview that helps visitors self-select the right service.

### 2.1 Section Order

| # | Section | Background | Purpose |
|---|---------|-----------|---------|
| 1 | Hero | white | Headline + value prop + dual CTAs |
| 2 | Trust Bar | white | 3-4 stat callouts in a horizontal strip |
| 3 | Service Overview Cards | background-alt | 4 cards with icons, pricing, key features, "Learn More" links |
| 4 | "How I Work" Process | background-warm | 3-step process (Talk -> Plan -> Launch) |
| 5 | Quote Explorer | white | Interactive quiz (already built) |
| 6 | Cross-Service Comparison Table | background-alt | Quick matrix: which services include what |
| 7 | Final CTA | background-warm | Contact CTA with reassurance copy |

### 2.2 Hero Section

**Headline:** "The Right Plan for Your Business"
**Subheadline:** "WordPress hosting, e-commerce, and growth marketing -- all managed by someone who actually picks up the phone."

**Dual CTAs:**
- Primary: "See Plans & Pricing" (scrolls to pricing cards)
- Secondary: "Not Sure? Take the Quiz" (scrolls to Quote Explorer)

**Layout:** Full-width, text centered, no image needed here (avatar is on homepage). Clean and direct.

### 2.3 Trust Bar

A narrow horizontal strip with 3-4 key stats. These establish credibility before the visitor even sees pricing.

| Stat | Display |
|------|---------|
| Uptime | "99.99% Uptime Guaranteed" |
| Support | "< 2 Min Response Time" |
| Contracts | "No Contracts. Cancel Anytime." |
| Guarantee | "30-Day Satisfaction Guarantee" |

**Design:** Four items in a row on desktop, 2x2 grid on tablet, vertical stack on mobile. Each stat has a small icon (shield, clock, handshake, checkmark) in primary blue, with the number in highlight color and the label in muted.

### 2.4 Service Overview Cards (Richer Version)

Upgrade from the current flat cards. Each card gets:
- Service icon (existing icons)
- Service name + tagline
- Starting price in accent teal
- 3-4 key feature bullets (not the full list)
- "Most Popular" badge on WordPress Care
- Primary CTA button: "See Plans" linking to `/services/[slug]`

**Layout:** 2x2 grid on desktop, 2-column on tablet, single-column stack on mobile. Cards use `card-interactive` pattern with hover lift.

### 2.5 "How I Work" Process Section

Three steps presented as numbered circles connected by a line:

1. **We Talk** -- "Tell me about your business, goals, and budget. I'll recommend a plan."
2. **I Build the Plan** -- "I handle the setup -- hosting, security, store config, whatever you need."
3. **You Grow** -- "Your site runs smoothly. You get monthly reports. I'm a text away."

**Design:** Horizontal timeline on desktop, vertical on mobile. Each step has a circle with the number, a heading, and a short description. Line art icon for each step.

### 2.6 Cross-Service Comparison Table

A quick matrix that shows what's included across services at a glance:

| Feature | WordPress Care | E-Commerce | Growth | Starter Site |
|---------|:---:|:---:|:---:|:---:|
| Managed Hosting | check | check | -- | -- |
| Security & Backups | check | check | -- | -- |
| Plugin Updates | check | check | -- | -- |
| E-Commerce Management | -- | check | -- | -- |
| SEO Optimization | -- | -- | check | -- |
| Email Marketing | -- | -- | check | -- |
| Site Build | -- | -- | -- | check |
| Monthly Reporting | check | check | check | -- |
| Starting Price | $99/mo | $249/mo | $249/mo | $500 |

**Design:** Responsive table that collapses to a card-per-service layout on mobile. Checkmarks in primary blue, dashes in muted gray. Pricing row at the bottom in accent teal.

---

## 3. Service Detail Pages (`/services/[slug]`)

Each service gets its own rich marketing page. The page template is shared across all four services, but content varies per service.

### 3.1 Universal Section Order

Every service detail page follows this structure:

| # | Section | Background | Purpose |
|---|---------|-----------|---------|
| 1 | Hero | white | Service name, tagline, value prop, primary CTA |
| 2 | Trust Bar | white | 3-4 stats relevant to this service |
| 3 | Pricing Tiers | background-alt | 2-3 tier cards with monthly/annual toggle |
| 4 | Feature Comparison Table | background-alt | Detailed tier comparison with checkmarks |
| 5 | "How It Works" Process | background-warm | Service-specific process steps |
| 6 | Feature Deep-Dives | white | Alternating image/text blocks for 3-4 key features |
| 7 | Trust Signals | background-alt | Stats, guarantees, uptime |
| 8 | FAQ Accordion | background-warm | 8-12 questions |
| 9 | Final CTA | white | "Ready to get started?" with contact link |

### 3.2 Service Hero

**Layout:** Two columns on desktop. Left: headline, subheadline, 2-3 sentence value prop, primary CTA button. Right: line art illustration for the service.

**Headline pattern:** "[Service Name]: [Outcome]"
- WordPress Care: "WordPress Care: Your Site, Always On"
- E-Commerce: "E-Commerce: A Store Built to Sell"
- Growth: "Growth: Get Found. Get Customers. Get Sales."
- Starter Site: "Starter Site: Online in Two Weeks"

**CTA:** "See Plans" (scrolls to pricing) and "Contact Me" (secondary).

### 3.3 Pricing Tiers

This is the centerpiece of each service page. 2-3 pricing cards displayed side by side, with a monthly/annual toggle above them.

**Card anatomy:**
- Tier name (e.g., "Essential," "Professional," "Business")
- Price with `/mo` suffix
- "Billed annually" or "Billed monthly" subtitle
- Annual savings callout: "Save $X/year" in accent teal
- "Best for" one-liner in muted text
- Feature list with checkmarks (included) and X marks or grayed-out text (not included in this tier)
- Primary CTA button
- "Most Popular" / "Recommended" badge on the middle tier (visually emphasized with primary blue border/header)

**Monthly/Annual Toggle:**
- Positioned above the pricing cards, centered
- Two options: "Monthly" and "Annual (Save 15%)"
- Toggle is a pill-shaped switcher
- When toggled, prices animate smoothly (fade transition, not jarring swap)
- Annual prices show monthly equivalent with "billed annually" note

**Recommended Tier Emphasis:**
- Middle card is slightly taller (scaled up 5%) or has a colored header bar
- Border changes from `foreground/10` to `primary` color
- "Recommended" badge at top in primary blue
- This follows the CXL Institute research showing 22% conversion boost from highlighting a recommended tier

### 3.4 Feature Comparison Table

Below the pricing cards, a detailed comparison table shows every feature across all tiers. This is where the GoBarrelRoll-style "you don't get this" pattern applies.

**Design:**
- Sticky header row with tier names and prices (stays visible while scrolling)
- Feature rows grouped by category (e.g., "Hosting," "Security," "Support," "Reporting")
- Included features: blue checkmark icon
- Not included: light gray text with line-through, or a subtle gray X
- The "not included" items in lower tiers serve as upsell motivation -- visitors see what they're missing

**Mobile:** Collapses to a tabbed view where you select a tier and see its features in a vertical list, with "upgrade to get this" callouts for features in higher tiers.

### 3.5 "How It Works" Process Section

Service-specific 3-4 step process with alternating layout:

**Pattern:** Numbered steps arranged vertically with alternating image placement (image left / text right, then text left / image right). Each step has:
- Step number in a blue circle
- Heading
- 2-3 sentence description
- Line art illustration

**Example for WordPress Care:**
1. **Onboarding** -- "I audit your current site, install security tools, and set up monitoring. You get access to the BigScoots hosting portal."
2. **Migration** -- "Your site moves to managed hosting with zero downtime. SSL, CDN, and staging are configured automatically."
3. **Ongoing Care** -- "Updates happen weekly. Backups run daily. Security scans run constantly. You get a monthly report showing everything."
4. **Support** -- "Need something changed? Text, email, or use your support credits. I respond within minutes, not days."

### 3.6 Feature Deep-Dives

3-4 alternating image/text blocks that expand on the most compelling features. These are the "WP Engine style" blocks.

Each block:
- **Heading** (benefit-focused, not feature-focused)
- **2-3 sentence description**
- **Line art illustration** on the opposite side
- Optional "Learn more" link or tooltip for detail

**Example blocks for WordPress Care:**
1. "Your Site, Always Online" -- 99.99% uptime guarantee, CDN, enterprise infrastructure
2. "Security That Never Sleeps" -- Daily malware scans, firewall, DDoS protection, hack-fix guarantee
3. "Updates Without the Anxiety" -- Staging environment, rollback capability, tested before going live
4. "Reports You'll Actually Read" -- Monthly performance dashboard, speed metrics, security log, action items

### 3.7 Trust Signals Section

A grid of 3-4 stat cards, each with:
- Large number or metric (e.g., "99.99%")
- Label (e.g., "Uptime Guaranteed")
- Optional subtext (e.g., "backed by BigScoots enterprise infrastructure")

**Stats vary by service:**

| Service | Stat 1 | Stat 2 | Stat 3 | Stat 4 |
|---------|--------|--------|--------|--------|
| WordPress Care | 99.99% Uptime | < 90s Support Response | Daily Backups | 0 Breaches |
| E-Commerce | $X Processed | X Stores Managed | 99.99% Uptime | X% Avg Speed Improvement |
| Growth | X% Avg Traffic Increase | X Email Flows Configured | X% Avg Open Rate | ROI Positive in X Months |
| Starter Site | 2-Week Delivery | 5 Pages Included | SEO-Ready | Mobile Responsive |

Note: Some of these will need real data or reasonable estimates. Placeholder stats should be honest -- better to show fewer real stats than many made-up ones.

### 3.8 FAQ Accordion

Expanded from the current 4 FAQs per service to 8-12. The accordion uses the HTML `<details>` / `<summary>` pattern already in place, enhanced with smooth animation.

**FAQ Categories per service:**

WordPress Care (12 questions):
1. What's included in the $99/mo plan?
2. What hosting provider do you use?
3. What if I already have hosting?
4. How do backups work? Can I restore my site?
5. What happens if my site gets hacked?
6. How often do you run updates?
7. What's included in the monthly report?
8. How do support credits work?
9. Can I cancel anytime?
10. Do you build new WordPress sites?
11. What's the onboarding process like?
12. Do you support WooCommerce sites on this plan?

E-Commerce (10 questions):
1. WooCommerce or Shopify -- which should I use?
2. Can you migrate my store from another platform?
3. Is WordPress Care included?
4. What payment processors do you support?
5. How long does store setup take?
6. What's included in the $249/mo maintenance?
7. Do you handle product photography or copywriting?
8. Can you set up subscription products?
9. What about Shopify apps and integrations?
10. How do you measure conversion rate improvements?

Growth (10 questions):
1. How long before I see SEO results?
2. Do I need a Klaviyo account?
3. Can I add Growth to my existing plan?
4. What kind of email flows do you set up?
5. How do you report on results?
6. What's the difference between Lite and Pro?
7. Do you write the email copy?
8. What if I'm already doing some SEO?
9. How does performance-based pricing work?
10. Can I start with SEO only and add email later?

Starter Site (8 questions):
1. What if I need more than 5 pages?
2. Do I need WordPress Care afterward?
3. Can I provide my own design or content?
4. What happens after launch?
5. Do you use a page builder or custom code?
6. Can I add e-commerce later?
7. Will my site work on mobile?
8. What's the $300 price I see mentioned?

---

## 4. WordPress Care Tier Structure

WordPress Care is the flagship service and the primary recurring revenue driver. It gets the most sophisticated tier structure.

### 4.1 Tier Definitions

| | Essential | Professional (Recommended) | Business |
|---|---|---|---|
| **Monthly** | $99/mo | $149/mo | $249/mo |
| **Annual** | $84/mo (billed $1,008/yr) | $127/mo (billed $1,524/yr) | $212/mo (billed $2,544/yr) |
| **Annual Savings** | Save $180/yr | Save $264/yr | Save $444/yr |
| **Best For** | Small sites, blogs, portfolios | Business sites, growing traffic | WooCommerce, high-traffic, mission-critical |
| **Onboarding** | $150 | Included | Included |

### 4.2 Feature Matrix

| Feature | Essential | Professional | Business |
|---------|:---------:|:------------:|:--------:|
| **Hosting & Infrastructure** | | | |
| Managed WordPress hosting (BigScoots) | check | check | check |
| SSL certificate | check | check | check |
| CDN (Cloudflare Enterprise) | check | check | check |
| Staging environment | -- | check | check |
| Email hosting (10GB) | -- | check | check |
| **Security** | | | |
| Daily malware scans | check | check | check |
| Firewall & DDoS protection | check | check | check |
| Hack-fix guarantee | -- | check | check |
| Security hardening | -- | check | check |
| **Backups & Updates** | | | |
| Daily backups | check | check | check |
| One-click restore | check | check | check |
| Core, theme & plugin updates | Weekly | Weekly | 2x/week |
| Update testing on staging | -- | check | check |
| **Performance** | | | |
| Image compression (ShortPixel) | -- | check | check |
| Spam protection (CleanTalk) | -- | check | check |
| Speed optimization | Basic | Advanced | Priority |
| Core Web Vitals monitoring | -- | check | check |
| **Support** | | | |
| Support credits per month | 2 credits | 4 credits | 8 credits |
| Annual support bucket (annual plans) | 12 hrs/yr | -- | -- |
| Response time | < 4 hours | < 2 hours | < 1 hour |
| Email support | check | check | check |
| Text/chat support | -- | check | check |
| Phone support | -- | -- | check |
| **Reporting** | | | |
| Monthly performance report | check | check | check |
| Plugin audit & recommendations | -- | check | check |
| Quarterly strategy review | -- | -- | check |
| **Extras** | | | |
| Free site migration | check | check | check |
| 99.9% uptime SLA | check | -- | -- |
| 99.99% uptime SLA | -- | check | check |

### 4.3 Support Credit System

A support credit = one task of approximately 15-30 minutes of work. Examples:
- Update page content (1 credit)
- Add a new blog post with images (1 credit)
- Install and configure a plugin (1-2 credits)
- Fix a broken layout or CSS issue (1 credit)
- Custom code change (2+ credits)

Credits do NOT roll over month-to-month on monthly plans. On annual plans, the Essential tier gets a 12-hour annual bucket instead, giving more flexibility.

Additional credits can be purchased at $45/each (Essential), $40/each (Professional), $35/each (Business).

### 4.4 Why These Tiers

**Essential ($99/mo):** Matches the current offering with small additions (CDN, migration). This is the "BigScoots hosting + basic maintenance" package. Competitive with SkyrocketWP Delta 4, CMSMinds Starter, and FatLab Starter.

**Professional ($149/mo):** The upsell sweet spot. Adds staging, hack-fix guarantee, image compression, spam protection, faster support, and more credits. This is where most business sites should land. Competitive with WP Buffs Protect ($179) and FixMySite Security ($159) while offering more value.

**Business ($249/mo):** WooCommerce and high-traffic sites that need everything. Includes phone support, priority speed optimization, quarterly reviews. Bridges into the E-Commerce maintenance tier. Competitive with SkyrocketWP Saturn 5 ($249) and WP Buffs Perform ($239).

### 4.5 Other Service Tiers (Simpler)

**E-Commerce:** No tiers on the service page itself. The setup is project-scoped ($1,500 / $3,500 / $7,500+ depending on complexity), and the ongoing maintenance ($249/mo) includes WordPress Care Business-tier features. Show a single "what's included" list with a note: "Every store is different -- contact me for a custom quote."

**Growth:** Two tiers:
- **Lite ($249/mo):** SEO audit + ongoing optimization + monthly reporting. Best for businesses not yet doing email marketing.
- **Pro ($499/mo):** Everything in Lite + Klaviyo email flows, campaign management, A/B testing, revenue attribution. Best for e-commerce stores wanting the full growth stack.
- Optional note: "Performance-based pricing available for established stores -- let's talk."

**Starter Site:** No tiers. Single offering at $500 (or $300 when bundled with any care plan). Feature list with add-on pricing for extra pages ($100/page) and custom features (quoted per project).

---

## 5. Component Designs

### 5.1 PricingToggle

A pill-shaped monthly/annual toggle component.

**Visual:** Two segments inside a rounded pill. The active segment has a primary blue background with white text. The inactive segment has transparent background with muted text. A subtle slide animation moves the active indicator.

**Props:**
- `billingPeriod: 'monthly' | 'annual'`
- `onToggle: (period) => void`
- `annualDiscount: string` (e.g., "Save 15%")

**Behavior:** Clicking toggles the state. All pricing cards on the page update simultaneously. The annual option shows a small teal badge with savings percentage.

### 5.2 PricingCard

A single tier card within the pricing section.

**Visual:**
- White card with subtle shadow
- Header: tier name, optional "Recommended" badge
- Price: large number with `/mo` suffix, billing note below
- Annual savings in accent teal (when annual selected)
- "Best for" one-liner in muted text
- Horizontal rule
- Feature list with blue checkmarks for included, gray line-through for excluded
- Primary CTA button at bottom
- Recommended tier: primary blue top border (4px), slight scale-up (102-105%), "Recommended" badge in primary blue

**Props:**
- `tier: TierData`
- `billingPeriod: 'monthly' | 'annual'`
- `isRecommended: boolean`

### 5.3 FeatureComparisonTable

A detailed comparison matrix for all tiers of a service.

**Visual:**
- Sticky header row with tier names and monthly prices
- Rows grouped by category with category headers (bold, slightly larger)
- Blue checkmark icon for included features
- Gray X or line-through muted text for excluded features
- Text values for non-boolean features (e.g., "2 credits" vs "4 credits")
- Alternating row backgrounds for readability (white / background-alt)
- "Recommended" column highlighted with a subtle primary blue background tint

**Mobile transformation:** Becomes a tabbed interface. Three tabs at top (one per tier). Each tab shows that tier's features in a vertical list. Features not in the selected tier show as grayed-out with "Upgrade to [tier] to get this" text.

### 5.4 ProcessStep / HowItWorks

Alternating image/text blocks for the process section.

**Visual:**
- Each step is a full-width row split 50/50 (image and text)
- Odd steps: image left, text right
- Even steps: text left, image right
- Step number in a circle (primary blue background, white text)
- Heading, description paragraph
- Line art illustration on the image side
- A vertical connecting line between steps (decorative)

**Mobile:** Single column, all steps stacked with image above text.

### 5.5 FeatureBlock

Alternating image/text deep-dive blocks (WP Engine style).

**Visual:** Similar to ProcessStep but without step numbers. Each block:
- 50/50 split on desktop
- Alternating image side
- Heading (benefit-focused)
- 2-3 sentence body copy
- Optional bullet points for sub-features
- Line art illustration

### 5.6 StatCard

A single trust signal stat display.

**Visual:**
- Large stat value (e.g., "99.99%") in highlight color, font-weight 800
- Label below (e.g., "Uptime Guaranteed") in normal weight
- Optional subtext in muted/small
- Optional small icon above the stat in primary blue
- Card has subtle background (background-alt) and rounded corners

**Layout:** 3-4 stat cards in a row on desktop, 2x2 on tablet, stacked on mobile.

### 5.7 FAQAccordion

Enhanced version of the existing `<details>` accordion.

**Visual:**
- Each item: rounded border, subtle background on hover
- Question text in font-medium
- Plus icon rotates to X on open (CSS transition)
- Answer area expands with smooth max-height animation
- Answer text in muted color, slightly smaller
- Group items with subtle spacing between them

**Enhancement over current:** Add smooth open/close animation using CSS `grid-template-rows: 0fr` -> `1fr` transition (the modern CSS accordion technique). The current rotate-45 on the `+` icon is fine but should be a proper X rotation.

### 5.8 TrustBar

A horizontal stats strip, typically placed below the hero.

**Visual:**
- Full-width section with background-alt or white
- 3-4 items arranged horizontally with subtle dividers
- Each item: small icon (line art), stat text, label text
- Compact vertical spacing

### 5.9 ScrollReveal (Animation Wrapper)

A utility component that wraps any content and reveals it on scroll.

**Props:**
- `animation: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right'`
- `delay: number` (ms, for staggering siblings)
- `threshold: number` (0-1, how much of element must be visible)

**Implementation:** Uses Intersection Observer. Applies CSS classes that transition `opacity` and `transform`. Respects `prefers-reduced-motion`.

---

## 6. Content Strategy Per Service

### 6.1 WordPress Care

**Primary message:** "Your website works 24/7. Shouldn't someone be watching it 24/7?"

**Hero copy direction:** Emphasize peace of mind. The business owner should feel that signing up means they never have to think about their website's health again.

**Key selling points to emphasize:**
1. BigScoots enterprise hosting included (99.99% uptime)
2. Security that actually protects (not just scans -- hack-fix guarantee)
3. You get a real person, not a ticket queue
4. Monthly reports show real value (not just "we did stuff")

**Emotional hook:** Fear of downtime, fear of getting hacked, frustration with DIY maintenance.

**Feature deep-dive topics:**
1. Hosting & uptime (BigScoots infrastructure, CDN, performance)
2. Security (malware, firewall, hack-fix, DDoS)
3. Updates & staging (safe updates, rollback, no surprises)
4. Reporting & support (what you get, how credits work)

### 6.2 E-Commerce

**Primary message:** "A store that sells while you sleep."

**Hero copy direction:** Emphasize revenue impact. Every dollar spent on the store should feel like an investment that pays for itself.

**Key selling points:**
1. Not just setup -- ongoing optimization for conversions
2. WooCommerce and Shopify expertise
3. Payment, shipping, tax -- all handled
4. WordPress Care included (for WooCommerce)

**Emotional hook:** Fear of lost sales, frustration with technical store management, desire for growth.

**Feature deep-dive topics:**
1. Store setup & migration (seamless transition from any platform)
2. Conversion optimization (product pages, checkout flow, speed)
3. Integrations (payment gateways, shipping, accounting, email)
4. Ongoing management (inventory, updates, seasonal campaigns)

### 6.3 Growth (SEO + Klaviyo)

**Primary message:** "Customers don't find you by accident."

**Hero copy direction:** Emphasize the gap between having a website and having customers. Growth bridges that gap.

**Key selling points:**
1. SEO + email is the highest-ROI marketing combo for small business
2. No one else bundles both at this price
3. You get strategy, not just execution
4. Performance-based option aligns incentives

**Emotional hook:** Frustration with "build it and they will come" failing, wasted ad spend, competitors outranking them.

**Feature deep-dive topics:**
1. SEO audit & optimization (technical + content + local)
2. Klaviyo flows (welcome, abandoned cart, post-purchase, win-back)
3. Campaign management (A/B testing, segmentation, scheduling)
4. Reporting & attribution (know exactly what's working)

### 6.4 Starter Site

**Primary message:** "A professional website. Two weeks. Five hundred dollars."

**Hero copy direction:** Emphasize speed, value, and professionalism. This isn't a DIY template -- it's a real site built by a real person.

**Key selling points:**
1. Two-week delivery (industry avg is 4-8 weeks)
2. $500 all-in (no surprise charges)
3. SEO-ready from day one
4. First month of WordPress Care free

**Emotional hook:** Overwhelm from DIY platforms, embarrassment about current web presence, impatience to get online.

**Feature deep-dive topics:**
1. What you get (5 pages, contact form, analytics, mobile-responsive)
2. The design process (consultation, mockup, build, launch)
3. SEO foundation (meta tags, speed, structured data)
4. What happens after launch (WordPress Care transition)

---

## 7. Animation & Interaction Plan

All animations follow the rules in `docs/brand-guidelines.md`. Key constraints:
- GPU-accelerated properties only (transform, opacity)
- 200-400ms for micro-interactions, 600-800ms for scroll reveals
- `ease-in-out` or `ease-out` timing
- Respect `prefers-reduced-motion`
- No bounces, spins, or jarring effects

### 7.1 Scroll Reveal Animations

| Element | Animation | Duration | Delay Pattern |
|---------|-----------|----------|---------------|
| Section headings | fade-up | 600ms | none |
| Trust bar stats | fade-up | 600ms | 100ms stagger |
| Pricing cards | fade-up | 600ms | 150ms stagger (left to right) |
| Feature comparison rows | fade-in | 400ms | 50ms stagger |
| Process steps | slide-left / slide-right (alternating) | 700ms | none |
| Feature deep-dive blocks | slide-left / slide-right (alternating) | 700ms | none |
| Stat cards | fade-up + counter animation | 800ms | 150ms stagger |
| FAQ items | fade-up | 400ms | 50ms stagger |

### 7.2 Interactive Animations

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Pricing toggle | Pill indicator slides, prices cross-fade | 300ms |
| Pricing card hover | translateY(-4px) + shadow elevation | 200ms |
| FAQ accordion open | grid-template-rows 0fr to 1fr + icon rotation | 300ms |
| FAQ accordion close | reverse of open | 250ms |
| CTA button hover | opacity 0.85 | 200ms |
| Card hover | translateY(-2px) + shadow elevation + border color | 200ms |
| Stat counter | Number counts up from 0 to value | 1200ms ease-out |
| Tab switch (mobile comparison) | content cross-fade | 250ms |

### 7.3 Implementation Approach

**ScrollReveal component** (see 5.9): A single reusable wrapper using Intersection Observer. Elements start with `opacity: 0` and a slight transform offset, then transition to their final state when the observer triggers.

```
Initial state:  opacity: 0; transform: translateY(20px)
Final state:    opacity: 1; transform: translateY(0)
```

For slide-left/slide-right:
```
Initial state:  opacity: 0; transform: translateX(-40px) or translateX(40px)
Final state:    opacity: 1; transform: translateX(0)
```

**Counter animation:** A simple `requestAnimationFrame` loop that increments a displayed number from 0 to the target value over 1200ms with ease-out timing. Only triggers when the stat card enters the viewport.

**Pricing toggle:** React state drives the displayed prices. A CSS transition on the pill indicator position creates the sliding effect. Price values use `transition: opacity 200ms` for a cross-fade when the billing period changes.

**FAQ accordion:** Use the CSS `grid-template-rows` technique:
```css
.faq-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease-in-out;
}
.faq-content[data-open="true"] {
  grid-template-rows: 1fr;
}
.faq-content > div {
  overflow: hidden;
}
```

### 7.4 Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All scroll reveal animations are instant (no delay, no transform, just appear)
- FAQ accordion still opens/closes but without animation
- Pricing toggle snaps instead of sliding
- Counter animation shows the final number immediately
- Hover effects remain (these are expected interaction feedback)

---

## 8. Image Generation Plan

All images follow the brand icon style: line art with dark outlines (#0F172A or #1E293B) and blue (#2563EB) accent highlights on white backgrounds. No fills, no gradients, no photorealistic elements.

### 8.1 Service Hero Illustrations (4 images)

These appear in the hero section of each service detail page, approximately 400x400px.

| Service | Description | Prompt Direction |
|---------|-------------|-----------------|
| WordPress Care | Shield protecting a website/server | "Clean line art illustration of a protective shield surrounding a website server icon, dark slate outlines (#0F172A), blue (#2563EB) accent on the shield and connection lines, white background, minimal style, no text, no gradients" |
| E-Commerce | Shopping cart with upward growth arrow and dollar signs | "Clean line art illustration of a shopping cart with product boxes and an upward trending arrow, dark slate outlines (#0F172A), blue (#2563EB) accent on the arrow and key elements, white background, minimal style, no text" |
| Growth | Rocket launching from a chart/graph | "Clean line art illustration of a small rocket launching upward from a bar chart, surrounded by email envelope and search magnifying glass icons, dark slate outlines (#0F172A), blue (#2563EB) accent on the rocket and graph bars, white background, minimal" |
| Starter Site | Browser window with a fresh website being built | "Clean line art illustration of a web browser window with a website being assembled like puzzle pieces, dark slate outlines (#0F172A), blue (#2563EB) accent on key interface elements, white background, minimal style, no text" |

### 8.2 Process Step Illustrations (12-16 images)

Smaller illustrations (~300x300px) for each step of the "How It Works" section on each service page.

**WordPress Care (4 steps):**
1. Onboarding: clipboard with checklist and magnifying glass
2. Migration: server with arrow pointing to new server
3. Ongoing care: wrench and gear with calendar
4. Support: chat bubble with person

**E-Commerce (4 steps):**
1. Discovery: two people talking with thought bubbles showing store
2. Store build: browser window with product grid being constructed
3. Launch: rocket with confetti and shopping bag
4. Optimize: chart going up with A/B test icons

**Growth (4 steps):**
1. Audit: magnifying glass over website with checklist
2. Strategy: whiteboard with keyword list and email flow diagram
3. Execute: gear icons with email and search icons in motion
4. Report: dashboard with charts and metrics

**Starter Site (3 steps):**
1. Consult: two people at a table with laptop
2. Design & build: wireframe turning into finished site
3. Launch: website going live with checkmark

### 8.3 Feature Deep-Dive Illustrations (12-16 images)

Medium illustrations (~350x350px) for the alternating image/text feature blocks.

These should be slightly more detailed than the process step illustrations but maintain the same line art style. Topics listed in Section 6 (Content Strategy).

### 8.4 Trust Section Icons (12-16 small icons)

Small icons (~64x64px or inline SVG) for the trust bar and stat cards:
- Shield (security)
- Clock (response time / speed)
- Server rack (uptime)
- Chart/arrow up (growth/performance)
- Lock (SSL/encryption)
- Cloud (CDN/backups)
- Checkmark circle (guarantee)
- Handshake (no contracts)
- Calendar (monthly reports)
- Envelope (email support)
- Phone (phone support)
- Star (quality)

These can potentially be implemented as simple SVG icons rather than AI-generated images, keeping them crisp at all sizes.

### 8.5 Generation Strategy

**Phase 1 (MVP):** Generate the 4 service hero illustrations and the 12-16 trust/stat icons. These are the most visible and impactful.

**Phase 2:** Generate process step illustrations (12-16 images).

**Phase 3:** Generate feature deep-dive illustrations (12-16 images).

**Tool:** OpenAI DALL-E 3 or Gemini Imagen for generation. Review each against the brand palette. Post-process if needed to ensure blue matches #2563EB exactly.

**Format:** PNG at 2x resolution (800x800 for 400x400 display, 600x600 for 300x300 display) for retina/HiDPI. Optimize with next-image-export-optimizer.

---

## 9. Data Architecture

The current `services.ts` file needs significant expansion to support tiers, feature matrices, and richer content.

### 9.1 Expanded Type Definitions

```typescript
interface ServiceTier {
  id: string;
  name: string;                    // "Essential", "Professional", "Business"
  monthlyPrice: number;            // 99
  annualMonthlyPrice: number;      // 84
  annualTotal: number;             // 1008
  annualSavings: number;           // 180
  bestFor: string;                 // "Small sites, blogs, portfolios"
  isRecommended: boolean;
  onboardingFee: number | null;    // 150 or null (included)
  ctaText: string;                 // "Get Started"
  ctaLink: string;                 // "/contact?service=wordpress-care&tier=essential"
}

interface FeatureCategory {
  name: string;                    // "Hosting & Infrastructure"
  features: FeatureRow[];
}

interface FeatureRow {
  name: string;                    // "Managed WordPress hosting"
  tooltip?: string;                // Optional hover explanation
  values: Record<string, string | boolean>;
  // e.g., { essential: true, professional: true, business: true }
  // or:   { essential: "2 credits", professional: "4 credits", business: "8 credits" }
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  image: string;                   // path to illustration
}

interface FeatureDeepDive {
  title: string;                   // benefit-focused heading
  description: string;
  bullets?: string[];
  image: string;
}

interface TrustStat {
  value: string;                   // "99.99%"
  label: string;                   // "Uptime Guaranteed"
  subtext?: string;
  icon?: string;
}

interface ServicePageData {
  // Basic info (existing)
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;

  // Hero
  heroHeadline: string;
  heroSubheadline: string;
  heroCopy: string;
  heroImage: string;

  // Pricing
  tiers: ServiceTier[];
  featureCategories: FeatureCategory[];
  showPricingToggle: boolean;

  // Or for non-tiered services:
  singlePrice?: {
    label: string;
    value: string;
    note?: string;
  };

  // Process
  processSteps: ProcessStep[];
  processHeadline: string;

  // Feature deep-dives
  featureBlocks: FeatureDeepDive[];

  // Trust
  trustStats: TrustStat[];

  // FAQ (expanded)
  faq: { q: string; a: string }[];

  // CTA
  ctaHeadline: string;
  ctaDescription: string;
  ctaLinkText: string;
  ctaLinkHref: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
}
```

### 9.2 Data File Organization

Instead of one massive file, split service data into individual files:

```
frontend/src/data/
  services.ts              -- Service[] with basic info (keeps homepage/overview working)
  services/
    wordpress-care.ts      -- Full ServicePageData for WP Care
    ecommerce.ts           -- Full ServicePageData for E-Commerce
    growth.ts              -- Full ServicePageData for Growth
    starter-site.ts        -- Full ServicePageData for Starter Site
    index.ts               -- Re-exports all, helper functions
```

The existing `services.ts` stays as-is for backward compatibility with the homepage cards and Quote Explorer. The new per-service files contain the rich page data.

---

## 10. Mobile Considerations

Mobile traffic is 58%+ for SaaS pricing pages. Every component must work well on small screens.

### 10.1 Key Mobile Patterns

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Pricing cards | 3 side-by-side | Vertically stacked, recommended first |
| Feature comparison table | Full matrix with sticky header | Tabbed: select tier, see features |
| Process steps | Alternating image/text | Stacked: image above text |
| Feature deep-dives | Alternating image/text | Stacked: image above text |
| Trust bar | 4 in a row | 2x2 grid |
| Stat cards | 4 in a row | 2x2 grid |
| FAQ accordion | Full width | Full width (no change needed) |
| Service overview cards | 2x2 grid | Single column stack |

### 10.2 Mobile-First CTA Behavior

- Primary CTA button should be full-width on mobile
- Consider a sticky bottom CTA bar on service detail pages (appears after scrolling past the hero)
- "Back to top" floating button for long pages

### 10.3 Touch Targets

All interactive elements (buttons, toggles, accordion headers, tabs) must be at least 44x44px per Apple Human Interface Guidelines.

---

## 11. Open Questions

These are decisions that need to be made before or during implementation:

### Pricing & Business

1. **WordPress Care tiers confirmed?** The $99 / $149 / $249 structure is a proposal based on competitive research. Need final approval on pricing and feature allocation.

2. **Support credit system confirmed?** Credits vs. fixed hours vs. unlimited (with fair use). The credit system is proposed but needs validation.

3. **Growth tier split confirmed?** Lite ($249) + Pro ($499) or keep it simple at one price? The competitive research strongly suggests the current $249 for SEO + Klaviyo is underpriced.

4. **30-day satisfaction guarantee?** Mentioned as "considering" -- this is a strong conversion driver (CuriousM offers 30-day risk-free). Recommend implementing it.

5. **Annual pricing discount percentage?** Proposed at ~15%. Some competitors offer up to 25%. Need to decide the exact discount.

6. **E-Commerce setup tiers?** $1,500 / $3,500 / $7,500+ was recommended in the competitive research. Do we show these tiers on the page or keep it as "from $1,500" with a "contact for quote" flow?

### Design & Content

7. **Testimonials:** The design overhaul doc notes "No testimonials until real ones are available." Do we include placeholder sections for future testimonials, or omit them entirely for now?

8. **Video content:** BigScoots has video testimonials. Is video content planned for any phase?

9. **Calendly integration:** CuriousM has inline scheduling. Do we want a "Book a Call" option on service pages?

10. **Chat widget:** Several competitors offer live chat. Is this planned?

11. **BigScoots portal access:** The trust signals mention "clients get BigScoots portal access." Should we screenshot/illustrate the portal in the feature deep-dives?

### Technical

12. **Static export compatibility:** The monthly/annual toggle and mobile tab views require client-side JavaScript. Since the site uses `output: 'export'`, all interactive components must be `"use client"` components. This is fine but worth noting.

13. **Image generation timeline:** AI-generated images may need iteration to match brand guidelines. Should we build the pages with placeholder illustrations first and swap in final images later?

14. **Performance budget:** With 30-40+ images per service page (4 service pages = 120-160 images total), we need to be aggressive about lazy loading, next-image-export-optimizer settings, and image sizing. Consider placeholder skeletons for images below the fold.

---

## Summary

This redesign transforms the services section from a basic card grid into a conversion-optimized marketing experience with:

- **Rich service detail pages** with tiered pricing, feature comparisons, process walkthroughs, trust signals, and comprehensive FAQs
- **A proper tier structure** for WordPress Care (Essential / Professional / Business) with clear feature differentiation
- **Interactive elements** (pricing toggle, comparison tabs, animated counters) that make the pages engaging without being flashy
- **Scroll-reveal animations** that build visual interest as visitors explore
- **AI-generated illustrations** in a consistent line art style that reinforces the brand
- **Mobile-first design** that works well for the 58%+ of visitors on phones

The section order on each page follows the proven conversion funnel: Hero -> Trust -> Pricing -> Comparison -> Process -> Features -> Trust Stats -> FAQ -> CTA. Each section reduces a specific objection and moves the visitor closer to action.

The main `/services` page becomes a hub that helps visitors self-select the right service, with an overview of all offerings, a quick comparison matrix, the interactive Quote Explorer, and clear paths to each service detail page.
