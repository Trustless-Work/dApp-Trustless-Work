import type { ServerEnvConfig } from "@/lib/env/server-env-schema";

export class AuthEnv {
  constructor(private readonly config: ServerEnvConfig) {}

  get sessionSecret(): string {
    return this.config.SESSION_SECRET;
  }
}
