import type {
  BooleanValidator,
  CommandParser,
  CommandValidator,
  EnvValidator,
} from "@/types/parse.types";

export interface ParsingProtocol {
  validateDotEnvExists(param: unknown): Record<string, string>;
  validateCommand(command: string): string;
  parseCommand(params: string[] | readonly string[]): string;
  parseBoolean(param: string): boolean;
}

export class DefaultEnvValidator implements EnvValidator {
  public validate(param: unknown): Record<string, string> {
    if (typeof param !== "object" || param === null) {
      throw new TypeError("dotenv file not found");
    }

    const envObject = param as Record<string, string>;
    const invalidValues = Object.entries(envObject).filter(
      ([_, value]) => typeof value !== "string"
    );

    if (invalidValues.length > 0) {
      const invalidKeys = invalidValues.map(([key]) => key).join(", ");
      throw new TypeError(
        `All environment values must be strings. Invalid keys: ${invalidKeys}`
      );
    }

    return envObject;
  }
}

export class DefaultCommandValidator implements CommandValidator {
  public validate(command: string): string {
    if (typeof command !== "string" || !command.trim()) {
      throw new TypeError(`Command must be valid: ${command}`);
    }
    return command.trim();
  }
}

export class DefaultBooleanValidator implements BooleanValidator {
  private readonly validValues = new Set(["true", "false"]);

  public validate(param: string): boolean {
    if (!this.validValues.has(param)) {
      throw new TypeError(`Expected 'true' or 'false', received: ${param}`);
    }
    return param === "true";
  }
}

export class DefaultCommandParser implements CommandParser {
  constructor(private readonly commandValidator: CommandValidator) {}

  public parse(params: string[] | readonly string[]): string {
    return this.commandValidator.validate(params.join(" "));
  }
}

// Main Implementation
export class ParsingUtils implements ParsingProtocol {
  constructor(
    private readonly envValidator: EnvValidator = new DefaultEnvValidator(),
    private readonly commandValidator: CommandValidator = new DefaultCommandValidator(),
    private readonly booleanValidator: BooleanValidator = new DefaultBooleanValidator(),
    private readonly commandParser: CommandParser = new DefaultCommandParser(
      new DefaultCommandValidator()
    )
  ) {}

  public validateDotEnvExists(param: unknown): Record<string, string> {
    return this.envValidator.validate(param);
  }

  public validateCommand(command: string): string {
    return this.commandValidator.validate(command);
  }

  public parseCommand(params: string[] | readonly string[]): string {
    return this.commandParser.parse(params);
  }

  public parseBoolean(param: string): boolean {
    return this.booleanValidator.validate(param);
  }
}
