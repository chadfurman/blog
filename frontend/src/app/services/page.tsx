import { Metadata } from "next";
import { services } from "@/data/services";
import ServiceCard from "@/app/_components/ServiceCard";
import CTASection from "@/app/_components/CTASection";

export const metadata: Metadata = {
  title: "Services | Chad Furman",
  description:
    "WordPress hosting, SEO, e-commerce, and Klaviyo marketing automation services for small businesses and online stores.",
};

export default function ServicesPage() {
  return (
    <div>
      <h2 className="text-center">Services</h2>
      <p className="text-center max-w-2xl mx-auto">
        I help small businesses and online stores grow with fast, secure
        WordPress sites and smart email marketing. Every engagement starts with
        a conversation — pick the tier that fits and let&apos;s talk.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} variant="full" />
        ))}
      </div>

      <section className="my-12 text-center">
        <h3>Need a brand-new site?</h3>
        <p className="max-w-xl mx-auto">
          If you&apos;re starting from scratch or need a full redesign, I build
          custom WordPress sites tailored to your business. Reach out and
          we&apos;ll scope it together.
        </p>
      </section>

      <section className="my-12 text-center">
        <p className="text-sm opacity-70 max-w-xl mx-auto">
          All plans include a branded &quot;Built by Chad Furman&quot; footer
          credit and link. Prefer to remove it? Just ask — it&apos;s an optional
          add-on.
        </p>
      </section>

      <CTASection
        headline="Ready to get started?"
        description="Tell me about your project and I'll put together a plan that fits your goals and budget."
        linkText="Contact Me"
        linkHref="/contact"
      />
    </div>
  );
}
