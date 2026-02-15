import Link from "next/link";
import NeumorphismCard from "@/app/_components/NeumorphismContainer";
import { ServiceTier } from "@/data/services";

interface ServiceCardProps {
  service: ServiceTier;
  variant: "summary" | "full";
}

function SummaryCard({ service }: { service: ServiceTier }) {
  return (
    <Link href={`/services#${service.id}`}>
      <NeumorphismCard className="p-6 h-full flex flex-col justify-between">
        <div>
          <h3 className="!mt-0 !mb-2">{service.name}</h3>
          <p className="text-sm opacity-80">{service.tagline}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm !mb-1">
            <span className="font-medium">Setup:</span> {service.setup}
          </p>
          <p className="text-sm !mb-2">
            <span className="font-medium">Monthly:</span> {service.monthly}
          </p>
          <p className="link-styles text-sm">Learn More &gt;&gt;</p>
        </div>
      </NeumorphismCard>
    </Link>
  );
}

function FullCard({ service }: { service: ServiceTier }) {
  return (
    <NeumorphismCard id={service.id} className="p-8 text-left scroll-mt-24">
      <h3 className="!mt-0 !mb-2 text-center">{service.name}</h3>
      <p className="text-center opacity-80">{service.tagline}</p>
      <div className="grid grid-cols-2 gap-4 my-6 text-center">
        <div>
          <p className="text-sm opacity-70 !mb-1">Setup</p>
          <p className="font-medium !mt-0">{service.setup}</p>
        </div>
        <div>
          <p className="text-sm opacity-70 !mb-1">Monthly</p>
          <p className="font-medium !mt-0">{service.monthly}</p>
        </div>
      </div>
      <ul className="list-disc pl-6 my-4">
        {service.features.map((feature) => (
          <li key={feature} className="text-sm my-1">
            {feature}
          </li>
        ))}
      </ul>
      <div className="text-center mt-6">
        <Link
          href={`/contact?service=${service.id}`}
          className="link-styles"
        >
          Get Started &gt;&gt;
        </Link>
      </div>
    </NeumorphismCard>
  );
}

export default function ServiceCard({ service, variant }: ServiceCardProps) {
  if (variant === "summary") {
    return <SummaryCard service={service} />;
  }
  return <FullCard service={service} />;
}
