"use client";

import {useEffect, useRef} from "react";

// Animated "agentic dependency graph" hero backdrop:
// nodes = packages, edges = the dependency tree, and a fossabot agent pulse
// walks the graph healing vulnerable (amber) nodes back to healthy (periwinkle).
// Your cursor is a second healing agent: nodes drift toward it, heal on contact,
// and tether to it with lines; a click sends out a shockwave that heals and
// scatters whatever it crosses.
// Performance: capped nodes, single rAF loop, DPR-scaled, paused when hidden.
// Accessibility: respects prefers-reduced-motion (static frame, no loop).

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vulnerable: boolean;
  healing: boolean; // true while the cyan "just healed" flash plays
  healT: number; // 0..1 progress of that flash
};

type Ripple = {x: number; y: number; age: number};

export type Sim = {
  ripples: Ripple[];
  nodes: Node[];
  edges: [number, number][];
  neighbors: number[][];
  agentAt: number;
  agentTo: number;
  agentT: number;
  sinceInfect: number;
  w: number;
  h: number;
};

const HEALTHY = "180, 197, 255"; // brand periwinkle
const VULN = "245, 165, 90"; // amber
const AGENT = "123, 208, 255"; // cyan
const EDGE_DIM = "rgba(51, 65, 85, 0.22)";
const REACH = 190; // cursor influence radius, px
const HEAL_RADIUS = 60; // vulnerable nodes this close to the cursor get healed
const RIPPLE_MS = 800;
const RIPPLE_REACH = 280;

function nearestNeighbors(nodes: Node[], i: number, k: number): number[] {
  return nodes
    .map((n, j) => ({j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2}))
    .filter((o) => o.j !== i)
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((o) => o.j);
}

export function buildSim(w: number, h: number): Sim {
  const count = Math.max(18, Math.min(52, Math.round((w * h) / 26000)));
  const nodes: Node[] = Array.from({length: count}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.06,
    vy: (Math.random() - 0.5) * 0.06,
    r: 1.6 + Math.random() * 2.2,
    vulnerable: Math.random() < 0.16,
    healing: false,
    healT: 0,
  }));
  const neighbors = nodes.map((_, i) => nearestNeighbors(nodes, i, 2 + (i % 2)));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  neighbors.forEach((ns, i) =>
    ns.forEach((j) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }),
  );
  return {ripples: [], nodes, edges, neighbors, agentAt: 0, agentTo: neighbors[0][0], agentT: 0, sinceInfect: 0, w, h};
}

export function stepAgent(sim: Sim, dt: number) {
  sim.agentT += dt * 0.0011;
  if (sim.agentT < 1) return;
  sim.agentT = 0;
  sim.agentAt = sim.agentTo;
  const here = sim.nodes[sim.agentAt];
  if (here.vulnerable) {
    here.vulnerable = false;
    here.healing = true;
    here.healT = 0;
  }
  const ns = sim.neighbors[sim.agentAt];
  const sick = ns.find((j) => sim.nodes[j].vulnerable);
  sim.agentTo = sick ?? ns[Math.floor(Math.random() * ns.length)];
}

export function step(sim: Sim, dt: number, mx: number, my: number) {
  for (const n of sim.nodes) {
    n.x += n.vx * dt;
    n.y += n.vy * dt;
    if (n.x < 0 || n.x > sim.w) n.vx *= -1;
    if (n.y < 0 || n.y > sim.h) n.vy *= -1;
    if (mx >= 0) {
      const dx = n.x - mx;
      const dy = n.y - my;
      const d = Math.hypot(dx, dy);
      if (d < REACH && d > 1) {
        // Gravity well: pulled in from afar, pushed off the very center so
        // nodes ring the cursor instead of stacking under it.
        const pull = d > 55 ? -0.035 * (1 - d / REACH) : 0.05 * (1 - d / 55);
        n.x += (dx / d) * pull * dt;
        n.y += (dy / d) * pull * dt;
        if (d < HEAL_RADIUS && n.vulnerable) {
          n.vulnerable = false;
          n.healing = true;
          n.healT = 0;
        }
      }
    }
    for (const r of sim.ripples) {
      const dx = n.x - r.x;
      const dy = n.y - r.y;
      const d = Math.hypot(dx, dy) || 1;
      const front = (r.age / RIPPLE_MS) * RIPPLE_REACH;
      if (Math.abs(d - front) < 26) {
        n.x += (dx / d) * 0.9;
        n.y += (dy / d) * 0.9;
        if (n.vulnerable) {
          n.vulnerable = false;
          n.healing = true;
          n.healT = 0;
        }
      }
    }
    if (n.healing) {
      n.healT += dt * 0.0016;
      if (n.healT >= 1) {
        n.healing = false; // back to healthy; re-infectable later (infection is throttled)
        n.healT = 0;
      }
    }
  }
  for (const r of sim.ripples) r.age += dt;
  sim.ripples = sim.ripples.filter((r) => r.age < RIPPLE_MS);
  sim.sinceInfect += dt;
  if (sim.sinceInfect > 2600) {
    sim.sinceInfect = 0;
    const idle = sim.nodes.filter((n) => !n.vulnerable && !n.healing);
    if (idle.length) idle[Math.floor(Math.random() * idle.length)].vulnerable = true;
  }
  stepAgent(sim, dt);
}

// 0..1: how close a point is to the cursor (0 outside REACH or with no cursor).
function nearness(x: number, y: number, mx: number, my: number): number {
  if (mx < 0) return 0;
  return Math.max(0, 1 - Math.hypot(x - mx, y - my) / REACH);
}

function draw(ctx: CanvasRenderingContext2D, sim: Sim, t: number, mx = -1, my = -1) {
  ctx.clearRect(0, 0, sim.w, sim.h);
  if (mx >= 0) {
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, REACH);
    halo.addColorStop(0, `rgba(${AGENT}, 0.3)`);
    halo.addColorStop(1, `rgba(${AGENT}, 0)`);
    ctx.fillStyle = halo;
    ctx.fillRect(mx - REACH, my - REACH, REACH * 2, REACH * 2);
  }
  ctx.lineWidth = 1;
  for (const [a, b] of sim.edges) {
    const lit = a === sim.agentAt || b === sim.agentAt || a === sim.agentTo || b === sim.agentTo;
    const na = sim.nodes[a];
    const nb = sim.nodes[b];
    const near = Math.max(nearness(na.x, na.y, mx, my), nearness(nb.x, nb.y, mx, my));
    ctx.strokeStyle = lit || near > 0 ? `rgba(123, 208, 255, ${lit ? 0.5 : 0.15 + near * 0.65})` : EDGE_DIM;
    ctx.beginPath();
    ctx.moveTo(sim.nodes[a].x, sim.nodes[a].y);
    ctx.lineTo(sim.nodes[b].x, sim.nodes[b].y);
    ctx.stroke();
  }
  for (const n of sim.nodes) {
    const pulse = n.vulnerable ? 0.5 + 0.5 * Math.sin(t * 0.005) : 1;
    let color = HEALTHY;
    let alpha = 0.55;
    if (n.vulnerable) {
      color = VULN;
      alpha = 0.5 + 0.4 * pulse;
    } else if (n.healing) {
      color = AGENT;
      alpha = 0.85 - n.healT * 0.3;
    }
    const near = nearness(n.x, n.y, mx, my);
    ctx.fillStyle = `rgba(${color}, ${Math.min(1, alpha + near * 0.5)})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + (n.vulnerable ? pulse : 0) + near * 1.6, 0, Math.PI * 2);
    ctx.fill();
    if (near > 0.15) {
      ctx.strokeStyle = `rgba(${AGENT}, ${near * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }
  }
  for (const r of sim.ripples) {
    const k = r.age / RIPPLE_MS;
    ctx.strokeStyle = `rgba(${AGENT}, ${0.9 * (1 - k)})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(r.x, r.y, k * RIPPLE_REACH, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  const from = sim.nodes[sim.agentAt];
  const to = sim.nodes[sim.agentTo];
  const ax = from.x + (to.x - from.x) * sim.agentT;
  const ay = from.y + (to.y - from.y) * sim.agentT;
  const glow = ctx.createRadialGradient(ax, ay, 0, ax, ay, 14);
  glow.addColorStop(0, `rgba(${AGENT}, 0.9)`);
  glow.addColorStop(1, `rgba(${AGENT}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(ax, ay, 14, 0, Math.PI * 2);
  ctx.fill();
}

// Wire a canvas to the simulation. Returns a cleanup function.
function mountGraph(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  if (!ctx || !parent) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = {x: -1, y: -1};
  let sim = buildSim(parent.clientWidth, parent.clientHeight);

  const resize = () => {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sim = buildSim(w, h);
  };
  resize();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    draw(ctx, sim, 0);
    return () => {};
  }

  const onMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  const onLeave = () => {
    mouse.x = -1;
    mouse.y = -1;
  };
  let touchTimer: ReturnType<typeof setTimeout> | undefined;
  const onDown = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    // Touch has no hover: a tap also places the cursor so it lights up there.
    if (e.pointerType === "touch") {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      clearTimeout(touchTimer);
      touchTimer = setTimeout(onLeave, 1500);
    }
    sim.ripples.push({x: e.clientX - rect.left, y: e.clientY - rect.top, age: 0});
  };
  const ro = new ResizeObserver(resize);
  ro.observe(parent);
  parent.addEventListener("mousemove", onMove);
  parent.addEventListener("mouseleave", onLeave);
  parent.addEventListener("pointerdown", onDown);

  let raf = 0;
  let prev = 0;
  const frame = (now: number) => {
    const dt = Math.min(48, prev ? now - prev : 16);
    prev = now;
    step(sim, dt, mouse.x, mouse.y);
    draw(ctx, sim, now, mouse.x, mouse.y);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  const onVisibility = () => {
    cancelAnimationFrame(raf); // guard against stacking rAF chains
    if (!document.hidden) {
      prev = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(touchTimer);
    ro.disconnect();
    parent.removeEventListener("mousemove", onMove);
    parent.removeEventListener("mouseleave", onLeave);
    parent.removeEventListener("pointerdown", onDown);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

export default function DependencyGraph({className = ""}: {className?: string}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountGraph(ref.current);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 pointer-events-none ${className}`} />;
}
