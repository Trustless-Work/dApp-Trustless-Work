import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      SKIP_ENV_VALIDATION: "true",
      SESSION_SECRET: "test-placeholder-secret-32chars-min!",
      CORE_API_URL: "https://api.dev.trustlesswork.com",
      NEXT_PUBLIC_TW_API_KEY: "test-placeholder",
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
