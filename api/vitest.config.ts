import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      // Ensure the relative cross-package import resolves correctly
      // api/lib/corpus.ts imports ../../frontend/src/data/portfolio.ts
      // which is a plain `as const` TS file with no Next.js deps
    },
  },
  esbuild: {
    // vitest uses esbuild for TS; the portfolio file uses `as const` which is
    // valid ESNext, so no special treatment needed
  },
});
