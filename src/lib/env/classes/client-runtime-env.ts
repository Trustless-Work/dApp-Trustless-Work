type NodeEnv = "development" | "production" | "test";

function getNodeEnv(): NodeEnv {
  const value = process.env.NODE_ENV;
  if (value === "production" || value === "test") {
    return value;
  }
  return "development";
}

export class ClientRuntimeEnv {
  get nodeEnv(): NodeEnv {
    return getNodeEnv();
  }

  get isProduction(): boolean {
    return getNodeEnv() === "production";
  }

  get isDevelopment(): boolean {
    return getNodeEnv() === "development";
  }

  get isTest(): boolean {
    return getNodeEnv() === "test";
  }
}
