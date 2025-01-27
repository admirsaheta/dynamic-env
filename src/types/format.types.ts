export interface EnvironmentFormatter {
  format(environment: Record<string, string>): string;
}

export interface CommandFormatter {
  format(environment: Record<string, string>, command: string): string;
}
