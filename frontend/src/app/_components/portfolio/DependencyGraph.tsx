"use client";

import {useEffect, useRef} from "react";

// Animated "agentic dependency graph" hero backdrop:
// nodes = packages, edges = the dependency tree, and a fossabot agent pulse
// walks the graph healing vulnerable (amber) nodes back to healthy (periwinkle).
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

export type Sim = {
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
const EDGE_LIT = "rgba(123, 208, 255, 0.5)";

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
  return {nodes, edges, neighbors, agentAt: 0, agentTo: neighbors[0][0], agentT: 0, sinceInfect: 0, w, h};
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
      const d2 = dx * dx + dy * dy;
      if (d2 < 14000 && d2 > 1) {
        const f = (1 - d2 / 14000) * 0.4;
        n.x += (dx / Math.sqrt(d2)) * f;
        n.y += (dy / Math.sqrt(d2)) * f;
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
  sim.sinceInfect += dt;
  if (sim.sinceInfect > 2600) {
    sim.sinceInfect = 0;
    const idle = sim.nodes.filter((n) => !n.vulnerable && !n.healing);
    if (idle.length) idle[Math.floor(Math.random() * idle.length)].vulnerable = true;
  }
  stepAgent(sim, dt);
}

function draw(ctx: CanvasRenderingContext2D, sim: Sim, t: number) {
  ctx.clearRect(0, 0, sim.w, sim.h);
  ctx.lineWidth = 1;
  for (const [a, b] of sim.edges) {
    const lit = a === sim.agentAt || b === sim.agentAt || a === sim.agentTo || b === sim.agentTo;
    ctx.strokeStyle = lit ? EDGE_LIT : EDGE_DIM;
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
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + (n.vulnerable ? pulse : 0), 0, Math.PI * 2);
    ctx.fill();
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
  const ro = new ResizeObserver(resize);
  ro.observe(parent);
  parent.addEventListener("mousemove", onMove);
  parent.addEventListener("mouseleave", onLeave);

  let raf = 0;
  let prev = 0;
  const frame = (now: number) => {
    const dt = Math.min(48, prev ? now - prev : 16);
    prev = now;
    step(sim, dt, mouse.x, mouse.y);
    draw(ctx, sim, now);
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
    ro.disconnect();
    parent.removeEventListener("mousemove", onMove);
    parent.removeEventListener("mouseleave", onLeave);
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
