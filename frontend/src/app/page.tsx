import Link from "next/link";
import ChadImage from "../../public/chad-no-circle.png";
import ExportedImage from "next-image-export-optimizer";
import { services } from "@/data/services";
import ServiceCard from "@/app/_components/ServiceCard";
import CTASection from "@/app/_components/CTASection";
import QuoteExplorer from "@/app/_components/QuoteExplorer";
import { BillingProvider } from "@/app/_components/BillingToggle";

function Hero() {
  return (
    <div className="py-12 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <h2 className="my-2 tracking-[.1em] text-3xl md:text-4xl lg:text-7xl">
          Hi! I&apos;m Chad.
        </h2>
        <h3 className="my-2 text-highlight/90 text-xl md:text-2xl lg:text-4xl tracking-[.1em] max-w-[18ch]">
          I help small businesses grow online.
        </h3>
        <p className="leading-7 mt-4 mb-6 max-w-lg">
          E-commerce that converts. Smart email marketing. Fast, secure WordPress
          sites. I handle the tech so you can focus on your business.
        </p>
        <div>
          <Link
            href="/services"
            className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity"
          >
            See My Services
          </Link>
        </div>
      </div>
      <div className="order-1 md:order-2 flex justify-center">
        <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px]">
          <ExportedImage
            alt="Chad Furman"
            src={ChadImage}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="py-12">
      <h2 className="text-center">Find Your Plan</h2>
      <p className="text-center text-muted max-w-xl mx-auto mb-8">
        Answer a few quick questions and I&apos;ll recommend the right services
        for your business.
      </p>
      <QuoteExplorer />
    </section>
  );
}

function ServiceHighlights() {
  return (
    <section className="py-12">
      <h2 className="text-center">What I Do</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} variant="summary" />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <BillingProvider>
      <div>
        {/* Hero - white background */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <Hero />
        </div>

        {/* Quote Explorer - warm background */}
        <div className="bg-background-warm">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <QuoteSection />
          </div>
        </div>

        {/* Service Highlights - alt background */}
        <div className="bg-background-alt">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <ServiceHighlights />
          </div>
        </div>

        {/* CTA - warm background */}
        <div className="bg-background-warm">
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <CTASection
              headline="Ready to grow your business?"
              description="Let's talk about what you need — whether it's a new WordPress site, better SEO, or email marketing that actually converts."
              linkText="Contact Me"
              linkHref="/contact"
            />
          </div>
        </div>
      </div>
    </BillingProvider>
  );
}
