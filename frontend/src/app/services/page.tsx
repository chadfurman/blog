import { Metadata } from "next";
import { services } from "@/data/services";
import ServiceCard from "@/app/_components/ServiceCard";
import CTASection from "@/app/_components/CTASection";
import TrustBar from "@/app/_components/TrustBar";
import ProcessSteps from "@/app/_components/ProcessSteps";
import ComparisonTable from "@/app/_components/ComparisonTable";
import QuoteExplorer from "@/app/_components/QuoteExplorer";
import BillingToggle, { BillingProvider } from "@/app/_components/BillingToggle";

export const metadata: Metadata = {
  title: "Services | Chad Furman",
  description:
    "WordPress hosting, e-commerce, and growth marketing services for small businesses and online stores.",
};

export default function ServicesPage() {
  return (
    <BillingProvider>
      <div>
        {/* 1. Hero */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto text-center py-16">
          <h1>The Right Plan for Your Business</h1>
          <p className="max-w-2xl mx-auto text-muted text-lg">
            WordPress hosting, e-commerce, and growth marketing &mdash; all
            managed by someone who actually picks up the phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="#services"
              className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity"
            >
              See Plans &amp; Pricing
            </a>
            <a
              href="#quiz"
              className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide border border-foreground/20 hover:border-primary/40 transition-colors"
            >
              Not Sure? Take the Quiz
            </a>
          </div>
        </section>

        {/* 2. Trust Bar */}
        <section className="border-y border-foreground/5">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <TrustBar />
          </div>
        </section>

        {/* 3. Service Overview Cards */}
        <div className="bg-background-alt">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <section id="services" className="py-12">
              <h2 className="text-center">All Services</h2>
              <div className="mt-4 mb-8">
                <BillingToggle />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} variant="full" />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 4. How I Work */}
        <div className="bg-background-warm">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
            <h2 className="text-center">How I Work</h2>
            <ProcessSteps />
          </div>
        </div>

        {/* 5. Quote Explorer */}
        <section id="quiz" className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
          <QuoteExplorer />
        </section>

        {/* 6. Compare Plans */}
        <div className="bg-background-alt">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
            <h2 className="text-center">Compare Services</h2>
            <p className="text-center text-muted max-w-lg mx-auto !mb-8">
              A quick look at what&apos;s included across each service.
            </p>
            <ComparisonTable />
          </div>
        </div>

        {/* 7. CTA */}
        <div className="bg-background-warm">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <CTASection
              headline="Ready to get started?"
              description="Tell me about your project and I'll put together a plan that fits your goals and budget."
              linkText="Contact Me"
              linkHref="/contact"
            />
          </div>
        </div>
      </div>
    </BillingProvider>
  );
}
