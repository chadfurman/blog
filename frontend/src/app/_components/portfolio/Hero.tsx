import Icon from "./Icon";
import DependencyGraph from "./DependencyGraph";
import CmdkHint from "./CmdkHint";
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
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-6 pt-24 overflow-hidden blueprint-grid"
    >
      <div className="aurora" />
      <DependencyGraph className="opacity-70" />
      <div className="absolute inset-0 neural-glow pointer-events-none" />
      <div className="hero-veil absolute inset-0 pointer-events-none" />
      {/* Legend so the backdrop reads as "fossabot healing dependencies", not generic particles. */}
      <div className="hidden lg:flex absolute bottom-24 left-8 z-10 flex-col gap-1.5 font-mono text-[10px] text-on-surface-variant/70 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{background: "rgb(245,165,90)"}} /> vulnerable dependency
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{background: "rgb(180,197,255)"}} /> healthy
        </div>
        <div className="flex items-center gap-2 text-brand/80">
          <span className="w-2 h-2 rounded-full animate-ping" style={{background: "rgb(123,208,255)"}} /> fossabot · auto-healing
        </div>
      </div>
      <div className="max-w-4xl text-center z-10 relative">
        <div
          className="hero-rise inline-block px-4 py-1 border border-brand/30 bg-brand/5 rounded-full mb-6"
          style={{["--rise-delay" as string]: "0ms"}}
        >
          <span className="font-mono text-xs text-brand uppercase tracking-widest">
            {profile.availability}
          </span>
        </div>
        <h1
          className="hero-rise font-display text-5xl md:text-7xl font-extrabold leading-[1.06] tracking-tight text-text-vibrant mb-5"
          style={{["--rise-delay" as string]: "90ms"}}
        >
          <span className="block pb-1">{title.trim()}</span>
          <span className="block pb-2 bg-gradient-to-r from-brand via-brand to-secondary bg-clip-text text-transparent">
            {accent.trim()}
          </span>
        </h1>
        <p
          className="hero-rise text-lg leading-relaxed text-on-surface-variant mb-9 max-w-2xl mx-auto"
          style={{["--rise-delay" as string]: "180ms"}}
        >
          {profile.tagline}
        </p>
        <div
          className="hero-rise flex flex-col md:flex-row gap-4 justify-center"
          style={{["--rise-delay" as string]: "270ms"}}
        >
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
        <CmdkHint />
      </div>
      <TechMarquee />
    </section>
  );
}
