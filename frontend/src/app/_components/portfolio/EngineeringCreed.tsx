import {Fragment} from "react";
import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero: the four things good work
// optimizes for. Each word scroll-reveals with a slight stagger.
export default function EngineeringCreed() {
  const lastIndex = creed.points.length - 1;
  return (
    <section
      aria-label="What I optimize for"
      className="py-16 px-6 max-w-screen-xl mx-auto border-t border-border-subtle"
    >
      <p
        className="text-center font-mono text-xs uppercase tracking-[0.4em] text-brand mb-8"
        data-reveal
      >
        {creed.label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-9">
        {creed.points.map((word, i) => (
          <Fragment key={word}>
            <span
              className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-text-vibrant transition-colors duration-300 hover:text-brand"
              data-reveal
              style={{["--reveal-delay" as string]: `${i * 110}ms`}}
            >
              {word}
            </span>
            {i < lastIndex && (
              <span aria-hidden className="hidden md:inline select-none text-3xl text-brand/50">
                ·
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
