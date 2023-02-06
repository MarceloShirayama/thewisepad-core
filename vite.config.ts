/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["dotenv/config"],
    coverage: {
      provider: "istanbul",
      exclude: ["*/**/errors/*", "*/**/either.ts", "test/**/*"],
      reporter: ["text", "json", "html"],
    },
  },
});
