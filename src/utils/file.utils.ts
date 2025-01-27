import type {
  FileOperationResult,
  FileOperationStrategy,
  FileReplacementStrategy,
  ReplacementPattern,
} from "@/types/file.types";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

export interface FileProtocol {
  fromTo(environmentConfig: Record<string, string>): ReplacementPattern;
  copyFolder(
    directory: string,
    destination: string
  ): Promise<FileOperationResult>;
  replaceFile(
    directoryPath: string,
    environmentConfig: Record<string, string>
  ): Promise<FileOperationResult>;
  replaceFilesInDirectory(
    directoryPath: string,
    environmentConfig: Record<string, string>
  ): Promise<FileOperationResult[]>;
  outputEnvironmentFile(
    folder: string,
    fileName: string,
    environmentConfig: Record<string, string>,
    varname: string
  ): Promise<FileOperationResult>;
}

export class RegexReplacementStrategy implements FileReplacementStrategy {
  replace(content: string, patterns: ReplacementPattern): string {
    if (
      !content ||
      !patterns.from.length ||
      patterns.from.length !== patterns.to.length
    ) {
      return content;
    }

    return patterns.from.reduce((acc, pattern, index) => {
      try {
        const searchPattern =
          pattern instanceof RegExp ? pattern : new RegExp(pattern, "g");
        const replacement = patterns.to[index] || "";
        return acc.replace(searchPattern, replacement);
      } catch (error) {
        console.warn(`Invalid replacement pattern: ${String(pattern)}`);
        return acc;
      }
    }, content);
  }
}

class RecursiveCopyStrategy implements FileOperationStrategy {
  async execute(path: string): Promise<void> {
    const [src, dest] = path.split("|");
    if (!src || !dest) {
      throw new Error('Invalid path format. Expected "source|destination"');
    }

    const stats = statSync(src);
    if (stats.isDirectory()) {
      if (!existsSync(dest)) await mkdir(dest, { recursive: true });
      const files = readdirSync(src);
      await Promise.all(
        files.map((file) =>
          this.execute(`${join(src, file)}|${join(dest, file)}`)
        )
      );
    } else {
      await copyFile(src, dest);
    }
  }
}

// Main implementation
export class FileUtils implements FileProtocol {
  private readonly placeholder = "%%";
  private readonly replacementStrategy: FileReplacementStrategy;
  private readonly copyStrategy: RecursiveCopyStrategy;

  constructor(
    replacementStrategy: FileReplacementStrategy = new RegexReplacementStrategy(),
    copyStrategy: RecursiveCopyStrategy = new RecursiveCopyStrategy()
  ) {
    this.replacementStrategy = replacementStrategy;
    this.copyStrategy = copyStrategy;
  }

  public fromTo(environmentConfig: Record<string, string>): ReplacementPattern {
    const from = Object.keys(environmentConfig)
      .map((key) => `${this.placeholder}${key}`)
      .map((key) => new RegExp(`\\b${key}\\b`, "g"));

    return {
      from,
      to: Object.values(environmentConfig),
    };
  }

  public async copyFolder(
    directory: string,
    destination: string
  ): Promise<FileOperationResult> {
    try {
      await this.copyStrategy.execute(`${directory}|${destination}`);
      return { success: true, path: destination };
    } catch (error) {
      return { success: false, path: destination, error: error as Error };
    }
  }

  public async replaceFile(
    directoryPath: string,
    environmentConfig: Record<string, string>
  ): Promise<FileOperationResult> {
    try {
      const content = await readFile(directoryPath, "utf-8");
      const patterns = this.fromTo(environmentConfig);
      const newContent = this.replacementStrategy.replace(content, patterns);
      await writeFile(directoryPath, newContent, "utf-8");
      return { success: true, path: directoryPath };
    } catch (error) {
      return { success: false, path: directoryPath, error: error as Error };
    }
  }

  public async replaceFilesInDirectory(
    directoryPath: string,
    environmentConfig: Record<string, string>
  ): Promise<FileOperationResult[]> {
    const results: FileOperationResult[] = [];

    const processDirectory = async (dir: string): Promise<void> => {
      const files = readdirSync(dir);
      await Promise.all(
        files.map(async (file) => {
          const fullPath = join(dir, file);
          const stats = statSync(fullPath);
          if (stats.isDirectory()) {
            await processDirectory(fullPath);
          } else {
            const result = await this.replaceFile(fullPath, environmentConfig);
            results.push(result);
          }
        })
      );
    };

    try {
      await processDirectory(directoryPath);
      return results;
    } catch (error) {
      return [{ success: false, path: directoryPath, error: error as Error }];
    }
  }

  public async outputEnvironmentFile(
    folder: string,
    fileName: string,
    environmentConfig: Record<string, string>,
    varname: string
  ): Promise<FileOperationResult> {
    try {
      const fullPath = resolve(folder, fileName);
      await mkdir(folder, { recursive: true });
      const content = `window.${varname} = ${JSON.stringify(
        environmentConfig,
        null,
        2
      )}`;
      await writeFile(fullPath, content, "utf-8");
      return { success: true, path: fullPath };
    } catch (error) {
      return {
        success: false,
        path: resolve(folder, fileName),
        error: error as Error,
      };
    }
  }
}
