import { CLIEnvironmentFormatter } from "@/utils/format.utils";

jest.mock("@/config/dynamic.config", () => ({
  DynamicConfig: {
    placeholder: "%%",
  },
}));

describe("CLIEnvironmentFormatter", () => {
  describe("constructor", () => {
    it("should initialize with default placeholder from DynamicConfig", () => {
      const formatter = new CLIEnvironmentFormatter();
      // @ts-ignore - accessing private property for testing
      expect(formatter.placeholder).toBe("%%");
    });

    it("should accept custom placeholder", () => {
      const customPlaceholder = "$$";
      const formatter = new CLIEnvironmentFormatter(customPlaceholder);
      // @ts-ignore - accessing private property for testing
      expect(formatter.placeholder).toBe("$$");
    });

    it("should use default placeholder when undefined is passed", () => {
      // @ts-ignore - testing undefined scenario
      const formatter = new CLIEnvironmentFormatter(undefined);
      // @ts-ignore - accessing private property for testing
      expect(formatter.placeholder).toBe("%%");
    });

    it("should handle empty string placeholder", () => {
      const formatter = new CLIEnvironmentFormatter("");
      // @ts-ignore - accessing private property for testing
      expect(formatter.placeholder).toBe("");
    });

    it("should verify placeholder usage in format method", () => {
      const customPlaceholder = "##";
      const formatter = new CLIEnvironmentFormatter(customPlaceholder);
      const environment = { TEST_VAR: "test" };

      expect(formatter.format(environment)).toBe("TEST_VAR=##TEST_VAR");
    });
  });
});
