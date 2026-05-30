import Icon from "./Icon";
import {projects, type Project} from "@/data/portfolio";

function ProjectCard({project, index}: {project: Project; index: number}) {
  const span = project.feature ? "md:col-span-8" : "md:col-span-4";
  const mdOpacity = project.feature ? "md:opacity-60" : "md:opacity-40";
  return (
    <div
      data-reveal
      style={{["--reveal-delay" as string]: `${index * 110}ms`}}
      className={`${span} group relative overflow-hidden rounded-xl border border-border-subtle bg-surface-primary`}
    >
      {/* Image: banner on mobile (normal flow), full-bleed backdrop on md+. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative cover from /public, not content */}
      <img
        src={project.image}
        alt={project.imageAlt}
        className={`w-full h-48 object-cover opacity-80 ${mdOpacity} md:absolute md:inset-0 md:h-full group-hover:scale-105 transition-transform duration-700`}
      />
      {/* Gradient overlay only when the image is a backdrop. */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/60 to-transparent" />
      <div className="relative p-6 md:p-8 flex flex-col justify-end gap-3 md:min-h-96">
        <div className="flex flex-wrap items-center gap-2">
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
        <h3 className="font-display text-2xl font-semibold text-text-vibrant">{project.title}</h3>
        <p className="text-on-surface-variant max-w-2xl text-base leading-relaxed">{project.blurb}</p>
        <button className="flex items-center gap-2 font-mono text-sm text-brand w-fit group/link mt-1">
          {project.cta}
          <Icon name="north_east" className="text-base group-hover/link:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectSpotlight() {
  return (
    <section id="projects" className="py-20 px-6 max-w-screen-xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
        <div>
          <h2 className="font-display text-3xl font-semibold text-text-vibrant mb-2">Project Spotlight</h2>
          <p className="text-on-surface-variant">
            Architecting solutions at the intersection of AI and infrastructure.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
