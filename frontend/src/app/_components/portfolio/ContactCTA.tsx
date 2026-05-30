import {profile} from "@/data/portfolio";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-20 px-6 text-center max-w-4xl mx-auto">
      <h2 className="font-display text-4xl md:text-6xl font-bold text-text-vibrant mb-4">
        Ready to scale your intelligence?
      </h2>
      <p className="text-lg text-on-surface-variant mb-8">
        I&apos;m always open to discussing new AI initiatives, infrastructure challenges, or
        engineering-management roles.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={`mailto:${profile.email}`}
          className="bg-brand text-on-primary px-10 py-4 font-mono text-sm rounded-lg hover:brightness-110 transition-all"
        >
          Get In Touch
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-border-subtle text-on-surface px-10 py-4 font-mono text-sm rounded-lg hover:bg-surface-secondary transition-all"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
