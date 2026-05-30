import Icon from "./Icon";
import {skillGroups, type SkillGroup} from "@/data/portfolio";

function SkillCard({group, index}: {group: SkillGroup; index: number}) {
  return (
    <div
      data-reveal
      style={{["--reveal-delay" as string]: `${index * 110}ms`}}
      className="glass-card p-8 rounded-xl hover:border-brand/50 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
        <Icon name={group.icon} className="text-2xl" />
      </div>
      <h4 className="font-display text-2xl font-semibold text-text-vibrant mb-4">{group.title}</h4>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-xs px-3 py-1 bg-surface-container rounded-full text-on-surface-variant"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsCloud() {
  return (
    <section className="py-20 px-6 bg-surface-deep border-y border-border-subtle overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16" data-reveal>
          <h2 className="font-display text-3xl font-semibold text-text-vibrant mb-2">
            Technical Proficiency
          </h2>
          <p className="text-on-surface-variant">Specialized toolkit for modern engineering leadership.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillGroups.map((group, i) => (
            <SkillCard key={group.title} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
