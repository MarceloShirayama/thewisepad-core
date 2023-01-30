/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      exclude: ["*/**/errors/*", "*/**/either.ts", "tests/**/*"],
    },
  },
});
