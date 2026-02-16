"use client";

import Link from "next/link";
import { CardStatic } from "@/app/_components/Card";
import { services, getPrice } from "@/data/services";
import { useBilling } from "@/app/_components/BillingToggle";

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Dash = () => (
  <span className="text-muted/40">&mdash;</span>
);

type CellValue = boolean | string;

interface Row {
  feature: string;
  values: Record<string, CellValue>;
}

const serviceKeys = ["wordpress-care", "ecommerce", "marketing", "starter-site"] as const;

const rows: Row[] = [
  { feature: "Managed Hosting", values: { "wordpress-care": true, ecommerce: true, marketing: false, "starter-site": true } },
  { feature: "Security & Backups", values: { "wordpress-care": true, ecommerce: true, marketing: false, "starter-site": true } },
  { feature: "Plugin & Theme Updates", values: { "wordpress-care": true, ecommerce: true, marketing: false, "starter-site": true } },
  { feature: "E-Commerce Management", values: { "wordpress-care": false, ecommerce: true, marketing: false, "starter-site": false } },
  { feature: "SEO Optimization", values: { "wordpress-care": false, ecommerce: false, marketing: true, "starter-site": false } },
  { feature: "Email Marketing", values: { "wordpress-care": false, ecommerce: false, marketing: true, "starter-site": false } },
  { feature: "Site Build", values: { "wordpress-care": false, ecommerce: false, marketing: false, "starter-site": true } },
  { feature: "Monthly Reporting", values: { "wordpress-care": true, ecommerce: true, marketing: true, "starter-site": true } },
];

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <Check />;
  if (value === false) return <Dash />;
  return <span className="text-sm">{value}</span>;
}

function DesktopTable() {
  const { period } = useBilling();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/10">
            <th className="text-left py-3 pr-4 font-medium text-muted">Feature</th>
            {serviceKeys.map((key) => {
              const svc = services.find((s) => s.id === key)!;
              return (
                <th key={key} className="text-center py-3 px-4 font-medium">
                  <Link href={`/services/${svc.slug}`} className="text-primary hover:underline">
                    {svc.name}
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i % 2 === 0 ? "bg-background-alt/50" : ""}>
              <td className="py-3 pr-4">{row.feature}</td>
              {serviceKeys.map((key) => (
                <td key={key} className="text-center py-3 px-4">
                  <CellDisplay value={row.values[key]} />
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-foreground/10 font-medium">
            <td className="py-3 pr-4 text-muted">Starting Price</td>
            {serviceKeys.map((key) => {
              const svc = services.find((s) => s.id === key)!;
              return (
                <td key={key} className="text-center py-3 px-4 text-accent">
                  {getPrice(svc, period)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MobileCards() {
  const { period } = useBilling();

  return (
    <div className="md:hidden grid grid-cols-1 gap-4">
      {serviceKeys.map((key) => {
        const svc = services.find((s) => s.id === key)!;
        return (
          <CardStatic key={key} className="p-5 text-left">
            <h3 className="!mt-0 !mb-1 text-center">
              <Link href={`/services/${svc.slug}`} className="text-primary hover:underline">
                {svc.name}
              </Link>
            </h3>
            <p className="text-accent font-medium text-center !mt-0 !mb-4">
              {getPrice(svc, period)}
            </p>
            <ul className="space-y-2">
              {rows.map((row) => (
                <li key={row.feature} className="flex items-center gap-2 text-sm">
                  {row.values[key] ? <Check /> : <Dash />}
                  <span className={row.values[key] ? "" : "text-muted/60"}>{row.feature}</span>
                </li>
              ))}
            </ul>
          </CardStatic>
        );
      })}
    </div>
  );
}

export default function ComparisonTable() {
  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  );
}
