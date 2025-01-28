import type {
  EnvironmentProvider,
  FileOutputHandler,
} from "@/utils/motion.types";

import { BuildMotion } from "@/motions/build.motion";
import { CommandLineRemainder } from "@rushstack/ts-command-line";
import { EnvironmentUtils } from "@/utils/env.utils";
import { FileUtils } from "@/utils/file.utils";
import { ParsingUtils } from "@/utils/parse.utils";

jest.mock("@/utils/env.utils");
jest.mock("@/utils/file.utils");
jest.mock("@/utils/parse.utils");

describe("BuildMotion", () => {
  let mockEnvironmentProvider: jest.Mocked<EnvironmentProvider>;
  let mockFileHandler: jest.Mocked<FileOutputHandler>;
  let mockParsingUtils: jest.Mocked<ParsingUtils>;
  let buildMotion: BuildMotion;

  beforeEach(() => {
    mockEnvironmentProvider = {
      getDotEnvConfig: jest.fn(),
      getReactEnvironmentConfig: jest.fn(),
    };
    mockFileHandler = {
      outputEnvironmentFile: jest.fn(),
      copyFolder: jest.fn(),
      replaceFilesInDirectory: jest.fn(),
      executeBuildCommand: jest.fn(),
    };
    mockParsingUtils = jest.mocked(
      new ParsingUtils()
    ) as jest.Mocked<ParsingUtils>;

    mockParsingUtils.parseCommand.mockImplementation(jest.fn());
    mockParsingUtils.parseBoolean.mockImplementation(jest.fn());
    mockParsingUtils.validateCommand.mockImplementation(jest.fn());
    mockParsingUtils.validateDotEnvExists.mockImplementation(jest.fn());

    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default dependencies", () => {
      buildMotion = new BuildMotion();
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["environmentProvider"]).toBeInstanceOf(
        EnvironmentUtils
      );
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["fileHandler"]).toBeInstanceOf(FileUtils);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["parsingUtils"]).toBeInstanceOf(ParsingUtils);
    });

    it("should initialize with provided dependencies", () => {
      buildMotion = new BuildMotion(
        mockEnvironmentProvider,
        mockFileHandler,
        mockParsingUtils
      );
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["environmentProvider"]).toBe(mockEnvironmentProvider);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["fileHandler"]).toBe(mockFileHandler);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(buildMotion["parsingUtils"]).toBe(mockParsingUtils);
    });

    it("should set correct action metadata", () => {
      buildMotion = new BuildMotion();
      // @ts-ignore - accessing protected property for testing
      expect(buildMotion.actionName).toBe("build");
      // @ts-ignore - accessing protected property for testing
      expect(buildMotion.summary).toBe(
        "Build your react app with placeholder variables"
      );
      // @ts-ignore - accessing protected property for testing
      expect(buildMotion.documentation).toBe(
        "Builds React application with environment variable placeholders"
      );
    });

    it("should define command remainder parameter correctly", () => {
      buildMotion = new BuildMotion();
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const commandParam = buildMotion["_command"];

      expect(commandParam).toBeInstanceOf(CommandLineRemainder);
      expect(commandParam).toMatchObject({
        description:
          "Enter your build command here (eg. `react-inject-env build npm run build`)",
      });
    });

    it("should maintain parameter independence between instances", () => {
      const motion1 = new BuildMotion();
      const motion2 = new BuildMotion();

      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motion1["_command"]).not.toBe(motion2["_command"]);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motion1["_dotEnvEnabled"]).not.toBe(motion2["_dotEnvEnabled"]);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motion1["_bypassVars"]).not.toBe(motion2["_bypassVars"]);
    });

    it("should handle undefined dependencies gracefully", () => {
      // @ts-ignore - Testing undefined scenario
      expect(
        () => new BuildMotion(undefined, undefined, undefined)
      ).not.toThrow();
    });

    it("should initialize with partial dependencies", () => {
      const motionWithEnvOnly = new BuildMotion(mockEnvironmentProvider);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithEnvOnly["environmentProvider"]).toBe(
        mockEnvironmentProvider
      );
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithEnvOnly["fileHandler"]).toBeInstanceOf(FileUtils);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithEnvOnly["parsingUtils"]).toBeInstanceOf(ParsingUtils);

      const motionWithFileOnly = new BuildMotion(undefined, mockFileHandler);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithFileOnly["environmentProvider"]).toBeInstanceOf(
        EnvironmentUtils
      );
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithFileOnly["fileHandler"]).toBe(mockFileHandler);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(motionWithFileOnly["parsingUtils"]).toBeInstanceOf(ParsingUtils);
    });
  });
});
