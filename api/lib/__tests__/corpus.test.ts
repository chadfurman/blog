import { describe, it, expect } from "vitest";
import { buildCorpus } from "../corpus.js";

describe("buildCorpus", () => {
  it("returns a non-empty string", () => {
    const corpus = buildCorpus();
    expect(typeof corpus).toBe("string");
    expect(corpus.length).toBeGreaterThan(0);
  });

  it("contains Chad Furman's name", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("Chad Furman");
  });

  it("contains at least one project title", () => {
    const corpus = buildCorpus();
    // fossabot is the first project in portfolio
    expect(corpus).toMatch(/fossabot|Evercast/i);
  });

  it("contains experience entries", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("FOSSA");
    expect(corpus).toContain("Klaviyo");
  });

  it("contains education entries", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("University at Albany");
  });

  it("contains earlier roles", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("Fuzz Productions");
  });

  it("includes case study body content", () => {
    const corpus = buildCorpus();
    // fossabot case study body contains "agentic"
    expect(corpus).toMatch(/agentic/i);
  });
});
