"use client";

import Link from "next/link";
import { Service, ServiceTier, getTierPrice, getSetup } from "@/data/services";
import { useBilling } from "@/app/_components/BillingToggle";

function TierCard({ tier, service }: { tier: ServiceTier; service: Service }) {
  const { period } = useBilling();
  const price = getTierPrice(tier, period);
  const setup = getSetup(service, period);

  return (
    <div
      className={`rounded-xl border p-6 flex flex-col ${
        tier.highlighted
          ? "border-primary bg-primary/5 ring-1 ring-primary/20 relative"
          : "border-foreground/10"
      }`}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="!mt-0 !mb-1 text-center text-lg">{tier.name}</h3>
      <p className="text-2xl font-semibold text-accent text-center !my-2">
        {price}
      </p>
      {setup && (
        <p className="text-sm text-muted text-center !mt-0 !mb-4">{setup}</p>
      )}
      <ul className="flex-1 space-y-2 my-4">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/contact?service=${service.slug}&tier=${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
        className="block text-center rounded-lg px-6 py-2.5 text-sm font-medium transition-opacity mt-2 bg-primary text-white hover:opacity-90"
      >
        Get Started
      </Link>
    </div>
  );
}

export default function PricingTiers({ service }: { service: Service }) {
  if (!service.tiers || service.tiers.length === 0) return null;

  return (
    <div
      className={`grid gap-6 ${
        service.tiers.length === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
      }`}
    >
      {service.tiers.map((tier) => (
        <TierCard key={tier.name} tier={tier} service={service} />
      ))}
    </div>
  );
}
