import { ClientRuntimeEnv } from "@/lib/env/classes/client-runtime-env";
import { IntegrationsEnv } from "@/lib/env/classes/integrations-env";
import { clientEnvSchema } from "@/lib/env/client-env-schema";

export class ClientEnv {
  readonly integrations = new IntegrationsEnv(clientEnvSchema);
  readonly runtime = new ClientRuntimeEnv();
}

export const clientEnv = new ClientEnv();
