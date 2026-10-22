export type NetNode = {
  x: number;
  y: number;
  r: number;
  vuln: boolean;
  heal: number;
  layer: number;
};

export type LayerGraph = {nodes: NetNode[]; edges: [number, number][]};

export type Network = {
  nodes: NetNode[];
  adj: number[][];
  cross: [number, number][];
  offsets: number[];
};

export type Agent = {
  at: number;
  to: number;
  prev: number;
  t: number;
  sinceInfect: number;
  clock: number;
  queue: number[];
  routing: boolean;
  doneAt: number | null;
};

type Rand = () => number;

export function mulberry32(seed: number): Rand {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist2 = (a: NetNode, b: NetNode) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export function makeLayerGraph(
  w: number,
  h: number,
  count: number,
  seed: number,
  rMin: number,
  rMax: number,
  layer: number,
): LayerGraph {
  const rand = mulberry32(seed);
  const nodes: NetNode[] = Array.from({length: count}, () => ({
    x: rand() * w,
    y: rand() * h,
    r: rMin + rand() * (rMax - rMin),
    vuln: rand() < 0.16,
    heal: 0,
    layer,
  }));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({j, d: dist2(node, other)}))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2 + (i % 2))
      .forEach(({j}) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([i, j]);
      });
  });
  return {nodes, edges};
}

function linkNeighbouringLayers(
  graphs: LayerGraph[],
  offsets: number[],
  crossMax: number,
  link: (a: number, b: number) => void,
) {
  for (let l = 0; l + 1 < graphs.length; l++) {
    const smallIsFirst = graphs[l].nodes.length <= graphs[l + 1].nodes.length;
    const [small, other] = smallIsFirst ? [l, l + 1] : [l + 1, l];
    graphs[small].nodes.forEach((node, i) => {
      let best = -1;
      let bestD = crossMax * crossMax;
      graphs[other].nodes.forEach((candidate, j) => {
        const d = dist2(node, candidate);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      });
      if (best >= 0) link(offsets[small] + i, offsets[other] + best);
    });
  }
}

function reachable(adj: number[][], start: number): Set<number> {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    for (const v of adj[queue.shift()!]) {
      if (!seen.has(v)) {
        seen.add(v);
        queue.push(v);
      }
    }
  }
  return seen;
}

function bridgeIslands(nodes: NetNode[], adj: number[][], link: (a: number, b: number) => void) {
  for (;;) {
    const inside = reachable(adj, 0);
    if (inside.size === nodes.length) return;
    let best: [number, number] = [0, 0];
    let bestD = Infinity;
    inside.forEach((i) => {
      nodes.forEach((candidate, j) => {
        if (inside.has(j)) return;
        const d = dist2(nodes[i], candidate);
        if (d < bestD) {
          bestD = d;
          best = [i, j];
        }
      });
    });
    link(best[0], best[1]);
  }
}

export function assembleNetwork(graphs: LayerGraph[], crossMax = 230): Network {
  const offsets: number[] = [];
  const nodes: NetNode[] = [];
  graphs.forEach((g) => {
    offsets.push(nodes.length);
    nodes.push(...g.nodes);
  });
  const adj: number[][] = nodes.map(() => []);
  const cross: [number, number][] = [];
  const connect = (a: number, b: number) => {
    adj[a].push(b);
    adj[b].push(a);
  };
  graphs.forEach((g, l) => g.edges.forEach(([a, b]) => connect(offsets[l] + a, offsets[l] + b)));
  const link = (a: number, b: number) => {
    connect(a, b);
    const la = nodes[a].layer;
    if (la === nodes[b].layer) graphs[la].edges.push([a - offsets[la], b - offsets[la]]);
    else cross.push([a, b]);
  };
  linkNeighbouringLayers(graphs, offsets, crossMax, link);
  bridgeIslands(nodes, adj, link);
  return {nodes, adj, cross, offsets};
}

export function makeAgent(net: Network): Agent {
  return {
    at: 0,
    to: net.adj[0][0],
    prev: -1,
    t: 0,
    sinceInfect: 0,
    clock: 0,
    queue: [],
    routing: false,
    doneAt: null,
  };
}

function nextWanderTarget(net: Network, agent: Agent, rand: Rand): number {
  const neighbours = net.adj[agent.at];
  const sick = neighbours.find((j) => net.nodes[j].vuln);
  if (sick !== undefined) return sick;
  const forward = neighbours.filter((j) => j !== agent.prev);
  const options = forward.length ? forward : neighbours;
  return options[Math.floor(rand() * options.length)];
}

function arrive(net: Network, agent: Agent, rand: Rand) {
  agent.t = 0;
  agent.prev = agent.at;
  agent.at = agent.to;
  const here = net.nodes[agent.at];
  if (here.vuln) {
    here.vuln = false;
    here.heal = 1;
  }
  if (agent.queue.length) {
    agent.to = agent.queue.shift()!;
    return;
  }
  if (agent.routing) {
    agent.routing = false;
    agent.doneAt = agent.clock;
  }
  agent.to = nextWanderTarget(net, agent, rand);
}

export function stepAgent(net: Network, agent: Agent, dt: number, rand: Rand = Math.random) {
  agent.clock += dt;
  const speed = agent.routing ? 0.0026 * Math.min(3, 1 + agent.queue.length * 0.12) : 0.0011;
  agent.t += dt * speed;
  if (agent.t >= 1) arrive(net, agent, rand);
  net.nodes.forEach((n) => {
    if (n.heal > 0) n.heal = Math.max(0, n.heal - dt * 0.0016);
  });
  agent.sinceInfect += dt;
  if (agent.sinceInfect <= 2600) return;
  agent.sinceInfect = 0;
  const idle = net.nodes.filter((n) => !n.vuln && n.heal === 0);
  if (idle.length) idle[Math.floor(rand() * idle.length)].vuln = true;
}

function pathTo(net: Network, from: number, target: number): number[] | null {
  const prev = new Map<number, number>();
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length && !seen.has(target)) {
    const u = queue.shift()!;
    for (const v of net.adj[u]) {
      if (seen.has(v)) continue;
      seen.add(v);
      prev.set(v, u);
      queue.push(v);
    }
  }
  if (!seen.has(target)) return null;
  const path: number[] = [];
  for (let cur = target; cur !== from; cur = prev.get(cur)!) path.unshift(cur);
  return path;
}

export function routeAgent(net: Network, agent: Agent, target: number): boolean {
  if (target === agent.to) {
    agent.queue = [];
  } else if (target === agent.at) {
    [agent.at, agent.to] = [agent.to, agent.at];
    agent.t = 1 - agent.t;
    agent.queue = [];
  } else {
    const path = pathTo(net, agent.to, target);
    if (!path) return false;
    agent.queue = path;
  }
  agent.routing = true;
  agent.doneAt = null;
  return true;
}
