"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import NeumorphismCard from "@/app/_components/NeumorphismContainer";
import { services } from "@/data/services";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") || "";

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
      <NeumorphismCard className="p-8 sm:p-12 text-center my-12">
        <h2 className="!mt-0">Thank you!</h2>
        <p>
          I&apos;ve received your message and will get back to you within 1-2
          business days.
        </p>
      </NeumorphismCard>
    );
  }

  return (
    <NeumorphismCard className="p-8 sm:p-12 my-12 max-w-2xl mx-auto">
      <h2 className="!mt-0 text-center">Get in Touch</h2>
      <p className="text-center">
        Tell me about your project and I&apos;ll follow up with a plan.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 text-left">
        <input
          type="hidden"
          name="access_key"
          value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""}
        />
        {/* Web3Forms bot check */}
        <input type="checkbox" name="botcheck" className="hidden" />
        {/* Honeypot — hidden from humans, bots fill it and get rejected */}
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
          <select name="service" defaultValue={preselected}>
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
    </NeumorphismCard>
  );
}
