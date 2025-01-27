import { EnvironmentUtils } from "../env.utils";

describe("EnvironmentUtils", () => {
  describe("getReactEnvironmentConfig", () => {
    it("should return React and Vite environment variables", () => {
      const mockEnv = {
        REACT_APP_API_URL: "http://api.example.com",
        VITE_APP_NAME: "test-app",
        PUBLIC_URL: "/public",
        OTHER_VAR: "ignored",
      };

      const envUtils = new EnvironmentUtils(mockEnv);
      const result = envUtils.getReactEnvironmentConfig();

      expect(result).toEqual({
        REACT_APP_API_URL: "http://api.example.com",
        VITE_APP_NAME: "test-app",
        PUBLIC_URL: "/public",
      });
    });

    it("should filter out undefined and null values", () => {
      const mockEnv: NodeJS.ProcessEnv = {
        REACT_APP_API_KEY: "secret",
        VITE_UNDEFINED: undefined,
        PUBLIC_URL: "/public",
      };

      const envUtils = new EnvironmentUtils(mockEnv);
      const result = envUtils.getReactEnvironmentConfig();

      expect(result).toEqual({
        REACT_APP_API_KEY: "secret",
        PUBLIC_URL: "/public",
      });
    });

    it("should return an empty object when no matching variables exist", () => {
      const mockEnv = {
        OTHER_VAR1: "value1",
        OTHER_VAR2: "value2",
      };

      const envUtils = new EnvironmentUtils(mockEnv);
      const result = envUtils.getReactEnvironmentConfig();

      expect(result).toEqual({});
    });

    it("should return frozen object", () => {
      const mockEnv = {
        REACT_APP_API_URL: "http://api.example.com",
      };

      const envUtils = new EnvironmentUtils(mockEnv);
      const result = envUtils.getReactEnvironmentConfig();

      expect(Object.isFrozen(result)).toBe(true);
    });

    it("should throw error when processEnv is not available", () => {
      expect(() => {
        // @ts-ignore
        new EnvironmentUtils(null);
      }).toThrow("DynamicEnv: Process environment is not available");
    });
  });
});
