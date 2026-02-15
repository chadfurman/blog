import { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/app/_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Chad Furman",
  description:
    "Get in touch to discuss WordPress hosting, SEO, e-commerce, or marketing automation for your business.",
};

export default function ContactPage() {
  return (
    <div>
      <Suspense fallback={<div className="text-center my-12">Loading...</div>}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
