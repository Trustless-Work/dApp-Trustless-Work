type RuntimeEnvConfig = {
  readonly NODE_ENV: "development" | "production" | "test";
};

export class RuntimeEnv {
  constructor(private readonly config: RuntimeEnvConfig) {}

  get nodeEnv(): RuntimeEnvConfig["NODE_ENV"] {
    return this.config.NODE_ENV;
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === "production";
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === "development";
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === "test";
  }
}
