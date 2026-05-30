import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";

import {projects, profile, type CaseStudySection} from "@/data/portfolio";
import SiteFooter from "@/app/_components/portfolio/SiteFooter";
import ScrollReveal from "@/app/_components/portfolio/ScrollReveal";
import Icon from "@/app/_components/portfolio/Icon";

type PageProps = {params: Promise<{slug: string}>};

export function generateStaticParams() {
  return projects.map((p) => ({slug: p.slug}));
}

export const dynamicParams = false;

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {title: "Case Study | Chad Furman"};
  return {
    title: `${project.title} | Chad Furman`,
    description: project.caseStudy.tagline,
  };
}

function Section({section}: {section: CaseStudySection}) {
  return (
    <section className="mb-12" data-reveal>
      <h2 className="font-display text-2xl font-semibold text-text-vibrant mb-4 flex items-center gap-3">
        <span className="w-8 h-px bg-brand" /> {section.heading}
      </h2>
      {section.body && (
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-3xl">{section.body}</p>
      )}
      {section.bullets && (
        <ul className="space-y-3 max-w-3xl">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-on-surface-variant text-lg leading-relaxed">
              <span className="text-brand mt-1 shrink-0">▹</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function CaseStudyPage({params}: PageProps) {
  const {slug} = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const cs = project.caseStudy;

  return (
    <div className="portfolio min-h-screen">
      <noscript>
        <style>{`.portfolio [data-reveal]{opacity:1;transform:none;}`}</style>
      </noscript>

      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-border-subtle">
        <nav className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
          <Link href="/" className="font-display text-2xl font-bold text-brand tracking-tight">
            {profile.name}
          </Link>
          <Link
            href="/#projects"
            className="font-mono text-sm text-on-surface-variant hover:text-brand transition-colors flex items-center gap-2"
          >
            <span className="rotate-180 inline-flex">
              <Icon name="arrow_forward" className="text-base" />
            </span>
            All Projects
          </Link>
        </nav>
      </header>

      <main className="relative max-w-screen-xl mx-auto px-6 pt-32 pb-12">
        {/* Hero */}
        <div className="max-w-3xl mb-16" data-reveal>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag.label}
                className={`px-3 py-1 rounded-full font-mono text-xs ${
                  tag.tone === "primary" ? "bg-brand/20 text-brand" : "bg-secondary/20 text-secondary"
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.06] tracking-tight text-text-vibrant mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-on-surface-variant mb-4 leading-relaxed">{cs.tagline}</p>
          <p className="font-mono text-sm text-secondary">{cs.role}</p>
        </div>

        {/* Sections */}
        {cs.sections.map((section) => (
          <Section key={section.heading} section={section} />
        ))}

        {/* Tech */}
        <section className="mt-4" data-reveal>
          <h2 className="font-display text-2xl font-semibold text-text-vibrant mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-brand" /> Tech
          </h2>
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {cs.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1 bg-surface-container rounded-full text-on-surface-variant"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-16" data-reveal>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 border border-border-subtle hover:border-brand/50 text-on-surface px-6 py-3 font-mono text-sm rounded-lg transition-all"
          >
            <span className="rotate-180 inline-flex">
              <Icon name="arrow_forward" className="text-base" />
            </span>
            Back to all projects
          </Link>
        </div>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
