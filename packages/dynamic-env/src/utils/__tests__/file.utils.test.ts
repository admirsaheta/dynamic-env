import { RegexReplacementStrategy } from "@/utils/file.utils";
import type { ReplacementPattern } from "@/types/file.types";

describe("RegexReplacementStrategy", () => {
  let strategy: RegexReplacementStrategy;
  const consoleSpy = jest.spyOn(console, "warn");

  beforeEach(() => {
    strategy = new RegexReplacementStrategy();
    consoleSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return original content when content is empty", () => {
    const patterns: ReplacementPattern = {
      from: [/test/g],
      to: ["replacement"],
    };
    expect(strategy.replace("", patterns)).toBe("");
  });

  it("should return original content when patterns.from is empty", () => {
    const patterns: ReplacementPattern = {
      from: [],
      to: [],
    };
    expect(strategy.replace("test content", patterns)).toBe("test content");
  });

  it("should return original content when patterns lengths do not match", () => {
    const patterns: ReplacementPattern = {
      from: [/test/g],
      to: [],
    };
    expect(strategy.replace("test content", patterns)).toBe("test content");
  });

  it("should replace content using RegExp patterns", () => {
    const patterns: ReplacementPattern = {
      from: [/test/g, /content/g],
      to: ["replaced", "text"],
    };
    expect(strategy.replace("test content", patterns)).toBe("replaced text");
  });

  it("should handle multiple occurrences of the same pattern", () => {
    const patterns: ReplacementPattern = {
      from: [/test/g],
      to: ["replaced"],
    };
    expect(strategy.replace("test test test", patterns)).toBe(
      "replaced replaced replaced"
    );
  });

  it("should use empty string for undefined replacements", () => {
    const patterns: ReplacementPattern = {
      from: [/test/g],
      // @ts-ignore - Testing undefined scenario
      to: [undefined],
    };
    expect(strategy.replace("test content", patterns)).toBe(" content");
  });

  it("should handle invalid regex patterns and log warning", () => {
    const patterns: ReplacementPattern = {
      // @ts-ignore - Testing invalid pattern scenario
      from: ["["],
      to: ["replacement"],
    };

    const result = strategy.replace("test content", patterns);

    expect(result).toBe("test content");
    expect(consoleSpy).toHaveBeenCalledWith("Invalid replacement pattern: [");
  });

  it("should handle complex regex patterns", () => {
    const patterns: ReplacementPattern = {
      from: [/\b\w+@\w+\.\w+\b/g],
      to: ["[EMAIL]"],
    };
    expect(
      strategy.replace(
        "Contact us at test@example.com or support@test.com",
        patterns
      )
    ).toBe("Contact us at [EMAIL] or [EMAIL]");
  });
});
