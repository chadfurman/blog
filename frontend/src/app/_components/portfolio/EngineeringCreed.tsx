"use client";

import {useEffect, useRef, useState} from "react";
import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero. The active card "breathes" —
// glow eases up for a half-breath, back down for another — then the next card
// takes over. All movement rides the .creed-card CSS transition (no keyframes),
// so interrupting it anywhere (fast mouse passes included) eases from the
// current glow instead of cancelling an animation. Hover/focus/tap holds the
// glow on a card; releasing resumes the loop. Reduced motion: no auto-loop.
type Phase = "in" | "out" | "held";

const HALF_BREATH_MS = 2500;

export default function EngineeringCreed() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");
  const [autoLoop, setAutoLoop] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = creed.points.length;

  useEffect(() => {
    setAutoLoop(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const clearTap = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = null;
  };
  useEffect(() => clearTap, []);

  const release = () => setPhase((p) => (p === "held" ? "out" : p));

  useEffect(() => {
    if (!autoLoop || phase === "held") return;
    const t = setTimeout(() => {
      if (phase === "in") {
        setPhase("out");
      } else {
        setActive((a) => (a + 1) % count);
        setPhase("in");
      }
    }, HALF_BREATH_MS);
    return () => clearTimeout(t);
  }, [autoLoop, phase, active, count]);

  const holdOn = (i: number) => {
    clearTap();
    setActive(i);
    setPhase("held");
  };
  // Tap (touch): glow up, hold a few seconds, then fade down — touch has no
  // reliable "leave", so a timer starts the release.
  const tap = (i: number) => {
    holdOn(i);
    tapTimer.current = setTimeout(release, 4000);
  };

  return (
    <section
      aria-label="Code that ships, scales, works, and lasts"
      className="py-16 px-6 max-w-screen-xl mx-auto border-t border-border-subtle"
    >
      <p
        className="text-center font-mono text-xs uppercase tracking-[0.4em] text-brand mb-8"
        data-reveal
      >
        {creed.label}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {creed.points.map((point, i) => {
          const isActive = active === i;
          const glow =
            isActive && (phase === "held" || (autoLoop && phase === "in"))
              ? "creed-glow"
              : "";
          // data-reveal lives on the static wrapper so React's className
          // rewrites on the button don't wipe ScrollReveal's reveal-in class.
          return (
            <div
              key={point.word}
              data-reveal
              style={{["--reveal-delay" as string]: `${i * 100}ms`}}
            >
              <button
                type="button"
                aria-label={`${point.word}. ${point.line}`}
                onMouseEnter={() => holdOn(i)}
                onMouseLeave={release}
                onFocus={() => holdOn(i)}
                onBlur={release}
                onClick={() => tap(i)}
                className={`creed-card w-full glass-card rounded-xl py-8 px-4 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive ? "border-brand/60" : "hover:border-brand/50"
                } ${glow}`}
              >
                <span className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-text-vibrant">
                  {point.word}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* The principle behind the active card. Fixed min-height so the changing
          sentence never shifts the layout. No aria-live — the auto-changes
          would spam screen readers; each button's aria-label carries its line. */}
      <div className="max-w-2xl mx-auto mt-7 min-h-[4rem] flex items-center justify-center text-center px-2">
        <p
          key={active}
          className="text-on-surface-variant leading-relaxed motion-safe:animate-[hero-rise_0.5s_ease-out]"
        >
          {creed.points[active].line}
        </p>
      </div>
    </section>
  );
}
