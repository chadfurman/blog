import { describe, it, expect } from "vitest";
import {
  assembleNetwork,
  makeAgent,
  makeLayerGraph,
  mulberry32,
  routeAgent,
  stepAgent,
  type Network,
} from "../../../frontend/src/app/_components/portfolio/graphNetwork.js";

function buildNetwork(counts: number[], seed = 1): Network {
  const graphs = counts.map((n, i) => makeLayerGraph(900, 500, n, seed + i * 17, 1, 3, i));
  return assembleNetwork(graphs);
}

function reachableFrom(net: Network, start: number): number {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    for (const v of net.adj[queue.shift()!]) {
      if (!seen.has(v)) {
        seen.add(v);
        queue.push(v);
      }
    }
  }
  return seen.size;
}

describe("makeLayerGraph", () => {
  it("is deterministic for a seed and tags nodes with their layer", () => {
    const a = makeLayerGraph(900, 500, 20, 7, 1, 3, 2);
    const b = makeLayerGraph(900, 500, 20, 7, 1, 3, 2);
    expect(a.nodes.map((n) => [n.x, n.y])).toEqual(b.nodes.map((n) => [n.x, n.y]));
    expect(a.nodes.every((n) => n.layer === 2)).toBe(true);
  });
});

describe("assembleNetwork", () => {
  it.each([
    [[40, 24, 18, 6]],
    [[86, 48, 22, 4]],
    [[4, 4, 4, 4]],
    [[16, 9, 4, 4]],
    [[150, 80, 40, 6]],
  ])("joins every node into one connected piece (%j)", (counts) => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const net = buildNetwork(counts, seed);
      expect(reachableFrom(net, 0)).toBe(net.nodes.length);
    }
  });

  it("links neighbouring layers to each other", () => {
    const net = buildNetwork([40, 24, 18, 6]);
    expect(net.cross.length).toBeGreaterThan(0);
    for (const [a, b] of net.cross) {
      expect(Math.abs(net.nodes[a].layer - net.nodes[b].layer)).toBeGreaterThanOrEqual(1);
    }
  });

  it("numbers nodes by layer offset", () => {
    const net = buildNetwork([10, 6]);
    expect(net.offsets).toEqual([0, 10]);
    expect(net.nodes[10].layer).toBe(1);
  });
});

describe("routeAgent", () => {
  it("can reach every node and ends the route on the target", () => {
    const net = buildNetwork([40, 24, 18, 6]);
    for (let target = 1; target < net.nodes.length; target++) {
      const agent = makeAgent(net);
      if (target === agent.at) continue;
      expect(routeAgent(net, agent, target)).toBe(true);
      const last = agent.queue.length ? agent.queue[agent.queue.length - 1] : agent.to;
      expect(last).toBe(target);
    }
  });

  it("turns around when the target is the node it just left", () => {
    const net = buildNetwork([20, 10]);
    const agent = makeAgent(net);
    const origin = agent.at;
    agent.t = 0.25;
    expect(routeAgent(net, agent, origin)).toBe(true);
    expect(agent.to).toBe(origin);
    expect(agent.queue).toEqual([]);
  });
});

describe("stepAgent", () => {
  it("heals a vulnerable node on arrival and finishes a route", () => {
    const net = buildNetwork([30, 18, 8]);
    const agent = makeAgent(net);
    const target = net.nodes.length - 1;
    net.nodes[target].vuln = true;
    routeAgent(net, agent, target);
    const rand = mulberry32(3);
    for (let i = 0; i < 4000 && agent.routing; i++) stepAgent(net, agent, 16, rand);
    expect(agent.routing).toBe(false);
    expect(agent.doneAt).not.toBeNull();
    expect(net.nodes[target].vuln).toBe(false);
    expect(agent.at).toBe(target);
  });

  it("wanders across layers on its own", () => {
    const net = buildNetwork([40, 24, 18, 6]);
    const agent = makeAgent(net);
    const rand = mulberry32(11);
    const layers = new Set<number>();
    for (let i = 0; i < 6000; i++) {
      stepAgent(net, agent, 16, rand);
      layers.add(net.nodes[agent.at].layer);
    }
    expect(layers.size).toBeGreaterThanOrEqual(3);
  });
});
