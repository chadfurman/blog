"use client";

import {useEffect, useState} from "react";
import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero: the four things good code
// does. It auto-cycles through the principles (lighting each box + fading in
// the sentence behind it); hovering or tapping a box pauses on it, and it
// resumes when you move away. Respects reduced-motion (no auto-cycle).
const CYCLE_MS = 3200;

export default function EngineeringCreed() {
  const [cycle, setCycle] = useState(0); // auto-advancing index
  const [held, setHeld] = useState<number | null>(null); // hovered / focused / tapped

  const active = held ?? cycle;
  const count = creed.points.length;

  // Pause the auto-cycle while the user is holding a box (hover / focus / tap).
  useEffect(() => {
    if (held !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % count), CYCLE_MS);
    return () => clearInterval(id);
  }, [held, count]);

  // Hold a box and keep the cycle in sync, so releasing resumes from here.
  const hold = (i: number) => {
    setCycle(i);
    setHeld(i);
  };
  const release = () => setHeld(null);

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
          // data-reveal lives on this static wrapper — ScrollReveal adds the
          // `reveal-in` class directly to the DOM, and if it sat on the button
          // (whose className React rewrites) React would wipe it.
          return (
            <div
              key={point.word}
              data-reveal
              style={{["--reveal-delay" as string]: `${i * 100}ms`}}
            >
              <button
                type="button"
                aria-label={`${point.word}. ${point.line}`}
                onMouseEnter={() => hold(i)}
                onMouseLeave={release}
                onFocus={() => hold(i)}
                onBlur={release}
                onClick={() => hold(i)}
                className={`w-full glass-card rounded-xl py-8 px-4 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-safe:hover:-translate-y-1 ${
                  isActive
                    ? "border-brand/60 motion-safe:-translate-y-1 shadow-[0_0_30px_-12px_rgba(123,208,255,0.55)]"
                    : "hover:border-brand/50"
                }`}
              >
                <span className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-text-vibrant">
                  {point.word}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* The principle behind the active word. Fixed min-height so the cycling
          sentence never shifts the layout. No aria-live — the auto-changes
          would spam screen readers; each button's aria-label carries its line. */}
      <div className="max-w-2xl mx-auto mt-7 min-h-[4rem] flex items-center justify-center text-center px-2">
        <p
          key={active}
          className="text-on-surface-variant leading-relaxed motion-safe:animate-[hero-rise_0.35s_ease-out]"
        >
          {creed.points[active].line}
        </p>
      </div>
    </section>
  );
}
