import {
  CommandLineStringListParameter,
  CommandLineStringParameter,
} from "@rushstack/ts-command-line";
import type {
  EnvironmentProvider,
  FileOutputHandler,
} from "@/utils/motion.types";

import { EnvironmentUtils } from "@/utils/env.utils";
import { FileUtils } from "@/utils/file.utils";
import { SetMotion } from "../setMotion";

jest.mock("@/utils/env.utils");
jest.mock("@/utils/file.utils");

describe("SetMotion", () => {
  let mockEnvironmentProvider: jest.Mocked<EnvironmentProvider>;
  let mockFileHandler: jest.Mocked<FileOutputHandler>;
  let setMotion: SetMotion;

  beforeEach(() => {
    mockEnvironmentProvider = {
      getDotEnvConfig: jest.fn(),
      getReactEnvironmentConfig: jest.fn(),
    };
    mockFileHandler = {
      outputEnvironmentFile: jest.fn(),
    };
  });

  describe("constructor", () => {
    it("should initialize with default dependencies when none provided", () => {
      const motion = new SetMotion();
      expect(motion["environmentProvider"]).toBeInstanceOf(EnvironmentUtils);
      expect(motion["fileHandler"]).toBeInstanceOf(FileUtils);
    });

    it("should initialize with provided dependencies", () => {
      const motion = new SetMotion(mockEnvironmentProvider, mockFileHandler);
      expect(motion["environmentProvider"]).toBe(mockEnvironmentProvider);
      expect(motion["fileHandler"]).toBe(mockFileHandler);
    });

    it("should define required dir parameter correctly", () => {
      const motion = new SetMotion();
      const dirParam = motion["_dir"];

      expect(dirParam).toBeInstanceOf(CommandLineStringListParameter);
      expect(dirParam.required).toBe(true);
      expect(dirParam.longName).toBe("--dir");
      expect(dirParam.shortName).toBe("-d");
      expect(dirParam.description).toBe(
        "Specify the location of your build folder"
      );
      expect(dirParam.argumentName).toBe("PATH_TO_BUILD_FOLDER");
    });

    it("should define required filename parameter correctly", () => {
      const motion = new SetMotion();
      const filenameParam = motion["_filename"];

      expect(filenameParam).toBeInstanceOf(CommandLineStringListParameter);
      expect(filenameParam.required).toBe(true);
      expect(filenameParam.longName).toBe("--name");
      expect(filenameParam.shortName).toBe("-n");
      expect(filenameParam.description).toBe(
        "Specify the name for the output env file"
      );
      expect(filenameParam.argumentName).toBe("NAME_OF_ENV_FILE");
    });

    it("should define optional varname parameter with default value correctly", () => {
      const motion = new SetMotion();
      const varnameParam = motion["_varname"];

      expect(varnameParam).toBeInstanceOf(CommandLineStringParameter);
      expect(varnameParam.required).toBe(false);
      expect(varnameParam.longName).toBe("--var");
      expect(varnameParam.shortName).toBe("-v");
      expect(varnameParam.argumentName).toBe("VAR_NAME");
      expect(varnameParam.defaultValue).toBe("env");
    });

    it("should set correct action metadata", () => {
      const motion = new SetMotion();

      // @ts-ignore - accessing protected property for testing
      expect(motion.actionName).toBe("set");
      // @ts-ignore - accessing protected property for testing
      expect(motion.summary).toBe(
        "Set environment variables into your React /build folder."
      );
      // @ts-ignore - accessing protected property for testing
      expect(motion.documentation).toBe(
        "Generates environment configuration file in the specified build directory"
      );
    });

    it("should maintain parameter independence between instances", () => {
      const motion1 = new SetMotion();
      const motion2 = new SetMotion();

      expect(motion1["_dir"]).not.toBe(motion2["_dir"]);
      expect(motion1["_filename"]).not.toBe(motion2["_filename"]);
      expect(motion1["_varname"]).not.toBe(motion2["_varname"]);
    });

    it("should handle undefined dependencies gracefully", () => {
      // @ts-ignore - Testing undefined scenario
      expect(() => new SetMotion(undefined, undefined)).not.toThrow();
    });

    it("should initialize with partial dependencies", () => {
      const motionWithEnvOnly = new SetMotion(mockEnvironmentProvider);
      expect(motionWithEnvOnly["environmentProvider"]).toBe(
        mockEnvironmentProvider
      );
      expect(motionWithEnvOnly["fileHandler"]).toBeInstanceOf(FileUtils);

      const motionWithFileOnly = new SetMotion(undefined, mockFileHandler);
      expect(motionWithFileOnly["environmentProvider"]).toBeInstanceOf(
        EnvironmentUtils
      );
      expect(motionWithFileOnly["fileHandler"]).toBe(mockFileHandler);
    });
  });
});
