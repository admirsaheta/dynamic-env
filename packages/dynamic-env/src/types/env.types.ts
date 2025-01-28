export type EnvPrefix = "REACT_APP_" | "VITE_";
export type SpecialEnvKeys = "PUBLIC_URL";

export interface EnvironmentConfig {
  readonly [key: string]: string;
}
