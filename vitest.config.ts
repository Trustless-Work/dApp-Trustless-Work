import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

const localEscrowEntry = path.resolve(
  __dirname,
  "../react-library-trustless-work/src/index.ts",
);
const useLocalEscrowSdk = process.env.USE_LOCAL_ESCROW_SDK === "true";

if (useLocalEscrowSdk && !fs.existsSync(localEscrowEntry)) {
  throw new Error(
    `USE_LOCAL_ESCROW_SDK=true but local SDK entry not found at ${localEscrowEntry}`,
  );
}

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
      ...(useLocalEscrowSdk
        ? { "@trustless-work/escrow": localEscrowEntry }
        : {}),
    },
  },
});
