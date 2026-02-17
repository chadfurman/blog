import { Metadata } from "next";
import { notFound } from "next/navigation";
import ExportedImage from "next-image-export-optimizer";
import { services } from "@/data/services";
import { getServiceDetail } from "@/data/serviceDetails";
import { CardStatic } from "@/app/_components/Card";
import CTASection from "@/app/_components/CTASection";
import ServiceProcessSteps from "@/app/_components/ServiceProcessSteps";
import BillingToggle, { BillingProvider } from "@/app/_components/BillingToggle";
import ServiceDetailPricing from "@/app/_components/ServiceDetailPricing";
import PricingTiers from "@/app/_components/PricingTiers";

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} | Chad Furman`,
    description: service.tagline,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const detail = getServiceDetail(slug);

  return (
    <BillingProvider>
      <div>
        {/* 1. Hero */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto text-center py-16">
          {service.icon && (
            <div className="flex justify-center mb-6">
              <ExportedImage
                src={service.icon}
                alt={service.name}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          )}
          <h1 className="!mb-2">{service.name}</h1>
          <p className="text-lg text-muted !mt-0">{service.tagline}</p>
          <p className="max-w-2xl mx-auto">
            {detail?.heroDescription || service.description}
          </p>
          <a
            href={`/contact?service=${service.slug}`}
            className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity mt-4"
          >
            Get Started
          </a>
        </section>

        {/* 2. Trust Stats */}
        {detail?.trustStats && (
          <section className="border-y border-foreground/5">
            <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-foreground/10 py-8">
                {detail.trustStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center px-4">
                    <span className="text-lg font-semibold text-highlight">{stat.value}</span>
                    <span className="text-sm text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. Pricing */}
        <div className="bg-background-alt">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
            <h2 className="text-center">Pricing</h2>
            <div className="mt-4 mb-8">
              <BillingToggle />
            </div>

            {service.tiers && service.tiers.length > 0 ? (
              <PricingTiers service={service} />
            ) : (
              <div className="max-w-md mx-auto">
                <CardStatic className="p-8">
                  <ServiceDetailPricing service={service} />
                </CardStatic>
              </div>
            )}

            {service.callouts && service.callouts.length > 0 && (
              <div className="mt-6 text-center">
                {service.callouts.map((callout) => (
                  <p key={callout} className="text-sm text-muted italic">
                    {callout}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. What's Included (shared features) */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-12">
          <h2 className="text-center">
            {service.tiers && service.tiers.length > 0
              ? "What\u2019s Included in Every Plan"
              : "What\u2019s Included"}
          </h2>
          <ul className="list-disc pl-6 text-left max-w-md mx-auto mt-6">
            {service.features.map((feature) => (
              <li key={feature} className="my-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* 4. How It Works */}
        {detail?.processSteps && detail.processSteps.length > 0 && (
          <div className="bg-background-warm">
            <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
              <h2 className="text-center">How It Works</h2>
              <ServiceProcessSteps steps={detail.processSteps} />
            </div>
          </div>
        )}

        {/* 5. FAQ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-12">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto mt-6 space-y-2">
            {service.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-primary/10 overflow-hidden"
              >
                <summary className="cursor-pointer p-4 font-medium hover:bg-primary/5 transition-colors list-none flex justify-between items-center">
                  <span>{item.q}</span>
                  <span className="text-muted ml-4 transition-transform group-open:rotate-45 text-lg">
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted !mt-0">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 6. CTA */}
        <div className="bg-background-warm">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <CTASection
              headline={`Ready to get started with ${service.name}?`}
              description="Tell me about your project and I'll put together a plan that fits your goals and budget."
              linkText="Get Started"
              linkHref={`/contact?service=${service.slug}`}
            />
          </div>
        </div>
      </div>
    </BillingProvider>
  );
}
