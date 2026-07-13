import { AuthEnv } from "@/lib/env/classes/auth-env";
import { ApiEnv } from "@/lib/env/classes/api-env";
import { RuntimeEnv } from "@/lib/env/classes/runtime-env";
import { serverEnvSchema } from "@/lib/env/server-env-schema";

export class ServerEnv {
  readonly auth = new AuthEnv(serverEnvSchema);
  readonly api = new ApiEnv(serverEnvSchema);
  readonly runtime = new RuntimeEnv(serverEnvSchema);
}

export const serverEnv = new ServerEnv();
