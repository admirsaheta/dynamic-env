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

export class SetMotion extends CommandLineAction implements MotionParameters {
  private readonly _dir: CommandLineStringParameter;
  private readonly _filename: CommandLineStringParameter;
  private readonly _varname: CommandLineStringParameter;

  private readonly environmentProvider: EnvironmentProvider;
  private readonly fileHandler: FileOutputHandler;

  constructor(
    environmentProvider: EnvironmentProvider = new EnvironmentUtils(),
    fileHandler: FileOutputHandler = new FileUtils()
  ) {
    super({
      actionName: "set",
      summary: "Set environment variables into your React /build folder.",
      documentation:
        "Generates environment configuration file in the specified build directory",
    });

    this.environmentProvider = environmentProvider;
    this.fileHandler = fileHandler;

    this._dir = this.defineStringParameter({
      description: "Specify the location of your build folder",
      parameterLongName: "--dir",
      parameterShortName: "-d",
      argumentName: "PATH_TO_BUILD_FOLDER",
      defaultValue: "./build",
      required: true,
    });

    this._filename = this.defineStringParameter({
      description: "Specify the name for the output env file",
      parameterLongName: "--name",
      parameterShortName: "-n",
      argumentName: "NAME_OF_ENV_FILE",
      required: true,
      defaultValue: "env.js",
    });

    this._varname = this.defineStringParameter({
      description:
        "Overwrite the variable name that will be stored in `window`",
      parameterLongName: "--var",
      parameterShortName: "-v",
      argumentName: "VAR_NAME",
      defaultValue: "env",
    });
  }

  get dir(): string {
    return this._dir.value || "./build";
  }

  get fileName(): string {
    return this._filename.value || "env.js";
  }

  get varName(): string {
    return this._varname.value || "env";
  }

  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    try {
      const allEnvConfig = await this.getEnvironmentConfig();

      const filteredConfig = Object.entries(allEnvConfig).reduce(
        (acc, [key, value]) => {
          if (
            key.startsWith("VITE_") ||
            key.startsWith("REACT_APP_") ||
            key === "PUBLIC_URL"
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const result = await this.fileHandler.outputEnvironmentFile(
        this.dir,
        this.fileName,
        filteredConfig,
        this.varName
      );

      if (!result.success) {
        throw result.error || new Error("Failed to write environment file");
      }

      console.log(`Successfully created environment file at: ${result.path}`);
    } catch (error) {
      console.error(
        "Failed to execute set motion:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
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
