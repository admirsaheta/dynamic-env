import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineRemainder,
  CommandLineStringListParameter,
} from "@rushstack/ts-command-line";
import type {
  EnvironmentProvider,
  FileOutputHandler,
} from "@/utils/motion.types";

import { EnvironmentUtils } from "@/utils/env.utils";
import { FileUtils } from "@/utils/file.utils";
import { ParsingUtils } from "@/utils/parse.utils";

export interface BuildParameters {
  command: string;
  dotEnvEnabled: boolean;
  bypassVars: string[];
}

export class BuildMotion extends CommandLineAction implements BuildParameters {
  private readonly _command: CommandLineRemainder;
  private readonly _dotEnvEnabled: CommandLineChoiceParameter;
  private readonly _bypassVars: CommandLineStringListParameter;

  private readonly environmentProvider: EnvironmentProvider;
  private readonly fileHandler: FileOutputHandler;
  private readonly parsingUtils: ParsingUtils;

  constructor(
    environmentProvider: EnvironmentProvider = new EnvironmentUtils(),
    fileHandler: FileOutputHandler = new FileUtils(),
    parsingUtils: ParsingUtils = new ParsingUtils()
  ) {
    super({
      actionName: "build",
      summary: "Build your react app with placeholder variables",
      documentation:
        "Builds React application with environment variable placeholders",
    });

    this.environmentProvider = environmentProvider;
    this.fileHandler = fileHandler;
    this.parsingUtils = parsingUtils;

    this._command = this.defineCommandLineRemainder({
      description:
        "Enter your build command here (eg. `react-inject-env build npm run build`)",
    });

    this._dotEnvEnabled = this.defineChoiceParameter({
      parameterLongName: "--dotenv",
      description: "Automatically reads from .env file in /root folder",
      alternatives: ["true", "false"],
      defaultValue: "true",
      required: false,
    });

    this._bypassVars = this.defineStringListParameter({
      parameterLongName: "--bypass",
      description:
        "Environment variables to use directly without substituting placeholders",
      argumentName: "ENV_VARIABLE_NAME",
      required: false,
    });
  }

  get command(): string {
    return this.parsingUtils.parseCommand(this._command.values);
  }

  get dotEnvEnabled(): boolean {
    return this.parsingUtils.parseBoolean(this._dotEnvEnabled.value || "true");
  }

  get bypassVars(): string[] {
    return [...this._bypassVars.values];
  }

  protected onDefineParameters(): void {}

  protected async onExecute(): Promise<void> {
    try {
      const envConfig = await this.getEnvironmentConfig();
      const filteredConfig = this.filterBypassVariables(envConfig);

      const result = await this.fileHandler.executeBuildCommand(
        this.command,
        filteredConfig,
        [...this.bypassVars]
      );

      if (!result.success) {
        throw result.error || new Error("Build command failed");
      }

      console.log(`Successfully executed build command: ${this.command}`);
    } catch (error) {
      console.error(
        "Failed to execute build motion:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  private async getEnvironmentConfig(): Promise<Record<string, string>> {
    try {
      const config: Record<string, string> = {};

      if (this.dotEnvEnabled) {
        Object.assign(config, this.environmentProvider.getDotEnvConfig());
      }

      Object.assign(
        config,
        this.environmentProvider.getReactEnvironmentConfig()
      );
      return config;
    } catch (error) {
      throw new Error(
        `Failed to load environment configuration: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private filterBypassVariables(
    config: Record<string, string>
  ): Record<string, string> {
    const filtered: Record<string, string> = { ...config };
    this.bypassVars.forEach((key) => delete filtered[key]);
    return filtered;
  }
}
