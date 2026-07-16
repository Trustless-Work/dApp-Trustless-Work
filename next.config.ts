import "./src/lib/env/env";
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const localEscrowEntry = path.resolve(
  __dirname,
  "../react-library-trustless-work/src/index.ts",
);

/**
 * Dual SDK resolution:
 * - Default (no env): published @trustless-work/escrow@beta from node_modules
 * - USE_LOCAL_ESCROW_SDK=true: sibling source at ../react-library-trustless-work
 */
const useLocalEscrowSdk = process.env.USE_LOCAL_ESCROW_SDK === "true";

if (useLocalEscrowSdk && !fs.existsSync(localEscrowEntry)) {
  throw new Error(
    `USE_LOCAL_ESCROW_SDK=true but local SDK entry not found at ${localEscrowEntry}`,
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@t3-oss/env-nextjs",
    "@t3-oss/env-core",
    "@trustless-work/escrow",
  ],
  ...(useLocalEscrowSdk
    ? {
        experimental: {
          externalDir: true,
        },
        outputFileTracingRoot: path.resolve(__dirname, ".."),
        webpack: (config) => {
          config.resolve.alias = {
            ...config.resolve.alias,
            "@trustless-work/escrow": localEscrowEntry,
          };
          return config;
        },
      }
    : {}),
};

export default nextConfig;
