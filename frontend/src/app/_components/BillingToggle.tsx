"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { BillingPeriod } from "@/data/services";

const BillingContext = createContext<{
  period: BillingPeriod;
  setPeriod: (p: BillingPeriod) => void;
}>({ period: "annual", setPeriod: () => {} });

export function useBilling() {
  return useContext(BillingContext);
}

export function BillingProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<BillingPeriod>("annual");
  return (
    <BillingContext.Provider value={{ period, setPeriod }}>
      {children}
    </BillingContext.Provider>
  );
}

export default function BillingToggle() {
  const { period, setPeriod } = useBilling();

  return (
    <div className="flex items-center justify-center gap-1 bg-background-alt rounded-full p-1 w-fit mx-auto">
      <button
        onClick={() => setPeriod("monthly")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          period === "monthly"
            ? "bg-primary text-white shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setPeriod("annual")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          period === "annual"
            ? "bg-primary text-white shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        Annual
      </button>
    </div>
  );
}
