export interface ServiceDetail {
  slug: string;
  heroDescription: string;
  processSteps: { title: string; description: string }[];
  trustStats: { value: string; label: string }[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "wordpress-care",
    heroDescription:
      "Your website works 24/7. Shouldn\u2019t someone be watching it 24/7? WordPress Care handles hosting, updates, security, and backups on enterprise infrastructure \u2014 so you never have to think about downtime or vulnerabilities.",
    processSteps: [
      {
        title: "Onboarding",
        description:
          "I audit your current site, install security tools, and set up monitoring. You get access to the support portal.",
      },
      {
        title: "Migration",
        description:
          "Your site moves to managed hosting with zero downtime. SSL, CDN, and staging are configured automatically.",
      },
      {
        title: "Ongoing Care",
        description:
          "Updates happen weekly. Backups run daily. Security scans run constantly. You get a monthly report showing everything.",
      },
      {
        title: "Support",
        description:
          "Need something changed? Email, text, or use the support portal. I respond within minutes, not days.",
      },
    ],
    trustStats: [
      { value: "99.99%", label: "Uptime Guaranteed" },
      { value: "< 90s", label: "Support Response" },
      { value: "Daily", label: "Backups & Scans" },
      { value: "0", label: "Breaches" },
    ],
  },
  {
    slug: "ecommerce",
    heroDescription:
      "A store that sells while you sleep. From WooCommerce to Shopify, I build and manage e-commerce experiences that turn browsers into buyers \u2014 with payment, shipping, and tax handled end to end.",
    processSteps: [
      {
        title: "Discovery",
        description:
          "We talk about your products, audience, and goals. I recommend the right platform and features.",
      },
      {
        title: "Store Build",
        description:
          "Theme setup, product catalog, payment gateway, shipping, and tax \u2014 all configured and tested.",
      },
      {
        title: "Launch",
        description:
          "Your store goes live with everything working. You get 2 hours of training to manage day-to-day.",
      },
      {
        title: "Optimize",
        description:
          "Monthly performance reviews, conversion optimization, and ongoing management keep your store growing.",
      },
    ],
    trustStats: [
      { value: "99.99%", label: "Uptime Guaranteed" },
      { value: "WooCommerce", label: "& Shopify" },
      { value: "Included", label: "WordPress Care" },
      { value: "Monthly", label: "Revenue Reports" },
    ],
  },
  {
    slug: "growth",
    heroDescription:
      "Customers don\u2019t find you by accident. Growth combines SEO and Klaviyo email marketing to drive traffic, nurture leads, and turn one-time buyers into repeat customers \u2014 with clear attribution so you know exactly what\u2019s working.",
    processSteps: [
      {
        title: "Audit",
        description:
          "I analyze your current SEO, email setup, and analytics to find the biggest opportunities.",
      },
      {
        title: "Strategy",
        description:
          "We build a plan: keyword targets, email flows, campaign calendar, and success metrics.",
      },
      {
        title: "Execute",
        description:
          "SEO optimizations go live, email flows are configured in Klaviyo, campaigns start sending.",
      },
      {
        title: "Report",
        description:
          "Monthly reports show exactly what\u2019s working: traffic, open rates, revenue attribution.",
      },
    ],
    trustStats: [
      { value: "SEO", label: "& Email Combined" },
      { value: "Klaviyo", label: "Certified Partner" },
      { value: "Monthly", label: "Strategy Reviews" },
      { value: "ROI", label: "Tracked & Reported" },
    ],
  },
  {
    slug: "starter-site",
    heroDescription:
      "A professional website. Two weeks. Five hundred dollars. No DIY templates \u2014 a real WordPress site built by a real person, SEO-ready from day one with your first month of maintenance free.",
    processSteps: [
      {
        title: "Consult",
        description:
          "We discuss your business, audience, and goals. I gather your content, logos, and brand preferences.",
      },
      {
        title: "Design & Build",
        description:
          "I set up your WordPress theme, build your pages, configure forms, analytics, and SEO basics.",
      },
      {
        title: "Launch",
        description:
          "Your site goes live. You get a full walkthrough and admin access to manage basic content updates.",
      },
    ],
    trustStats: [
      { value: "2 Weeks", label: "Delivery" },
      { value: "5 Pages", label: "Included" },
      { value: "SEO", label: "Ready from Day 1" },
      { value: "Mobile", label: "Responsive" },
    ],
  },
];

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails.find((d) => d.slug === slug);
}
