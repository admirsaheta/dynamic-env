interface EnvConfig {
  [key: string]: string | undefined;
}

function getEnv<T extends EnvConfig = EnvConfig>(varName = "env"): T {
  const env: EnvConfig = {};

  try {
    if (typeof process?.env === "object") {
      Object.assign(env, process.env);
    }
    // @ts-ignore
    if (typeof window !== "undefined" && typeof window[varName] === "object") {
      // @ts-ignore
      Object.assign(env, window[varName]);
    }
  } catch (error) {
    console.warn(
      `Failed to load environment variables: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return env as T;
}

const env = getEnv();

export default env;
export { getEnv };
export type { EnvConfig };
