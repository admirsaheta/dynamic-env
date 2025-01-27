export interface EnvValidator {
  validate(param: unknown): Record<string, string>;
}

export interface CommandValidator {
  validate(command: string): string;
}

export interface BooleanValidator {
  validate(param: string): boolean;
}

export interface CommandParser {
  parse(params: string[] | readonly string[]): string;
}
