"use client";

import {useEffect, useRef} from "react";
import {WALK_EVENT} from "./constants";

const HEAD = ["....hhhh....", "...hhhhhh...", "...hsssshh..", "...ssssss...", "...s.ss.s...", "....ssss...."];
const BODY = ["...bbbbbb...", "..bbbbbbbb..", "..sbbbbbbs..", "..sbbbbbbs..", "...bbbbbb..."];
const LEGS = [
  ["...pppppp...", "...pp..pp...", "...pp..pp...", "...kk..kk...", "..kkk..kkk.."],
  ["...pppppp...", "....pppp....", "....pppp....", "....kkkk....", "...kkkkkk..."],
];
const COLORS: Record<string, string> = {h: "#94a3b8", s: "#f2c9a5", b: "#3b82f6", p: "#64748b", k: "#e2e8f0"};

const SCALE = 4;
const COLS = 12;
const ROWS = HEAD.length + BODY.length + LEGS[0].length;
const SPEED = 170;
const HOP_EVERY_MS = 2200;
const HOP_SHARE = 0.3;
const HOP_PX = 46;
const STEP_MS = 130;

function paint(ctx: CanvasRenderingContext2D, stride: number) {
  ctx.clearRect(0, 0, COLS * SCALE, ROWS * SCALE);
  [...HEAD, ...BODY, ...LEGS[stride]].forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (!COLORS[c]) return;
      ctx.fillStyle = COLORS[c];
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }),
  );
}

function hopHeight(elapsed: number): number {
  const phase = (elapsed % HOP_EVERY_MS) / HOP_EVERY_MS;
  return phase < HOP_SHARE ? Math.sin((phase / HOP_SHARE) * Math.PI) * HOP_PX : 0;
}

export default function Sprite() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const walk = (now: number, started: number) => {
      const elapsed = now - started;
      const x = -COLS * SCALE + (elapsed / 1000) * SPEED;
      paint(ctx, Math.floor(elapsed / STEP_MS) % 2);
      canvas.style.transform = `translate(${x}px, ${-hopHeight(elapsed) - 4}px)`;
      if (x < window.innerWidth) raf = requestAnimationFrame((t) => walk(t, started));
      else canvas.style.display = "none";
    };

    const onWalk = (e: Event) => {
      (e as CustomEvent<{handled: boolean}>).detail.handled = true;
      cancelAnimationFrame(raf);
      canvas.style.display = "block";
      raf = requestAnimationFrame((t) => walk(t, t));
    };

    window.addEventListener(WALK_EVENT, onWalk);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(WALK_EVENT, onWalk);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      width={COLS * SCALE}
      height={ROWS * SCALE}
      style={{display: "none", imageRendering: "pixelated"}}
      className="pointer-events-none fixed bottom-0 left-0 z-[90]"
    />
  );
}
