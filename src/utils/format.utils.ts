import type {
  CommandFormatter,
  EnvironmentFormatter,
} from "@/types/format.types";

import { DynamicConfig } from "@/config/dynamic.config";

export interface FormatProtocol {
  formatEnvironmentToCLIString(environment: Record<string, string>): string;
  formatEnvironmentCommand(
    environment: Record<string, string>,
    command: string
  ): string;
}

export class CLIEnvironmentFormatter implements EnvironmentFormatter {
  constructor(
    private readonly placeholder: string = DynamicConfig.placeholder
  ) {}

  public format(environment: Record<string, string>): string {
    return Object.entries(environment)
      .map(([key]) => `${key}=${this.placeholder}${key}`)
      .join(" ");
  }
}

export class CLICommandFormatter implements CommandFormatter {
  constructor(private readonly environmentFormatter: EnvironmentFormatter) {}

  public format(environment: Record<string, string>, command: string): string {
    const envString = this.environmentFormatter.format(environment);
    return `${envString} ${command}`.trim();
  }
}

export class FormatUtils implements FormatProtocol {
  private readonly environmentFormatter: EnvironmentFormatter;
  private readonly commandFormatter: CommandFormatter;

  constructor(
    environmentFormatter: EnvironmentFormatter = new CLIEnvironmentFormatter(),
    commandFormatter?: CommandFormatter
  ) {
    this.environmentFormatter = environmentFormatter;
    this.commandFormatter =
      commandFormatter || new CLICommandFormatter(environmentFormatter);
  }

  public formatEnvironmentToCLIString(
    environment: Record<string, string>
  ): string {
    return this.environmentFormatter.format(environment);
  }

  public formatEnvironmentCommand(
    environment: Record<string, string>,
    command: string
  ): string {
    return this.commandFormatter.format(environment, command);
  }
}
