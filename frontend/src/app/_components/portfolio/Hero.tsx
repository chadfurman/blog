import Icon from "./Icon";
import {profile, techTicker} from "@/data/portfolio";

function TechMarquee() {
  // Duplicate the list so the -50% keyframe loops seamlessly.
  const items = [...techTicker, ...techTicker];
  return (
    <div className="absolute bottom-10 left-0 w-full overflow-hidden whitespace-nowrap opacity-20 pointer-events-none">
      <div className="inline-block animate-marquee font-mono text-xs uppercase tracking-[0.5em] text-brand">
        {items.map((tech, i) => (
          <span key={i}>{tech} • </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [title, accent] = profile.title.split("|");
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-24 overflow-hidden blueprint-grid"
    >
      <div className="absolute inset-0 neural-glow pointer-events-none" />
      <div className="max-w-4xl text-center z-10">
        <div className="inline-block px-4 py-1 border border-brand/30 bg-brand/5 rounded-full mb-4">
          <span className="font-mono text-xs text-brand uppercase tracking-widest">
            {profile.availability}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-text-vibrant mb-4">
          {title.trim()} | <span className="text-brand">{accent.trim()}</span>
        </h1>
        <p className="text-lg leading-relaxed text-on-surface-variant mb-8 max-w-2xl mx-auto">
          {profile.tagline}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="#experience"
            className="bg-primary-container text-on-primary-container px-8 py-4 font-mono text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            View Experience <Icon name="arrow_forward" className="text-base" />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border-subtle hover:border-brand/50 text-on-surface px-8 py-4 font-mono text-sm rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Icon name="code" className="text-base" /> GitHub
          </a>
        </div>
      </div>
      <TechMarquee />
    </section>
  );
}
