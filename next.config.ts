import "./src/lib/env/env";
import type { NextConfig } from "next";
import path from "path";

const escrowLibraryEntry = path.resolve(
  __dirname,
  "../react-library-trustless-work/src/index.ts",
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@trustless-work/escrow": escrowLibraryEntry,
    };
    return config;
  },
};

export default nextConfig;
