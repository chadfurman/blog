"use client";

import {useState} from "react";
import {experience, earlierRoles, education, type Experience} from "@/data/portfolio";

function CompactList({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <h3 className="font-mono text-sm uppercase tracking-widest text-brand mb-6">{label}</h3>
      <ul className="space-y-6">{children}</ul>
    </div>
  );
}

function CompactRow({
  title,
  meta,
  period,
  detail,
}: {
  title: string;
  meta: string;
  period: string;
  detail?: string;
}) {
  return (
    <li className="border-l border-border-subtle pl-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-lg font-semibold text-text-vibrant">{title}</span>
        <span className="font-mono text-xs text-on-surface-variant whitespace-nowrap">{period}</span>
      </div>
      <p className="font-mono text-xs text-secondary mb-1">{meta}</p>
      {detail && <p className="text-on-surface-variant text-sm leading-relaxed">{detail}</p>}
    </li>
  );
}

function Tag({label}: {label: string}) {
  return (
    <span className="bg-surface-secondary text-brand px-2 py-1 rounded text-xs font-mono">
      {label}
    </span>
  );
}

function TimelineItem({item, side, index}: {item: Experience; side: "left" | "right"; index: number}) {
  const [open, setOpen] = useState(false);
  const rowDir = side === "left" ? "md:flex-row" : "md:flex-row-reverse";
  const dateAlign = side === "left" ? "text-right pr-12 items-end" : "text-left pl-12 items-start";
  const year = item.period.match(/\d{4}/)?.[0];
  return (
    <div
      className={`relative flex flex-col ${rowDir} items-center justify-between group`}
      data-reveal
      style={{["--reveal-delay" as string]: `${index * 90}ms`}}
    >
      <div className={`hidden md:flex flex-col w-[45%] ${dateAlign}`}>
        <span className="timeline-year font-display font-extrabold text-7xl mb-2">{year}</span>
        <span className={`font-mono text-sm ${item.current ? "text-brand" : "text-on-surface-variant"}`}>
          {item.period}
        </span>
      </div>
      <div
        className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-surface z-10 transition-all duration-500 ${
          item.current
            ? "border-2 border-brand group-hover:shadow-[0_0_15px_rgba(37,99,235,0.8)]"
            : "border-2 border-border-subtle group-hover:border-brand"
        }`}
      />
      <div className="w-full md:w-[45%] glass-card p-8 rounded-xl transition-all group-hover:-translate-y-1">
        <span className="md:hidden font-mono text-xs text-brand mb-2 block">{item.period}</span>
        <h3 className="font-display text-2xl font-semibold text-text-vibrant mb-1">{item.role}</h3>
        <p className="font-mono text-xs text-secondary mb-4">
          {item.company} | {item.tags[0]}
        </p>
        <p className="text-on-surface-variant text-base leading-relaxed mb-4">{item.detail}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        {item.deepDive && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="font-mono text-xs text-on-surface-variant hover:text-brand transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded"
            >
              {open ? "Hide details" : "More details"}
              <span aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>↓</span>
            </button>
            {open && (
              <div className="mt-3 space-y-3 motion-safe:animate-[hero-rise_0.3s_ease-out]">
                {item.deepDive.tech && (
                  <div className="flex flex-wrap gap-2">
                    {item.deepDive.tech.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                )}
                {item.deepDive.notes && (
                  <ul className="space-y-1.5">
                    {item.deepDive.notes.map((note, idx) => (
                      <li key={idx} className="text-on-surface-variant text-sm leading-relaxed flex gap-2">
                        <span aria-hidden="true" className="text-brand select-none">›</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section
      id="experience"
      className="py-20 px-6 max-w-screen-xl mx-auto border-t border-border-subtle relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mb-16" data-reveal>
        <h2 className="font-display text-3xl font-semibold text-text-vibrant mb-2 flex items-center gap-4">
          <span className="w-12 h-px bg-brand" /> Career Trajectory
        </h2>
        <p className="text-on-surface-variant max-w-xl">
          A timeline of leading engineering excellence, from high-scale SaaS to award-winning
          broadcast technology.
        </p>
      </div>
      <div className="relative pl-8 md:pl-0">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px timeline-line" />
        <div className="space-y-16">
          {experience.map((item, i) => (
            <TimelineItem key={item.company} item={item} side={i % 2 === 0 ? "left" : "right"} index={i} />
          ))}
        </div>
      </div>
      <div
        className="mt-20 pt-12 border-t border-border-subtle grid md:grid-cols-2 gap-x-12 gap-y-12"
        data-reveal
      >
        <CompactList label="Earlier">
          {earlierRoles.map((r) => (
            <CompactRow key={r.company} title={r.role} meta={r.company} period={r.period} detail={r.detail} />
          ))}
        </CompactList>
        <CompactList label="Education">
          {education.map((e) => (
            <CompactRow key={e.school} title={e.school} meta={e.degree} period={e.period} />
          ))}
        </CompactList>
      </div>
    </section>
  );
}
