export type EnvPrefix = "REACT_APP_" | "VITE_";
export type SpecialEnvKeys = "PUBLIC_URL";

export interface EnvironmentConfig {
  readonly [key: string]: string;
}

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
    const envEntries = Object.entries(this.processEnv)
      .filter(
        ([key]) =>
          this.environmentPrefixes.some((prefix) => key.startsWith(prefix)) ||
          this.specialKeys.includes(key as SpecialEnvKeys)
      )
      .filter((entry): entry is [string, string] => {
        const value = entry[1];
        return value !== undefined && value !== null;
      });

    return Object.freeze(Object.fromEntries(envEntries));
  }

  public getDotEnvConfig(): EnvironmentConfig {
    const envEntries = Object.entries(this.processEnv).filter(
      (entry): entry is [string, string] => {
        const value = entry[1];
        return value !== undefined && value !== null;
      }
    );

    return Object.freeze(Object.fromEntries(envEntries));
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
