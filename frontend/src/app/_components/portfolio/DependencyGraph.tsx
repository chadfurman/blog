"use client";

import {useEffect, useRef} from "react";
import {
  appendRoute,
  assembleNetwork,
  makeAgent,
  makeLayerGraph,
  routeAgent,
  stepAgent,
  type Agent,
  type LayerGraph,
  type Network,
} from "./graphNetwork";
import {LAYERS, PAD, RING_MS, STRENGTH, drawLayer, drawOverlay, drawRings, type LayerDef} from "./graphDraw";
import {advanceFx, heroVisibility, makeFx, stormLevelAt, wipeAmountAt, type Fx} from "./graphFx";
import {OVERCLOCK_DONE_EVENT, OVERCLOCK_EVENT, WIPE_EVENT} from "./constants";

// Hero backdrop: one network of "packages" spread over soft-focus depth layers.
// A single fossabot agent walks it, across layers, healing vulnerable (amber)
// nodes. Layers shift a few pixels against the pointer; click or tap any node to
// send the agent there. Reduced motion draws one still frame.

const HIT = 26;
const HIT_TOUCH = 38;
const VISIBLE_TRIES = 24;
const SELECTION_LINGER_MS = 1100;

type Layer = {
  def: LayerDef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: LayerGraph;
  tx: number;
  ty: number;
};

type Scene = {
  size: [number, number];
  layers: Layer[];
  net: Network;
  agent: Agent;
  overlay: CanvasRenderingContext2D;
  waypoints: number[];
};

type Pointer = {x: number; y: number; tx: number; ty: number; px: number; py: number; inside: boolean};

function layerCanvas(def: LayerDef): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "absolute",
    left: `-${PAD}px`,
    top: `-${PAD}px`,
    width: `calc(100% + ${PAD * 2}px)`,
    height: `calc(100% + ${PAD * 2}px)`,
    willChange: "transform",
    filter: def.blur ? `blur(${def.blur}px)` : "",
  });
  return canvas;
}

function overlayCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {position: "absolute", inset: "0", width: "100%", height: "100%"});
  return canvas;
}

function fitCanvas(canvas: HTMLCanvasElement, w: number, h: number): CanvasRenderingContext2D {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * ratio);
  canvas.height = Math.round(h * ratio);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function buildScene(w: number, h: number, canvases: HTMLCanvasElement[]): Scene {
  const density = Math.min(2.5, Math.max(0.55, (w * h) / (960 * 540)));
  const full: [number, number] = [w + PAD * 2, h + PAD * 2];
  const layers = LAYERS.map((def, i) => {
    const count = Math.max(4, Math.round(def.n * density));
    const graph = makeLayerGraph(full[0], full[1], count, 101 + i * 17, def.rMin, def.rMax, i);
    return {def, canvas: canvases[i], ctx: fitCanvas(canvases[i], full[0], full[1]), graph, tx: 0, ty: 0};
  });
  const net = assembleNetwork(layers.map((l) => l.graph));
  const overlay = fitCanvas(canvases[LAYERS.length], w, h);
  return {size: [w, h], layers, net, agent: makeAgent(net), overlay, waypoints: []};
}

function stagePos(scene: Scene, gid: number): [number, number] {
  const node = scene.net.nodes[gid];
  const layer = scene.layers[node.layer];
  return [node.x - PAD + layer.tx, node.y - PAD + layer.ty];
}

function nodeAt(scene: Scene, x: number, y: number, reach: number): number {
  let best = -1;
  let bestD = reach * reach;
  for (let li = scene.layers.length - 1; li >= 0; li--) {
    const layer = scene.layers[li];
    const offset = scene.net.offsets[li];
    layer.graph.nodes.forEach((n, i) => {
      const d = (n.x - (x + PAD - layer.tx)) ** 2 + (n.y - (y + PAD - layer.ty)) ** 2;
      if (d < bestD - 9) {
        bestD = d;
        best = offset + i;
      }
    });
  }
  return best;
}

function placeLayers(scene: Scene, pointer: Pointer, wipe: number) {
  const scale = wipe ? ` scale(${(1 - 0.92 * wipe).toFixed(3)})` : "";
  const opacity = wipe ? String(1 - 0.9 * wipe) : "";
  scene.layers.forEach((layer) => {
    layer.tx = -pointer.x * layer.def.amp * STRENGTH;
    layer.ty = -pointer.y * layer.def.amp * 0.75 * STRENGTH;
    layer.canvas.style.transform = `translate3d(${layer.tx.toFixed(2)}px, ${layer.ty.toFixed(2)}px, 0)${scale}`;
    layer.canvas.style.opacity = opacity;
  });
}

function pickVisibleNode(scene: Scene): number {
  const count = scene.net.nodes.length;
  for (let i = 0; i < VISIBLE_TRIES; i++) {
    const gid = Math.floor(Math.random() * count);
    const [x, y] = stagePos(scene, gid);
    if (heroVisibility(x, y, scene.size[0], scene.size[1]) === 1) return gid;
  }
  return scene.agent.at;
}

function emitRing(scene: Scene, fx: Fx, t: number) {
  const [x, y] = stagePos(scene, pickVisibleNode(scene));
  fx.rings.push({x, y, t0: t});
}

function stepStorm(scene: Scene, fx: Fx, level: number, t: number) {
  fx.rings = fx.rings.filter((r) => t - r.t0 < RING_MS);
  if (level === 0) return;
  if (Math.random() < 0.4 * level) emitRing(scene, fx, t);
  if (!scene.agent.routing && Math.random() < 0.06) {
    routeAgent(scene.net, scene.agent, pickVisibleNode(scene));
  }
}

function updateWaypoints(scene: Scene) {
  const {agent, waypoints} = scene;
  const last = waypoints[waypoints.length - 1];
  scene.waypoints = waypoints.filter((w) => w !== agent.at || w === last);
  const finished = !agent.routing && agent.doneAt !== null;
  if (finished && agent.clock - agent.doneAt! > SELECTION_LINGER_MS) scene.waypoints = [];
}

function selectNode(scene: Scene, node: number, add: boolean) {
  const ok = add ? appendRoute(scene.net, scene.agent, node) : routeAgent(scene.net, scene.agent, node);
  if (!ok) scene.agent.doneAt = scene.agent.clock;
  const kept = add ? scene.waypoints.filter((w) => w !== node) : [];
  scene.waypoints = [...kept, node];
}

function renderFrame(scene: Scene, pointer: Pointer, fx: Fx, dt: number, t: number): number {
  const ease = 1 - Math.exp(-dt / 240);
  pointer.x += (pointer.tx - pointer.x) * ease;
  pointer.y += (pointer.ty - pointer.y) * ease;
  const level = stormLevelAt(fx, t);
  const wipe = wipeAmountAt(fx, t);
  placeLayers(scene, pointer, wipe);
  stepStorm(scene, fx, level, t);
  stepAgent(scene.net, scene.agent, dt * (1 + 3 * level));
  const full: [number, number] = [scene.size[0] + PAD * 2, scene.size[1] + PAD * 2];
  scene.layers.forEach((layer, i) => {
    drawLayer(layer.ctx, layer.graph, scene.net.offsets[i], scene.agent, layer.def, full, t);
  });
  updateWaypoints(scene);
  const hover = pointer.inside ? nodeAt(scene, pointer.px, pointer.py, HIT) : -1;
  drawOverlay(scene.overlay, {
    net: scene.net,
    agent: scene.agent,
    waypoints: scene.waypoints,
    hover,
    size: scene.size,
    boost: level,
    pos: (gid) => stagePos(scene, gid),
  });
  drawRings(scene.overlay, fx.rings, t);
  scene.overlay.canvas.style.opacity = wipe ? String(1 - 0.9 * wipe) : "";
  return hover;
}

function mountGraph(container: HTMLDivElement): () => void {
  const parent = container.parentElement;
  if (!parent) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvases = [...LAYERS.map(layerCanvas), overlayCanvas()];
  canvases.forEach((c) => container.appendChild(c));
  const pointer: Pointer = {x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0, inside: false};
  let scene = buildScene(parent.clientWidth, parent.clientHeight, canvases);
  let raf = 0;
  let prev = 0;
  let inView = true;
  const fx = makeFx();

  const frame = (now: number) => {
    const dt = Math.min(48, prev ? now - prev : 16);
    prev = now;
    if (advanceFx(fx, now).stormDone) window.dispatchEvent(new Event(OVERCLOCK_DONE_EVENT));
    const hover = renderFrame(scene, pointer, fx, dt, now);
    parent.style.cursor = hover >= 0 ? "pointer" : "";
    raf = requestAnimationFrame(frame);
  };
  const sync = () => {
    const shouldRun = inView && !document.hidden && !reduced;
    if (shouldRun && !raf) {
      prev = 0;
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const rebuild = () => {
    scene = buildScene(parent.clientWidth, parent.clientHeight, canvases);
    if (reduced) renderFrame(scene, pointer, fx, 0, 0);
  };

  const onMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.px = e.clientX - rect.left;
    pointer.py = e.clientY - rect.top;
    pointer.tx = (pointer.px / rect.width - 0.5) * 2;
    pointer.ty = (pointer.py / rect.height - 0.5) * 2;
    pointer.inside = true;
  };
  const onLeave = () => {
    pointer.inside = false;
  };
  const onClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button, input")) return;
    const rect = container.getBoundingClientRect();
    const touch = e instanceof PointerEvent && e.pointerType === "touch";
    const hit = nodeAt(scene, e.clientX - rect.left, e.clientY - rect.top, touch ? HIT_TOUCH : HIT);
    if (hit >= 0) selectNode(scene, hit, e.shiftKey);
    else if (!e.shiftKey) scene.waypoints = [];
  };
  const onDown = (e: MouseEvent) => {
    if (!e.shiftKey || (e.target as HTMLElement).closest("a, button, input")) return;
    const rect = container.getBoundingClientRect();
    if (nodeAt(scene, e.clientX - rect.left, e.clientY - rect.top, HIT) >= 0) e.preventDefault();
  };

  const queue = (key: "pendingStorm" | "pendingWipe") => (e: Event) => {
    fx[key] = true;
    (e as CustomEvent<{handled: boolean}>).detail.handled = true;
  };
  const onOverclock = queue("pendingStorm");
  const onWipe = queue("pendingWipe");

  const ro = new ResizeObserver(rebuild);
  ro.observe(parent);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  io.observe(parent);
  document.addEventListener("visibilitychange", sync);
  if (!reduced) {
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("click", onClick);
    parent.addEventListener("mousedown", onDown);
    window.addEventListener(OVERCLOCK_EVENT, onOverclock);
    window.addEventListener(WIPE_EVENT, onWipe);
  }
  sync();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    parent.removeEventListener("pointermove", onMove);
    parent.removeEventListener("pointerleave", onLeave);
    parent.removeEventListener("click", onClick);
    parent.removeEventListener("mousedown", onDown);
    window.removeEventListener(OVERCLOCK_EVENT, onOverclock);
    window.removeEventListener(WIPE_EVENT, onWipe);
    parent.style.cursor = "";
    container.replaceChildren();
  };
}

export default function DependencyGraph({className = ""}: {className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountGraph(ref.current);
  }, []);
  return <div ref={ref} aria-hidden="true" className={`absolute inset-0 pointer-events-none ${className}`} />;
}
