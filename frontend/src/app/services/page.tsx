import { Metadata } from "next";
import { services } from "@/data/services";
import ServiceCard from "@/app/_components/ServiceCard";
import CTASection from "@/app/_components/CTASection";
import { CardStatic } from "@/app/_components/Card";

export const metadata: Metadata = {
  title: "Services | Chad Furman",
  description:
    "WordPress hosting, e-commerce, and growth marketing services for small businesses and online stores.",
};

export default function ServicesPage() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <section className="text-center my-12">
          <h1>Services</h1>
          <p className="max-w-2xl mx-auto text-muted">
            I help small businesses and online stores grow with fast, secure
            WordPress sites, e-commerce that converts, and marketing that drives
            real results. Every engagement starts with a conversation.
          </p>
        </section>

        <section className="my-12 text-center">
          <p className="text-muted max-w-lg mx-auto">
            Not sure which service is right?{" "}
            <a href="/contact" className="link-styles">Contact me</a>{" "}
            and I&apos;ll help you figure it out.
          </p>
        </section>
      </div>

      <div className="bg-background-alt">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <section className="py-12">
            <h2 className="text-center">All Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} variant="full" />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <CardStatic className="p-6">
            <h3 className="!mt-0 !mb-2">Need a new site?</h3>
            <p className="text-sm text-muted">
              Starter WordPress sites from $300 when paired with a care plan.
              Custom designs and complex builds scoped individually.
            </p>
          </CardStatic>
          <CardStatic className="p-6">
            <h3 className="!mt-0 !mb-2">Shopify?</h3>
            <p className="text-sm text-muted">
              Shopify setup and customization options available. Let&apos;s talk
              about what works best for your store.
            </p>
          </CardStatic>
        </section>
      </div>

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
  );
}
