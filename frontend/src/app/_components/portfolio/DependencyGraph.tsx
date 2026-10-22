"use client";

import {useEffect, useRef} from "react";
import {
  assembleNetwork,
  makeAgent,
  makeLayerGraph,
  routeAgent,
  stepAgent,
  type Agent,
  type LayerGraph,
  type Network,
} from "./graphNetwork";
import {LAYERS, PAD, STRENGTH, drawLayer, drawOverlay, type LayerDef} from "./graphDraw";

// Hero backdrop: one network of "packages" spread over soft-focus depth layers.
// A single fossabot agent walks it, across layers, healing vulnerable (amber)
// nodes. Layers shift a few pixels against the pointer; click or tap any node to
// send the agent there. Reduced motion draws one still frame.

const HIT = 26;
const HIT_TOUCH = 38;
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
  sel: number | null;
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
  return {size: [w, h], layers, net, agent: makeAgent(net), overlay, sel: null};
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

function placeLayers(scene: Scene, pointer: Pointer) {
  scene.layers.forEach((layer) => {
    layer.tx = -pointer.x * layer.def.amp * STRENGTH;
    layer.ty = -pointer.y * layer.def.amp * 0.75 * STRENGTH;
    layer.canvas.style.transform = `translate3d(${layer.tx.toFixed(2)}px, ${layer.ty.toFixed(2)}px, 0)`;
  });
}

function renderFrame(scene: Scene, pointer: Pointer, dt: number, t: number): number {
  const ease = 1 - Math.exp(-dt / 240);
  pointer.x += (pointer.tx - pointer.x) * ease;
  pointer.y += (pointer.ty - pointer.y) * ease;
  placeLayers(scene, pointer);
  stepAgent(scene.net, scene.agent, dt);
  const full: [number, number] = [scene.size[0] + PAD * 2, scene.size[1] + PAD * 2];
  scene.layers.forEach((layer, i) => {
    drawLayer(layer.ctx, layer.graph, scene.net.offsets[i], scene.agent, layer.def, full, t);
  });
  const {agent} = scene;
  const done = scene.sel !== null && !agent.routing && agent.doneAt !== null;
  if (done && agent.clock - agent.doneAt! > SELECTION_LINGER_MS) scene.sel = null;
  const hover = pointer.inside ? nodeAt(scene, pointer.px, pointer.py, HIT) : -1;
  drawOverlay(scene.overlay, {
    net: scene.net,
    agent,
    sel: scene.sel,
    hover,
    size: scene.size,
    pos: (gid) => stagePos(scene, gid),
  });
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

  const frame = (now: number) => {
    const dt = Math.min(48, prev ? now - prev : 16);
    prev = now;
    const hover = renderFrame(scene, pointer, dt, now);
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
    if (reduced) renderFrame(scene, pointer, 0, 0);
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
    scene.sel = hit >= 0 ? hit : null;
    if (hit < 0) return;
    if (!routeAgent(scene.net, scene.agent, hit)) scene.agent.doneAt = scene.agent.clock;
  };

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
