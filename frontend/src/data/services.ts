export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  startingAt: string;
  setupFrom?: string;
  icon?: string;
  features: string[];
  callouts?: string[];
  faq: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    id: "wordpress-care",
    slug: "wordpress-care",
    name: "WordPress Care",
    tagline: "Keep your site fast, secure, and up to date",
    icon: "/icon-wordpress-care.png",
    description:
      "Your website is your storefront \u2014 it needs to be fast, secure, and always online. WordPress Care includes managed hosting on enterprise infrastructure, daily backups, security monitoring, hack-fix guarantee, and premium support tokens for site changes and updates.",
    startingAt: "From $99/mo (annual)",
    setupFrom: "$300 onboarding \u2014 waived for annual plans",
    features: [
      "Managed WordPress hosting with SSL & CDN",
      "Daily backups with one-click restore",
      "Security monitoring, malware scans & hack-fix guarantee",
      "Core, theme & plugin updates",
      "Staging environment for safe testing",
      "Plugin audit at onboarding",
      "Monthly performance report",
      "2 premium support tokens/mo (< 30 min tasks)",
      "24/7 support portal access",
    ],
    callouts: [
      "Three tiers: Essential ($99/mo) \u2022 Professional ($149/mo) \u2022 Business ($249/mo)",
      "Need a new site? Starter sites from $300 with an annual care plan",
    ],
    faq: [
      {
        q: "What\u2019s the difference between Essential, Professional, and Business?",
        a: "All tiers include hosting, backups, security, and updates. Professional adds email support, more support tokens, advanced speed optimization, and Core Web Vitals monitoring. Business adds text/call support, 8 tokens/mo, priority speed optimization, and monthly strategy check-ins.",
      },
      {
        q: "What are premium support tokens?",
        a: "Each token covers one task under 30 minutes \u2014 content updates, plugin installs, CSS fixes, etc. Essential gets 2/mo, Professional 4/mo, Business 8/mo. Additional tokens available at $40\u2013$50 each.",
      },
      {
        q: "What if I already have hosting?",
        a: "We\u2019ll migrate your site to our managed hosting at no extra cost. Migration is included with every plan.",
      },
      {
        q: "What\u2019s included in the monthly report?",
        a: "Uptime stats, page speed metrics, security scan results, update logs, and any recommendations for improvement.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Monthly plans have no contracts \u2014 cancel anytime with 30 days notice. Annual plans are billed upfront for the year.",
      },
      {
        q: "Do you build new WordPress sites?",
        a: "Yes! Starter sites start at $300 when paired with an annual care plan, or $500 standalone. Custom builds are scoped individually.",
      },
    ],
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    name: "E-Commerce",
    tagline: "Sell more with a store built for conversion",
    icon: "/icon-ecommerce.png",
    description:
      "Whether you\u2019re launching your first online store or optimizing an existing one, I build e-commerce experiences that turn browsers into buyers. From WooCommerce to Shopify, I handle catalog setup, payment integration, shipping configuration, and ongoing store management.",
    startingAt: "Store Care from $249/mo",
    setupFrom: "Store setup from $1,500",
    features: [
      "WooCommerce or Shopify setup & customization",
      "Product catalog setup & migration",
      "Payment gateway integration",
      "Shipping & tax configuration",
      "Conversion rate optimization",
      "Ongoing store management",
      "WordPress Care included (WooCommerce stores)",
      "Monthly performance & revenue reporting",
    ],
    callouts: [
      "Store Care ($249/mo) \u2022 Store Growth ($449/mo)",
      "Third-party tools (plugins, tax automation) billed separately by providers",
    ],
    faq: [
      {
        q: "WooCommerce or Shopify \u2014 which should I use?",
        a: "WooCommerce is best if you want full control and already have a WordPress site. Shopify is great if you want a simpler, hosted solution. We\u2019ll help you choose based on your needs.",
      },
      {
        q: "Can you migrate my store from another platform?",
        a: "Yes \u2014 we handle product, customer, and order data migration from most major platforms including Magento, BigCommerce, and Etsy.",
      },
      {
        q: "What\u2019s the difference between Store Care and Store Growth?",
        a: "Store Care ($249/mo) includes WordPress Care Professional, basic CRO monitoring, email support, and 4 support tokens/mo. Store Growth ($449/mo) adds active conversion optimization, text/call support, 8 tokens/mo, revenue analysis, and monthly strategy calls.",
      },
      {
        q: "Is WordPress Care included?",
        a: "For WooCommerce stores, yes \u2014 hosting, security, updates, and backups are all included. For Shopify stores, you pay Shopify directly; our maintenance covers management and optimization.",
      },
      {
        q: "What payment processors do you support?",
        a: "Stripe, PayPal, Square, and most major gateways. We\u2019ll set up whatever works best for your business and customers.",
      },
    ],
  },
  {
    id: "marketing",
    slug: "marketing",
    name: "Marketing",
    tagline: "Get found, get customers, get sales",
    icon: "/icon-growth.png",
    description:
      "Customers don\u2019t find you by accident. Marketing combines SEO and Klaviyo email marketing to drive traffic, nurture leads, and turn one-time buyers into repeat customers \u2014 with clear revenue attribution so you know exactly what\u2019s working.",
    startingAt: "From $500/mo (annual) or $250/mo + rev share",
    setupFrom: "Setup from $1,500",
    features: [
      "Full SEO audit & ongoing optimization",
      "Google Search Console monitoring & action",
      "Klaviyo email flows & campaigns",
      "Done-for-you content (AI-assisted, expert reviewed)",
      "List hygiene & deliverability monitoring",
      "Revenue attribution reporting",
      "Monthly 30-min strategy check-in",
      "Additional Klaviyo flows available ($150 each)",
    ],
    callouts: [
      "Requires a WordPress Care or Store Care plan",
      "Performance-based pricing available \u2014 my success is tied to yours",
      "Social media management coming soon \u2014 contact me if you need help now",
    ],
    faq: [
      {
        q: "How does performance-based pricing work?",
        a: "You pay a lower base fee ($250/mo annual) plus 5\u201310% of the revenue my marketing generates above your current baseline. I only get paid more when you make more. Prefer a flat rate? $500/mo annual covers everything.",
      },
      {
        q: "Why does Marketing require a care plan?",
        a: "Effective SEO and email marketing need direct access to your site \u2014 for on-page optimization, plugin integration, landing pages, and tracking. A care plan ensures I have the access and infrastructure to deliver results.",
      },
      {
        q: "How long before I see SEO results?",
        a: "SEO is a long game \u2014 most clients see meaningful ranking improvements within 3\u20136 months. We provide monthly reports so you can track progress from day one.",
      },
      {
        q: "Do I need a Klaviyo account?",
        a: "Yes, but we\u2019ll help you set it up. Klaviyo has a free tier for small lists. You pay Klaviyo directly \u2014 it\u2019s not included in our fee.",
      },
      {
        q: "What kind of email flows do you set up?",
        a: "Welcome series, abandoned cart recovery, post-purchase follow-ups, win-back campaigns, browse abandonment, and more \u2014 scoped to your needs during setup.",
      },
      {
        q: "What\u2019s the setup fee for?",
        a: "Marketing setup is substantial: SEO audit, Klaviyo integration, email flow creation, list setup, warming, and keyword research. Setup is $1,500 for annual clients or $3,000 for monthly clients.",
      },
    ],
  },
  {
    id: "starter-site",
    slug: "starter-site",
    name: "Starter Site",
    tagline: "A professional website to get you online fast",
    icon: "/icon-starter-site.svg",
    description:
      "You need a website that looks professional, loads fast, and works on every device \u2014 without the agency price tag. Starter Site gets you a polished WordPress site with up to 5 pages, SEO-ready structure, and a contact form, launched within 2 weeks.",
    startingAt: "$500 one-time ($300 with annual care plan)",
    setupFrom: "WordPress Care required from $99/mo",
    features: [
      "Custom WordPress theme setup",
      "Mobile-responsive design",
      "Up to 5 pages (Home, About, Services, Contact, Blog)",
      "SEO-ready structure & meta tags",
      "Contact form integration",
      "Google Analytics setup",
      "Launch within 2 weeks",
      "First month of WordPress Care free",
    ],
    callouts: [
      "WordPress Care plan required \u2014 your site needs a home",
      "Additional pages $100 each",
    ],
    faq: [
      {
        q: "Why is WordPress Care required?",
        a: "Your site needs hosting, security, updates, and backups to stay online and healthy. WordPress Care handles all of that starting at $99/mo. Your first month is included free with a Starter Site.",
      },
      {
        q: "What if I need more than 5 pages?",
        a: "Additional pages are $100 each. For larger sites with custom functionality, we\u2019ll scope a custom project together.",
      },
      {
        q: "Can I provide my own design or content?",
        a: "Absolutely. If you have brand guidelines, logos, or copy ready to go, we\u2019ll use them. Otherwise, I\u2019ll help you get started with a clean, professional look.",
      },
      {
        q: "What happens after launch?",
        a: "You\u2019ll get a walkthrough of your site and admin access so you can make basic content updates yourself. WordPress Care handles everything else \u2014 updates, backups, security, and support.",
      },
    ],
  },
];
