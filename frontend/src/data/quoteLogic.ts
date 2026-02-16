import { services, Service } from "./services";

export interface QuoteRecommendation {
  service: Service;
  reason: string;
  pricingNote?: string;
  setupNote?: string;
}

export type GoalId =
  | "new-website"
  | "sell-online"
  | "fix-site"
  | "grow-sales"
  | "other";

export interface GoalOption {
  id: string;
  label: string;
}

export interface GoalDetail {
  question: string;
  options: GoalOption[];
  allowOtherText?: boolean;
}

export const GOALS: { id: GoalId; label: string }[] = [
  { id: "new-website", label: "I Need a New Website" },
  { id: "sell-online", label: "Start Selling Online" },
  { id: "fix-site", label: "Fix / Improve My Site" },
  { id: "grow-sales", label: "Grow My Sales" },
  { id: "other", label: "Other" },
];

export const REVENUE_OPTIONS: GoalOption[] = [
  { id: "under-100k", label: "Under $100k" },
  { id: "100k-500k", label: "$100k – $500k" },
  { id: "500k-1m", label: "$500k – $1M" },
  { id: "over-1m", label: "Over $1M" },
];

export const GOAL_DETAILS: Record<string, GoalDetail> = {
  "new-website": {
    question: "What will your website do?",
    options: [
      { id: "sell", label: "Sell products / services" },
      { id: "info", label: "Share info about my business" },
      { id: "both", label: "Both" },
      { id: "not-sure", label: "Not sure yet" },
    ],
  },
  "sell-online": {
    question: "What are you selling?",
    options: [
      { id: "physical", label: "Physical Products" },
      { id: "digital", label: "Digital Products / Courses" },
      { id: "consulting", label: "Consulting / Services" },
    ],
    allowOtherText: true,
  },
  "fix-site": {
    question: "What platform is your site on?",
    options: [
      { id: "wordpress", label: "WordPress" },
      { id: "shopify", label: "Shopify" },
      { id: "other-platform", label: "Other / Not sure" },
    ],
  },
  "grow-sales": {
    question: "What's your biggest challenge?",
    options: [
      { id: "seo", label: "Getting found on Google" },
      { id: "email", label: "Email marketing that converts" },
      { id: "both", label: "Both / Not sure" },
    ],
  },
};

export function getTotalSteps(goal: GoalId): number {
  return goal === "other" ? 2 : 4;
}

export function getRecommendation(
  goal: GoalId,
  detail?: string
): QuoteRecommendation {
  const wordpressCare = services.find((s) => s.id === "wordpress-care")!;
  const ecommerce = services.find((s) => s.id === "ecommerce")!;
  const marketing = services.find((s) => s.id === "marketing")!;
  const starterSite = services.find((s) => s.id === "starter-site")!;

  if (goal === "new-website") {
    if (detail === "sell" || detail === "both") {
      return {
        service: ecommerce,
        reason: "A new online store built for conversion",
      };
    }
    // "info" or "not-sure" → Starter Site + WordPress Care
    return {
      service: starterSite,
      reason:
        "A professional site to get you online — with ongoing care included",
    };
  }

  if (goal === "sell-online") {
    return {
      service: ecommerce,
      reason: "An e-commerce store built to sell",
    };
  }

  if (goal === "fix-site") {
    if (detail === "shopify") {
      return {
        service: ecommerce,
        reason: "Shopify store optimization and ongoing management",
      };
    }
    if (detail === "other-platform") {
      return {
        service: wordpressCare,
        reason:
          "We'll migrate your site to WordPress and keep it running smoothly",
      };
    }
    // WordPress
    return {
      service: wordpressCare,
      reason: "Expert WordPress maintenance — updates, security, and speed",
    };
  }

  if (goal === "grow-sales") {
    return {
      service: marketing,
      reason:
        detail === "seo"
          ? "SEO audit and ongoing optimization to get found on Google"
          : detail === "email"
            ? "Klaviyo email flows and campaigns that convert"
            : "SEO + email marketing to drive traffic and sales",
    };
  }

  // "other" — default to WordPress Care
  return {
    service: wordpressCare,
    reason: "Let's figure out the right plan for you",
  };
}
