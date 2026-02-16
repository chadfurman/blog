"use client";

import Link from "next/link";
import ExportedImage from "next-image-export-optimizer";
import Card from "@/app/_components/Card";
import { Service, getPrice, getSetup } from "@/data/services";
import { useBilling } from "@/app/_components/BillingToggle";

interface ServiceCardProps {
  service: Service;
  variant: "summary" | "full";
}

function SummaryCard({ service }: { service: Service }) {
  const { period } = useBilling();
  const price = getPrice(service, period);
  const setup = getSetup(service, period);

  return (
    <Link href={`/services/${service.slug}`}>
      <Card className="p-6 h-full flex flex-col justify-between">
        <div>
          {service.icon && (
            <div className="flex justify-center mb-4">
              <ExportedImage
                src={service.icon}
                alt={service.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          )}
          <h3 className="!mt-0 !mb-2">{service.name}</h3>
          <p className="text-sm text-muted">{service.tagline}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium !mb-1 text-accent">{price}</p>
          {setup && (
            <p className="text-sm text-muted !mb-2">{setup}</p>
          )}
          <p className="link-styles text-sm">Learn More &gt;&gt;</p>
        </div>
      </Card>
    </Link>
  );
}

function FullCard({ service }: { service: Service }) {
  const { period } = useBilling();
  const price = getPrice(service, period);
  const setup = getSetup(service, period);

  return (
    <Link href={`/services/${service.slug}`} className="cursor-pointer">
      <Card className="p-8 h-full flex flex-col" style={{ textAlign: "left" }}>
        {service.icon && (
          <div className="flex justify-center mb-4">
            <ExportedImage
              src={service.icon}
              alt={service.name}
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        )}
        <h3 className="!mt-0 !mb-2 text-center">{service.name}</h3>
        <p className="text-center text-muted">{service.tagline}</p>
        <div className="my-4 text-center">
          <p className="font-medium !mb-1 text-accent">{price}</p>
          {setup && (
            <p className="text-sm text-muted !mt-0">{setup}</p>
          )}
        </div>
        <ul className="list-disc pl-6 my-4 flex-1">
          {service.features.map((feature) => (
            <li key={feature} className="text-sm my-1">
              {feature}
            </li>
          ))}
        </ul>
        {service.callouts && service.callouts.length > 0 && (
          <div className="my-4 text-sm text-muted italic text-center">
            {service.callouts.map((callout) => (
              <p key={callout} className="!my-1">{callout}</p>
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <span className="link-styles">Learn More &gt;&gt;</span>
        </div>
      </Card>
    </Link>
  );
}

export default function ServiceCard({ service, variant }: ServiceCardProps) {
  if (variant === "summary") {
    return <SummaryCard service={service} />;
  }
  return <FullCard service={service} />;
}
