"use client";

import { Service, getPrice, getSetup, getSavings } from "@/data/services";
import { useBilling } from "@/app/_components/BillingToggle";

export default function ServiceDetailPricing({ service }: { service: Service }) {
  const { period } = useBilling();
  const price = getPrice(service, period);
  const setup = getSetup(service, period);
  const savings = period === "annual" ? getSavings(service) : null;

  return (
    <div className="text-center mb-6">
      <p className="text-xl font-semibold !mb-1">{price}</p>
      {setup && <p className="text-muted !mt-0 !mb-1">{setup}</p>}
      {savings && (
        <p className="text-sm text-primary font-medium !mt-0">{savings}</p>
      )}
    </div>
  );
}
