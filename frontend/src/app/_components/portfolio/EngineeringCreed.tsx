"use client";

import {useEffect, useRef, useState} from "react";
import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero. The active card "breathes" —
// its glow swells in and out — and when the breath ends the next card takes
// over, so the loop reads as something gently alive. Hovering/focusing/tapping
// a card holds a steady glow on it; releasing (or, on touch, a few seconds
// later) resumes the loop. Respects reduced-motion (no auto-advance).
type Phase = "breathing" | "held" | "releasing";

export default function EngineeringCreed() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("breathing");
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = creed.points.length;

  const clearRelease = () => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current);
    releaseTimer.current = null;
  };
  useEffect(() => clearRelease, []);

  // Begin releasing only from a held card, so the glow fades DOWN from full
  // rather than snapping off and restarting.
  const release = () => setPhase((p) => (p === "held" ? "releasing" : p));

  const holdOn = (i: number) => {
    clearRelease();
    setActive(i);
    setPhase("held");
  };
  // Tap (touch): glow up, hold a few seconds, then fade down — touch has no
  // reliable "leave", so a timer starts the release.
  const tap = (i: number) => {
    clearRelease();
    setActive(i);
    setPhase("held");
    releaseTimer.current = setTimeout(release, 4000);
  };

  // A breath (in-and-out) or a release (fade-out) finished — advance the loop.
  const onAnimEnd = (e: React.AnimationEvent) => {
    if (e.animationName !== "creed-breathe" && e.animationName !== "creed-breathe-out") {
      return;
    }
    setActive((a) => (a + 1) % count);
    setPhase("breathing");
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
          const glow = !isActive
            ? ""
            : phase === "held"
              ? "creed-held"
              : phase === "releasing"
                ? "creed-breathe-out"
                : "creed-breathe";
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
                onAnimationEnd={onAnimEnd}
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
