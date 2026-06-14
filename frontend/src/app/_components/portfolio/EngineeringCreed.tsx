"use client";

import {useState} from "react";
import Icon from "./Icon";
import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero: the four things good code
// does. Hovering (or focusing) a box reveals the principle behind the word;
// clicking pins it so it stays after the cursor leaves — click again to unpin.
export default function EngineeringCreed() {
  const [pinned, setPinned] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Hover previews; a pin persists when nothing is hovered. (?? so index 0 works.)
  const active = hovered ?? pinned;

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
          const isPinned = pinned === i;
          const isActive = active === i;
          // data-reveal lives on this static wrapper — ScrollReveal adds the
          // `reveal-in` class directly to the DOM, and if it sat on the button
          // (whose className React rewrites on hover/pin) React would wipe it.
          return (
            <div
              key={point.word}
              data-reveal
              style={{["--reveal-delay" as string]: `${i * 100}ms`}}
            >
              <button
                type="button"
                aria-pressed={isPinned}
                aria-label={`${point.word}. ${point.line}${isPinned ? " (pinned)" : ""}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                onClick={() => setPinned(isPinned ? null : i)}
                className={`relative w-full glass-card rounded-xl py-8 px-4 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-safe:hover:-translate-y-1 ${
                  isActive
                    ? "border-brand/60 motion-safe:-translate-y-1 shadow-[0_0_30px_-12px_rgba(123,208,255,0.55)]"
                    : "hover:border-brand/50"
                } ${isPinned ? "ring-1 ring-brand/40" : ""}`}
              >
                <span className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-text-vibrant">
                  {point.word}
                </span>
                {isPinned && (
                  <Icon
                    name="push_pin"
                    className="absolute top-2.5 right-2.5 text-sm text-brand"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reveal area — the principle behind the active word. Fixed min-height
          so pinning/unpinning doesn't shift the layout. */}
      <div
        className="max-w-2xl mx-auto mt-7 min-h-[4rem] flex items-center justify-center text-center px-2"
        aria-live="polite"
      >
        {active !== null ? (
          <p
            key={active}
            className="text-on-surface-variant leading-relaxed motion-safe:animate-[hero-rise_0.35s_ease-out]"
          >
            {creed.points[active].line}
          </p>
        ) : (
          <p className="font-mono text-xs text-on-surface-variant/40">
            Hover a principle — click to pin it.
          </p>
        )}
      </div>
    </section>
  );
}
