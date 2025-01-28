import { DefaultEnvValidator } from "@/utils/parse.utils";

describe("DefaultEnvValidator", () => {
  let validator: DefaultEnvValidator;

  beforeEach(() => {
    validator = new DefaultEnvValidator();
  });

  describe("validate", () => {
    it("should validate and return valid environment object", () => {
      const validEnv = {
        API_KEY: "secret123",
        DEBUG: "true",
        PORT: "3000",
      };

      const result = validator.validate(validEnv);
      expect(result).toEqual(validEnv);
    });

    it("should throw error for null input", () => {
      expect(() => {
        validator.validate(null);
      }).toThrow(new TypeError("dotenv file not found"));
    });

    it("should throw error for undefined input", () => {
      expect(() => {
        validator.validate(undefined);
      }).toThrow(new TypeError("dotenv file not found"));
    });

    it("should throw error for non-object input", () => {
      const invalidInputs = ["string", 123, true, Symbol("test")];

      invalidInputs.forEach((input) => {
        expect(() => {
          validator.validate(input);
        }).toThrow(new TypeError("dotenv file not found"));
      });
    });

    it("should throw error when environment values are not strings", () => {
      const invalidEnv = {
        STRING_KEY: "valid",
        NUMBER_KEY: 123,
        BOOLEAN_KEY: true,
        OBJECT_KEY: {},
        NULL_KEY: null,
      };

      expect(() => {
        // @ts-ignore - Testing invalid types scenario
        validator.validate(invalidEnv);
      }).toThrow(
        new TypeError(
          "All environment values must be strings. Invalid keys: NUMBER_KEY, BOOLEAN_KEY, OBJECT_KEY, NULL_KEY"
        )
      );
    });

    it("should handle empty object", () => {
      const emptyEnv = {};
      const result = validator.validate(emptyEnv);
      expect(result).toEqual({});
    });

    it("should handle object with empty string values", () => {
      const envWithEmpty = {
        EMPTY_1: "",
        EMPTY_2: "",
      };
      const result = validator.validate(envWithEmpty);
      expect(result).toEqual(envWithEmpty);
    });

    it("should preserve original object structure", () => {
      const complexEnv = {
        SPACES: "  value with spaces  ",
        SPECIAL: "!@#$%^&*()",
        MULTILINE: "line1\nline2",
        UNICODE: "🚀✨",
      };

      const result = validator.validate(complexEnv);
      expect(result).toEqual(complexEnv);
    });

    it("should throw error for mixed valid and invalid values", () => {
      const mixedEnv = {
        VALID_1: "string",
        INVALID_1: 123,
        VALID_2: "another string",
        INVALID_2: false,
      };

      expect(() => {
        // @ts-ignore - Testing invalid types scenario
        validator.validate(mixedEnv);
      }).toThrow(
        new TypeError(
          "All environment values must be strings. Invalid keys: INVALID_1, INVALID_2"
        )
      );
    });
  });
});
