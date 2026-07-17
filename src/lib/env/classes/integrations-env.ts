import type { ClientEnvConfig } from "@/lib/env/client-env-schema";

export class IntegrationsEnv {
  constructor(private readonly config: ClientEnvConfig) {}

  get walletConnectProjectId(): string | undefined {
    return this.config.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  }
}
