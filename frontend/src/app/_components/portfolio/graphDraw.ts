import type {Ring} from "./graphFx";
import type {Agent, LayerGraph, Network} from "./graphNetwork";

export type LayerDef = {
  n: number;
  rMin: number;
  rMax: number;
  amp: number;
  nodeA: number;
  edgeA: number;
  blur: number;
  glow: boolean;
  depth: number;
};

export const PAD = 80;
export const STRENGTH = 0.2;
export const RING_MS = 1000;

export const LAYERS: LayerDef[] = [
  {n: 86, rMin: 0.6, rMax: 1.2, amp: 3, nodeA: 0.38, edgeA: 0.12, blur: 1, glow: false, depth: 0},
  {n: 48, rMin: 1, rMax: 1.8, amp: 6, nodeA: 0.5, edgeA: 0.16, blur: 0, glow: false, depth: 0.33},
  {n: 22, rMin: 1.8, rMax: 3, amp: 11, nodeA: 0.7, edgeA: 0.24, blur: 0, glow: false, depth: 0.66},
  {n: 4, rMin: 4, rMax: 6, amp: 20, nodeA: 0.7, edgeA: 0.18, blur: 1.8, glow: true, depth: 1},
];

const HEALTHY = "180,197,255";
const VULN = "245,165,90";
const AGENT = "123,208,255";

export function drawLayer(
  ctx: CanvasRenderingContext2D,
  graph: LayerGraph,
  offset: number,
  agent: Agent,
  def: LayerDef,
  size: [number, number],
  t: number,
) {
  ctx.clearRect(0, 0, size[0], size[1]);
  ctx.lineWidth = 1;
  const {nodes} = graph;
  graph.edges.forEach(([a, b]) => {
    const ga = offset + a;
    const gb = offset + b;
    const lit = [ga, gb].some((g) => g === agent.at || g === agent.to);
    ctx.strokeStyle = lit
      ? `rgba(${AGENT}, ${0.12 + def.nodeA * 0.4})`
      : `rgba(120,140,195,${def.edgeA})`;
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  nodes.forEach((n) => {
    const pulse = n.vuln ? 0.5 + 0.5 * Math.sin(t * 0.004) : 0;
    let color = HEALTHY;
    let alpha = def.nodeA;
    if (n.vuln) {
      color = VULN;
      alpha = def.nodeA * (0.85 + 0.15 * pulse);
    } else if (n.heal > 0) {
      color = AGENT;
      alpha = Math.min(1, def.nodeA + 0.25 * n.heal);
    }
    ctx.shadowBlur = def.glow ? 14 : 0;
    ctx.shadowColor = `rgba(${color}, 0.55)`;
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + pulse * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

export type OverlayView = {
  net: Network;
  agent: Agent;
  waypoints: number[];
  hover: number;
  size: [number, number];
  pos: (gid: number) => [number, number];
};

function ring(ctx: CanvasRenderingContext2D, p: [number, number], r: number, alpha: number, fill: boolean) {
  if (fill) {
    ctx.fillStyle = `rgba(${AGENT}, 0.14)`;
    ctx.beginPath();
    ctx.arc(p[0], p[1], r + 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = `rgba(${AGENT}, ${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCrossLinks(ctx: CanvasRenderingContext2D, v: OverlayView) {
  ctx.lineWidth = 1;
  v.net.cross.forEach(([a, b]) => {
    const lit = [a, b].some((g) => g === v.agent.at || g === v.agent.to);
    ctx.strokeStyle = lit ? `rgba(${AGENT}, 0.42)` : "rgba(120,140,195,0.11)";
    const pa = v.pos(a);
    const pb = v.pos(b);
    ctx.beginPath();
    ctx.moveTo(pa[0], pa[1]);
    ctx.lineTo(pb[0], pb[1]);
    ctx.stroke();
  });
}

function agentPoint(v: OverlayView): [number, number] {
  const from = v.pos(v.agent.at);
  const to = v.pos(v.agent.to);
  const t = v.agent.t;
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
}

function drawRoute(ctx: CanvasRenderingContext2D, v: OverlayView, dot: [number, number]) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(dot[0], dot[1]);
  [v.agent.to, ...v.agent.queue].forEach((g) => {
    const p = v.pos(g);
    ctx.lineTo(p[0], p[1]);
  });
  ctx.strokeStyle = `rgba(${AGENT}, 0.2)`;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.strokeStyle = `rgba(${AGENT}, 0.95)`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawAgent(ctx: CanvasRenderingContext2D, v: OverlayView, dot: [number, number]) {
  const depthAt = LAYERS[v.net.nodes[v.agent.at].layer].depth;
  const depthTo = LAYERS[v.net.nodes[v.agent.to].layer].depth;
  const depth = depthAt + (depthTo - depthAt) * v.agent.t;
  const radius = 10 + 7 * depth;
  const glow = ctx.createRadialGradient(dot[0], dot[1], 0, dot[0], dot[1], radius);
  glow.addColorStop(0, `rgba(${AGENT}, ${0.55 + 0.4 * depth})`);
  glow.addColorStop(1, `rgba(${AGENT}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dot[0], dot[1], radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawOverlay(ctx: CanvasRenderingContext2D, v: OverlayView) {
  ctx.clearRect(0, 0, v.size[0], v.size[1]);
  drawCrossLinks(ctx, v);
  const dot = agentPoint(v);
  if (v.hover >= 0 && !v.waypoints.includes(v.hover)) {
    ring(ctx, v.pos(v.hover), v.net.nodes[v.hover].r + 5, 0.45, false);
  }
  if (v.waypoints.length && v.agent.routing) drawRoute(ctx, v, dot);
  v.waypoints.forEach((g) => ring(ctx, v.pos(g), v.net.nodes[g].r + 7, 0.95, true));
  drawAgent(ctx, v, dot);
}

export function drawRings(ctx: CanvasRenderingContext2D, rings: Ring[], t: number) {
  rings.forEach((g) => {
    const k = (t - g.t0) / RING_MS;
    ctx.strokeStyle = `rgba(${AGENT}, ${0.55 * (1 - k)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(g.x, g.y, 6 + k * 190, 0, Math.PI * 2);
    ctx.stroke();
  });
}
