"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CardStatic } from "@/app/_components/Card";
import { services } from "@/data/services";

const NEEDS_LABELS: Record<string, string> = {
  "new-website": "a new website",
  "sell-online": "selling online",
  "fix-site": "fixing/improving an existing site",
  "grow-sales": "growing sales & marketing",
  "existing-site": "help with an existing site",
  "online-store": "an online store",
};

export default function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const preselectedServices = searchParams.get("services") || "";
  const preselectedNeeds = searchParams.get("needs") || "";

  const serviceIds = preselectedServices
    ? preselectedServices.split(",")
    : preselectedService
      ? [preselectedService]
      : [];
  const needIds = preselectedNeeds ? preselectedNeeds.split(",") : [];

  const quizContext =
    needIds.length > 0
      ? needIds
          .map((n) => NEEDS_LABELS[n])
          .filter(Boolean)
          .join(", ")
      : "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <CardStatic className="p-8 sm:p-12 text-center my-12">
          <h2 className="!mt-0">Thank you!</h2>
          <p>
            I&apos;ve received your message and will get back to you within 1-2
            business days.
          </p>
        </CardStatic>
        <p className="text-center text-sm text-muted mt-4 mb-12">
          Prefer email? Reach me directly at{" "}
          <a href="mailto:chad@chadfurman.com" className="link-styles">chad@chadfurman.com</a>
        </p>
      </>
    );
  }

  return (
    <>
    <CardStatic className="p-8 sm:p-12 my-12 max-w-2xl mx-auto">
      <h2 className="!mt-0 text-center">Get in Touch</h2>
      <p className="text-center text-muted">
        Fill out the form below and I&apos;ll get back to you within one business day.
      </p>

      {quizContext && (
        <p className="text-sm text-center text-muted italic mt-2">
          Based on your quiz: you&apos;re looking for {quizContext}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 text-left">
        <input
          type="hidden"
          name="access_key"
          value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""}
        />
        <input type="checkbox" name="botcheck" className="hidden" />
        <input
          type="text"
          name="b_website"
          className="!absolute !opacity-0 !h-0 !w-0 !overflow-hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <label className="block mb-4">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Service Interest</span>
          <select name="service" defaultValue={serviceIds[0] || ""}>
            <option value="">Select a service (optional)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Message</span>
          <textarea
            name="message"
            required
            placeholder="Tell me about your project, goals, and timeline..."
          />
        </label>

        <div className="text-center">
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </CardStatic>
    <p className="text-center text-sm text-muted mt-4 mb-12">
      Prefer email? Reach me directly at{" "}
      <a href="mailto:chad@chadfurman.com" className="link-styles">chad@chadfurman.com</a>
    </p>
    </>
  );
}
