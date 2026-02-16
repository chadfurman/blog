import { CardStatic } from "@/app/_components/Card";

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
  wpCare: CellValue;
  ecommerce: CellValue;
  growth: CellValue;
  starterSite: CellValue;
}

const rows: Row[] = [
  { feature: "Managed Hosting", wpCare: true, ecommerce: true, growth: false, starterSite: false },
  { feature: "Security & Backups", wpCare: true, ecommerce: true, growth: false, starterSite: false },
  { feature: "Plugin & Theme Updates", wpCare: true, ecommerce: true, growth: false, starterSite: false },
  { feature: "E-Commerce Management", wpCare: false, ecommerce: true, growth: false, starterSite: false },
  { feature: "SEO Optimization", wpCare: false, ecommerce: false, growth: true, starterSite: false },
  { feature: "Email Marketing", wpCare: false, ecommerce: false, growth: true, starterSite: false },
  { feature: "Site Build", wpCare: false, ecommerce: false, growth: false, starterSite: true },
  { feature: "Monthly Reporting", wpCare: true, ecommerce: true, growth: true, starterSite: false },
];

const services = [
  { key: "wpCare" as const, name: "WordPress Care", price: "$99/mo" },
  { key: "ecommerce" as const, name: "E-Commerce", price: "$249/mo" },
  { key: "growth" as const, name: "Growth", price: "$249/mo" },
  { key: "starterSite" as const, name: "Starter Site", price: "$500" },
];

function CellDisplay({ value }: { value: CellValue }) {
  if (value === true) return <Check />;
  if (value === false) return <Dash />;
  return <span className="text-sm">{value}</span>;
}

function DesktopTable() {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/10">
            <th className="text-left py-3 pr-4 font-medium text-muted">Feature</th>
            {services.map((svc) => (
              <th key={svc.key} className="text-center py-3 px-4 font-medium">
                {svc.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i % 2 === 0 ? "bg-background-alt/50" : ""}>
              <td className="py-3 pr-4">{row.feature}</td>
              {services.map((svc) => (
                <td key={svc.key} className="text-center py-3 px-4">
                  <CellDisplay value={row[svc.key]} />
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-foreground/10 font-medium">
            <td className="py-3 pr-4 text-muted">Starting Price</td>
            {services.map((svc) => (
              <td key={svc.key} className="text-center py-3 px-4 text-accent">
                {svc.price}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MobileCards() {
  return (
    <div className="md:hidden grid grid-cols-1 gap-4">
      {services.map((svc) => (
        <CardStatic key={svc.key} className="p-5 text-left">
          <h3 className="!mt-0 !mb-1 text-center">{svc.name}</h3>
          <p className="text-accent font-medium text-center !mt-0 !mb-4">{svc.price}</p>
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.feature} className="flex items-center gap-2 text-sm">
                {row[svc.key] ? <Check /> : <Dash />}
                <span className={row[svc.key] ? "" : "text-muted/60"}>{row.feature}</span>
              </li>
            ))}
          </ul>
        </CardStatic>
      ))}
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
