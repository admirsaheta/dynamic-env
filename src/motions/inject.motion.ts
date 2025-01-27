import {
  CommandLineAction,
  CommandLineStringParameter,
} from "@rushstack/ts-command-line";
import type {
  EnvironmentProvider,
  FileOutputHandler,
  MotionParameters,
} from "@/utils/motion.types";

import { EnvironmentUtils } from "@/utils/env.utils";
import { FileUtils } from "@/utils/file.utils";

export class InjectMotion
  extends CommandLineAction
  implements MotionParameters
{
  private readonly _dir: CommandLineStringParameter;
  private readonly _output: CommandLineStringParameter;
  private readonly environmentProvider: EnvironmentProvider;
  private readonly fileHandler: FileOutputHandler;

  constructor(
    environmentProvider: EnvironmentProvider = new EnvironmentUtils(),
    fileHandler: FileOutputHandler = new FileUtils()
  ) {
    super({
      actionName: "inject",
      summary: "Inject environment variables into your React /build folder.",
      documentation:
        "Injects environment variables into specified build directory with optional copy functionality",
    });

    this.environmentProvider = environmentProvider;
    this.fileHandler = fileHandler;

    this._dir = this.defineStringParameter({
      description: "Specify the location of your build folder",
      parameterLongName: "--dir",
      parameterShortName: "-d",
      argumentName: "PATH_TO_BUILD_FOLDER",
      required: true,
    });

    this._output = this.defineStringParameter({
      description:
        "Specify the location of the new folder if you would like to make a copy",
      parameterLongName: "--output",
      parameterShortName: "-o",
      argumentName: "PATH_TO_OUTPUT_FOLDER",
      required: false,
    });
  }

  get dir(): string {
    if (!this._dir.value) {
      throw new Error("Build directory path is required");
    }
    return this._dir.value;
  }

  get fileName(): string {
    return "env.js"; // Default filename for compatibility with MotionParameters
  }

  get varName(): string {
    return "env"; // Default varname for compatibility with MotionParameters
  }

  get outputPath(): string | undefined {
    return this._output.value;
  }

  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    try {
      const targetDir = await this.prepareTargetDirectory();
      const envConfig = await this.getEnvironmentConfig();

      const result = await this.fileHandler.replaceFilesInDirectory(
        targetDir,
        envConfig
      );

      if (result.some((r: { success: any }) => !r.success)) {
        const failures = result.filter((r: { success: any }) => !r.success);
        throw new Error(
          `Failed to process files: ${failures
            .map((f: { path: any }) => f.path)
            .join(", ")}`
        );
      }

      console.log(
        `Successfully injected environment variables in: ${targetDir}`
      );
    } catch (error) {
      console.error(
        "Failed to execute inject motion:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  private async prepareTargetDirectory(): Promise<string> {
    if (!this.outputPath) {
      return this.dir;
    }

    const result = await this.fileHandler.copyFolder(this.dir, this.outputPath);
    if (!result.success) {
      throw (
        result.error || new Error(`Failed to copy folder to ${this.outputPath}`)
      );
    }

    return this.outputPath;
  }

  private async getEnvironmentConfig(): Promise<Record<string, string>> {
    try {
      return {
        ...this.environmentProvider.getDotEnvConfig(),
        ...this.environmentProvider.getReactEnvironmentConfig(),
      };
    } catch (error) {
      throw new Error(
        `Failed to load environment configuration: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
