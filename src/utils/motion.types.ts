import type { FileOperationResult } from "@/types/file.types";

export interface EnvironmentProvider {
  getDotEnvConfig(): Record<string, string>;
  getReactEnvironmentConfig(): Record<string, string>;
}

export interface FileOutputHandler {
  outputEnvironmentFile(
    folder: string,
    fileName: string,
    config: Record<string, string>,
    varName: string
  ): Promise<FileOperationResult>;
  copyFolder(
    directory: string,
    destination: string
  ): Promise<FileOperationResult>;
  replaceFilesInDirectory(
    directoryPath: string,
    environmentConfig: Record<string, string>
  ): Promise<FileOperationResult[]>;
  executeBuildCommand(
    command: string,
    config: Record<string, string>,
    bypassVars: string[]
  ): Promise<FileOperationResult>;
}

export interface MotionParameters {
  dir: string;
  fileName: string;
  varName: string;
}

export interface BuildParameters {
  command: string;
  dotEnvEnabled: boolean;
  bypassVars: string[];
}

export interface CommandParser {
  parseCommand(values: string[]): string;
}

export interface BooleanValidator {
  parseBoolean(value: string): boolean;
}

export interface CommandValidator {
  validateCommand(command: string): boolean;
}
