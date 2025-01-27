export interface CommandProvider {
  registerActions(): void;
  execute(): Promise<void>;
}

export interface CommandLineConfig {
  toolFilename: string;
  toolDescription: string;
}
