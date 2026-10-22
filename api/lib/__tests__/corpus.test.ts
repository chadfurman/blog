import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "../systemPrompt.js";
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
  it("includes the skill groups", () => {
    expect(buildCorpus()).toContain("Context Engineering");
  });

  it("includes the freelance services", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("WordPress Care");
    expect(corpus).toContain("E-Commerce");
  });

  it("includes side work: Build Aloud, the MCP servers, and the TA-Lib Rust port", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("Build Aloud");
    expect(corpus).toContain("Skills Marketplace");
    expect(corpus).toContain("Rize");
    expect(corpus).toContain("TA-Lib");
  });

  it("includes the blog posts", () => {
    expect(buildCorpus()).toContain("RSI");
  });
  it("uses the Engineering Lead title at FOSSA", () => {
    const corpus = buildCorpus();
    expect(corpus).toContain("Engineering Lead at FOSSA");
    expect(corpus).not.toContain("Staff Engineer");
  });
  it("keeps the whole system prompt well under the 100k-token price tier", () => {
    // ~3.5 chars per token; the cheap tier ends at 100k input tokens per request.
    expect(buildSystemPrompt().length / 3.5).toBeLessThan(25_000);
  });
});
