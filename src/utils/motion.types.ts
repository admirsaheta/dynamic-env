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
}

export interface MotionParameters {
  dir: string;
  fileName: string;
  varName: string;
}
