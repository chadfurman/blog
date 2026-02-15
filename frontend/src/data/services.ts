export interface ServiceTier {
  id: string;
  name: string;
  tagline: string;
  setup: string;
  monthly: string;
  features: string[];
}

export const services: ServiceTier[] = [
  {
    id: "wordpress-care",
    name: "WordPress Care",
    tagline: "Fast, secure hosting you don't have to think about.",
    setup: "$500",
    monthly: "$99/mo",
    features: [
      "Managed WordPress hosting",
      "SSL certificate & daily backups",
      "Security monitoring & malware scans",
      "Core, theme & plugin updates",
      "Plugin audit & optimization",
      "Monthly performance report",
      "30 min support included/mo",
    ],
  },
  {
    id: "wordpress-seo",
    name: "WordPress + SEO",
    tagline: "Get found by the customers already searching for you.",
    setup: "$1,000",
    monthly: "$249/mo",
    features: [
      "Everything in WordPress Care",
      "Theme customization & branding",
      "Meta tags, Open Graph & structured data",
      "XML sitemap & robots.txt setup",
      "Google Search Console monitoring",
      "Core Web Vitals optimization",
      "Monthly SEO performance report",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Solutions",
    tagline: "Sell more with a store built for conversion.",
    setup: "Projects from $1,500",
    monthly: "Retainers from $1,000/mo",
    features: [
      "WooCommerce or Shopify customization",
      "Product catalog setup & migration",
      "Payment gateway integration",
      "Shipping & tax configuration",
      "Third-party app integrations",
      "Conversion rate optimization",
      "Ongoing store management",
    ],
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation",
    tagline: "Turn one-time buyers into lifelong customers.",
    setup: "From $2,500",
    monthly: "$750/mo",
    features: [
      "Klaviyo integration & setup",
      "5\u20137 automated email flows",
      "Campaign design & scheduling",
      "A/B testing & optimization",
      "List segmentation & targeting",
      "Revenue attribution reporting",
      "Monthly strategy review",
    ],
  },
];
