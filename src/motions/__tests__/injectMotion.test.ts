import type {
  EnvironmentProvider,
  FileOutputHandler,
} from "@/utils/motion.types";

import { CommandLineStringParameter } from "@rushstack/ts-command-line";
import { EnvironmentUtils } from "@/utils/env.utils";
import { FileUtils } from "@/utils/file.utils";
import { InjectMotion } from "../injectMotion";

jest.mock("@/utils/env.utils");
jest.mock("@/utils/file.utils");
jest.mock("@rushstack/ts-command-line", () => ({
  CommandLineAction: class {
    protected defineStringParameter() {
      return {};
    }
  },
  CommandLineStringParameter: class {},
}));

describe("InjectMotion", () => {
  let mockEnvironmentProvider: jest.Mocked<EnvironmentProvider>;
  let mockFileHandler: jest.Mocked<FileOutputHandler>;
  let motion: InjectMotion;

  beforeEach(() => {
    mockEnvironmentProvider = {
      getDotEnvConfig: jest.fn(),
      getReactEnvironmentConfig: jest.fn(),
    };
    mockFileHandler = {
      executeBuildCommand: jest.fn(),
      outputEnvironmentFile: jest.fn(),
      copyFolder: jest.fn(),
      replaceFilesInDirectory: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default dependencies", () => {
      motion = new InjectMotion();
      expect(motion["environmentProvider"]).toBeInstanceOf(EnvironmentUtils);
      expect(motion["fileHandler"]).toBeInstanceOf(FileUtils);
    });

    it("should initialize with provided dependencies", () => {
      motion = new InjectMotion(mockEnvironmentProvider, mockFileHandler);
      expect(motion["environmentProvider"]).toBe(mockEnvironmentProvider);
      expect(motion["fileHandler"]).toBe(mockFileHandler);
    });

    it("should maintain parameter independence between instances", () => {
      const motion1 = new InjectMotion();
      const motion2 = new InjectMotion();

      expect(motion1["_dir"]).not.toBe(motion2["_dir"]);
      expect(motion1["_output"]).not.toBe(motion2["_output"]);
    });

    it("should handle undefined dependencies gracefully", () => {
      // @ts-ignore - Testing undefined scenario
      expect(() => new InjectMotion(undefined, undefined)).not.toThrow();
    });

    it("should initialize with partial dependencies", () => {
      const motionWithEnvOnly = new InjectMotion(mockEnvironmentProvider);
      expect(motionWithEnvOnly["environmentProvider"]).toBe(
        mockEnvironmentProvider
      );
      expect(motionWithEnvOnly["fileHandler"]).toBeInstanceOf(FileUtils);

      const motionWithFileOnly = new InjectMotion(undefined, mockFileHandler);
      expect(motionWithFileOnly["environmentProvider"]).toBeInstanceOf(
        EnvironmentUtils
      );
      expect(motionWithFileOnly["fileHandler"]).toBe(mockFileHandler);
    });

    it("should properly define all required parameters", () => {
      const spy = jest.spyOn(
        InjectMotion.prototype as any,
        "defineStringParameter"
      );
      motion = new InjectMotion();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          parameterLongName: "--dir",
          required: true,
        })
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          parameterLongName: "--output",
          required: false,
        })
      );
    });
  });
});
