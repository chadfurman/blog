import { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { CardStatic } from "@/app/_components/Card";
import CTASection from "@/app/_components/CTASection";

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <section className="text-center my-12">
        <h1 className="!mb-2">{service.name}</h1>
        <p className="text-lg text-muted">{service.tagline}</p>
      </section>

      <section className="my-12">
        <p>{service.description}</p>
      </section>

      <CardStatic className="p-8 my-12">
        <div className="text-center mb-6">
          <p className="text-xl font-semibold !mb-1">{service.startingAt}</p>
          {service.setupFrom && (
            <p className="text-muted !mt-0">{service.setupFrom}</p>
          )}
        </div>

        <h3 className="!mt-0 !mb-4 text-center">What&apos;s Included</h3>
        <ul className="list-disc pl-6 text-left max-w-md mx-auto">
          {service.features.map((feature) => (
            <li key={feature} className="my-2">
              {feature}
            </li>
          ))}
        </ul>

        {service.callouts && service.callouts.length > 0 && (
          <div className="mt-6 text-center">
            {service.callouts.map((callout) => (
              <p key={callout} className="text-sm text-muted italic">
                {callout}
              </p>
            ))}
          </div>
        )}
      </CardStatic>

      <section className="my-12">
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

      <CTASection
        headline={`Ready to get started with ${service.name}?`}
        description="Tell me about your project and I'll put together a plan that fits your goals and budget."
        linkText="Get Started"
        linkHref={`/contact?service=${service.slug}`}
      />
    </div>
  );
}
