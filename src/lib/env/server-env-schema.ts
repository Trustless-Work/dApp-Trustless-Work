import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnvSchema = createEnv({
  server: {
    SESSION_SECRET: z.string().min(32),
    CORE_API_URL: z.string().url(),
    BACKOFFICE_ADMIN_API_KEY: z.string().min(1).optional(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    SESSION_SECRET: process.env.SESSION_SECRET,
    CORE_API_URL: process.env.CORE_API_URL,
    BACKOFFICE_ADMIN_API_KEY: process.env.BACKOFFICE_ADMIN_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

export type ServerEnvConfig = typeof serverEnvSchema;
