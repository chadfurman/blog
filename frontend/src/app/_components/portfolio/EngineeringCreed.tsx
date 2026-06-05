import {creed} from "@/data/portfolio";

// A slim "engineering creed" band under the hero: the four things good code
// does. Renders as a 2x2 card grid on mobile, a 4-across row on desktop —
// avoids the awkward 3-then-1 wrap of a plain inline row.
export default function EngineeringCreed() {
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
        {creed.points.map((word, i) => (
          <div
            key={word}
            data-reveal
            style={{["--reveal-delay" as string]: `${i * 100}ms`}}
            className="glass-card rounded-xl py-8 px-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/50"
          >
            <span className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-text-vibrant">
              {word}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
