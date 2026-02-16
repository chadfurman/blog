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
      "Your website is your storefront — it needs to be fast, secure, and always online. WordPress Care handles the hosting, updates, backups, and security monitoring so you never have to worry about downtime or vulnerabilities. You get a monthly report showing exactly how your site is performing.",
    startingAt: "Starting at $99/mo",
    setupFrom: "Onboarding from $150",
    features: [
      "Managed WordPress hosting with SSL",
      "Daily backups with one-click restore",
      "Security monitoring & malware scans",
      "Core, theme & plugin updates",
      "Plugin audit & optimization",
      "Monthly performance report",
      "30 min support included/mo",
    ],
    callouts: [
      "Need a new site? Starter WordPress sites from $300 with a care plan",
    ],
    faq: [
      {
        q: "What if I already have hosting?",
        a: "We can migrate your site to our managed hosting, or work with your existing provider if you prefer. Migration is included at no extra cost.",
      },
      {
        q: "What's included in the monthly report?",
        a: "Uptime stats, page speed metrics, security scan results, update logs, and any recommendations for improvement.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes — there are no long-term contracts. We ask for 30 days notice so we can help you transition smoothly.",
      },
      {
        q: "Do you build new WordPress sites?",
        a: "Yes! Starter sites start at $300 when paired with a care plan. For custom designs or complex functionality, we'll scope it together.",
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
      "Whether you're launching your first online store or optimizing an existing one, I build e-commerce experiences that turn browsers into buyers. From WooCommerce to Shopify, I handle catalog setup, payment integration, shipping configuration, and ongoing store management.",
    startingAt: "Maintenance starting at $249/mo",
    setupFrom: "Projects from $1,500",
    features: [
      "WooCommerce or Shopify setup & customization",
      "Product catalog setup & migration",
      "Payment gateway integration",
      "Shipping & tax configuration",
      "Third-party app integrations",
      "Conversion rate optimization",
      "Ongoing store management",
    ],
    callouts: [
      "Includes WordPress Care for WooCommerce sites",
      "Shopify setup options available — let's talk",
    ],
    faq: [
      {
        q: "WooCommerce or Shopify — which should I use?",
        a: "WooCommerce is best if you want full control and already have a WordPress site. Shopify is great if you want a simpler, hosted solution. We'll help you choose based on your needs.",
      },
      {
        q: "Can you migrate my store from another platform?",
        a: "Yes — we handle product, customer, and order data migration from most major platforms including Magento, BigCommerce, and Etsy.",
      },
      {
        q: "Is WordPress Care included?",
        a: "For WooCommerce stores, yes — hosting, security, updates, and backups are all included in the maintenance plan.",
      },
      {
        q: "What payment processors do you support?",
        a: "Stripe, PayPal, Square, and most major gateways. We'll set up whatever works best for your business and customers.",
      },
    ],
  },
  {
    id: "growth",
    slug: "growth",
    name: "Growth",
    tagline: "Get found, get customers, get sales",
    icon: "/icon-growth.png",
    description:
      "Great products don't sell themselves — you need people to find you. Growth combines SEO, Klaviyo email marketing, and campaign strategy to drive traffic, nurture leads, and turn one-time buyers into repeat customers. Available as an add-on to any plan or standalone.",
    startingAt: "Starting at $249/mo",
    features: [
      "SEO audit & ongoing optimization",
      "Google Search Console monitoring",
      "Klaviyo email flows & automation",
      "Campaign design & A/B testing",
      "List segmentation & targeting",
      "Revenue attribution reporting",
      "Monthly strategy review",
    ],
    callouts: [
      "Add-on to any plan or standalone service",
      "Performance-based pricing available — we only get paid when you get results. Let's talk.",
    ],
    faq: [
      {
        q: "How long before I see SEO results?",
        a: "SEO is a long game — most clients see meaningful ranking improvements within 3-6 months. We provide monthly reports so you can track progress from day one.",
      },
      {
        q: "Do I need a Klaviyo account?",
        a: "Yes, but we'll help you set it up if you don't have one yet. Klaviyo has a free tier for small lists that's a great starting point.",
      },
      {
        q: "Can I add Growth to my existing plan?",
        a: "Absolutely — Growth works as an add-on to WordPress Care or E-Commerce, or as a standalone service if you're on another platform.",
      },
      {
        q: "What kind of email flows do you set up?",
        a: "Welcome series, abandoned cart recovery, post-purchase follow-ups, win-back campaigns, and promotional flows — typically 5-7 automated sequences.",
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
      "You need a website that looks professional, loads fast, and works on every device — without the agency price tag. Starter Site gets you a polished WordPress site with up to 5 pages, SEO-ready structure, and a contact form, launched within 2 weeks. Pair it with WordPress Care and your first month of maintenance is free.",
    startingAt: "From $500 one-time",
    setupFrom: "+ WordPress Care from $99/mo",
    features: [
      "Custom WordPress theme setup",
      "Mobile-responsive design",
      "Up to 5 pages (Home, About, Services, Contact, Blog)",
      "SEO-ready structure & meta tags",
      "Contact form integration",
      "Google Analytics setup",
      "Launch within 2 weeks",
    ],
    callouts: [
      "Includes first month of WordPress Care free",
      "Need more pages or custom features? Let's talk.",
    ],
    faq: [
      {
        q: "What if I need more than 5 pages?",
        a: "Additional pages are $75 each. For larger sites with custom functionality, we'll scope a custom project together.",
      },
      {
        q: "Do I need WordPress Care afterward?",
        a: "It's strongly recommended — WordPress needs regular updates, backups, and security monitoring to stay healthy. Your first month is included free.",
      },
      {
        q: "Can I provide my own design or content?",
        a: "Absolutely. If you have brand guidelines, logos, or copy ready to go, we'll use them. Otherwise, I'll help you get started with a clean, professional look.",
      },
      {
        q: "What happens after launch?",
        a: "You'll get a walkthrough of your site and admin access so you can make basic content updates yourself. WordPress Care handles everything else.",
      },
    ],
  },
];
