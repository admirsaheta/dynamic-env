import {
  type EnvPrefix,
  type EnvironmentConfig,
  type SpecialEnvKeys,
} from "@/types/env.types";

export interface EnvironmentProtocol {
  getReactEnvironmentConfig(): EnvironmentConfig;
  getDotEnvConfig(): EnvironmentConfig;
  getEnvByPrefix(prefix: EnvPrefix): EnvironmentConfig;
}

export class EnvironmentUtils implements EnvironmentProtocol {
  private readonly environmentPrefixes: readonly EnvPrefix[] = [
    "REACT_APP_",
    "VITE_",
  ];
  private readonly specialKeys: readonly SpecialEnvKeys[] = ["PUBLIC_URL"];

  constructor(private readonly processEnv: NodeJS.ProcessEnv = process.env) {
    if (!processEnv) {
      throw new Error("DynamicEnv: Process environment is not available");
    }
  }

  public getReactEnvironmentConfig(): EnvironmentConfig {
    const envVars: Record<string, string> = {};

    for (const [key, value] of Object.entries(this.processEnv)) {
      const isEnvVar = this.environmentPrefixes.some((prefix) =>
        key.startsWith(prefix)
      );
      const isSpecialKey = this.specialKeys.includes(key as SpecialEnvKeys);

      if ((isEnvVar || isSpecialKey) && value !== undefined) {
        envVars[key] = value;
      }
    }

    return envVars;
  }

  public getDotEnvConfig(): EnvironmentConfig {
    const envVars: Record<string, string> = {};

    for (const [key, value] of Object.entries(this.processEnv)) {
      const isEnvVar = this.environmentPrefixes.some((prefix) =>
        key.startsWith(prefix)
      );
      const isSpecialKey = this.specialKeys.includes(key as SpecialEnvKeys);

      if ((isEnvVar || isSpecialKey) && value !== undefined) {
        envVars[key] = value;
      }
    }

    return envVars;
  }

  public getEnvByPrefix(prefix: EnvPrefix): EnvironmentConfig {
    const envEntries = Object.entries(this.processEnv)
      .filter(([key]) => key.startsWith(prefix))
      .filter((entry): entry is [string, string] => {
        const value = entry[1];
        return value !== undefined && value !== null;
      });

    return Object.freeze(Object.fromEntries(envEntries));
  }
}
