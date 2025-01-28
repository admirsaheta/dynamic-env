export type FileOperationResult = {
  success: boolean;
  path: string;
  error?: Error;
};

export type ReplacementPattern = {
  from: Array<RegExp>;
  to: string[];
};

export interface FileReplacementStrategy {
  replace(content: string, patterns: ReplacementPattern): string;
}

export interface FileOperationStrategy {
  execute(path: string): Promise<void>;
}
