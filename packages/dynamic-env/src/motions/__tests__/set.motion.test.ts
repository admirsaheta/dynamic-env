
describe("CommandLine Mocks", () => {
  const mockFactory = () => {
    return {
      CommandLineAction: class {
        protected actionName: string;
        protected summary: string;
        protected documentation: string;

        constructor(options: {
          actionName: string;
          summary: string;
          documentation: string;
        }) {
          this.actionName = options.actionName;
          this.summary = options.summary;
          this.documentation = options.documentation;
        }

        protected defineStringParameter(options: any) {
          return new (jest.fn(() => ({
            ...options,
            value: undefined,
            values: [],
          })))();
        }
      },
      CommandLineStringParameter: class {
        constructor(options: any) {
          Object.assign(this, options);
        }
      },
    };
  };

  describe("MockCommandLineAction", () => {
    it("should properly initialize with provided options", () => {
      const { CommandLineAction: MockCommandLineAction } = mockFactory();
      const options = {
        actionName: "test-action",
        summary: "test summary",
        documentation: "test documentation",
      };

      const action = new MockCommandLineAction(options);

      // @ts-ignore - accessing protected properties for testing
      expect(action.actionName).toBe(options.actionName);
      // @ts-ignore - accessing protected properties for testing
      expect(action.summary).toBe(options.summary);
      // @ts-ignore - accessing protected properties for testing
      expect(action.documentation).toBe(options.documentation);
    });

    it("should create parameter with correct structure", () => {
      const { CommandLineAction: MockCommandLineAction } = mockFactory();
      const action = new MockCommandLineAction({
        actionName: "test",
        summary: "test",
        documentation: "test",
      });

      const paramOptions = {
        description: "test description",
        parameterLongName: "--test",
        parameterShortName: "-t",
        argumentName: "TEST_ARG",
        required: true,
      };

      // @ts-ignore - accessing protected method for testing
      const parameter = action.defineStringParameter(paramOptions);

      expect(parameter).toMatchObject({
        ...paramOptions,
        value: undefined,
        values: [],
      });
    });

    it("should handle empty options in defineStringParameter", () => {
      const { CommandLineAction: MockCommandLineAction } = mockFactory();
      const action = new MockCommandLineAction({
        actionName: "test",
        summary: "test",
        documentation: "test",
      });

      // @ts-ignore - accessing protected method for testing
      const parameter = action.defineStringParameter({});

      expect(parameter).toMatchObject({
        value: undefined,
        values: [],
      });
    });
  });

  describe("MockCommandLineStringParameter", () => {
    it("should initialize with provided options", () => {
      const { CommandLineStringParameter: MockCommandLineStringParameter } =
        mockFactory();
      const options = {
        description: "test description",
        parameterLongName: "--test",
        parameterShortName: "-t",
        argumentName: "TEST_ARG",
        required: true,
      };

      const parameter = new MockCommandLineStringParameter(options);

      expect(parameter).toMatchObject(options);
    });

    it("should handle empty options", () => {
      const { CommandLineStringParameter: MockCommandLineStringParameter } =
        mockFactory();
      const parameter = new MockCommandLineStringParameter({});

      expect(parameter).toMatchObject({});
    });

    it("should handle partial options", () => {
      const { CommandLineStringParameter: MockCommandLineStringParameter } =
        mockFactory();
      const options = {
        description: "test description",
        required: false,
      };

      const parameter = new MockCommandLineStringParameter(options);

      expect(parameter).toMatchObject(options);
      expect(parameter).not.toHaveProperty("parameterLongName");
      expect(parameter).not.toHaveProperty("parameterShortName");
    });
  });

  describe("Mock Factory", () => {
    it("should return new instances each time", () => {
      const mock1 = mockFactory();
      const mock2 = mockFactory();

      expect(mock1).not.toBe(mock2);
      expect(mock1.CommandLineAction).not.toBe(mock2.CommandLineAction);
      expect(mock1.CommandLineStringParameter).not.toBe(
        mock2.CommandLineStringParameter
      );
    });

    it("should maintain class independence", () => {
      const { CommandLineAction: Action1 } = mockFactory();
      const { CommandLineAction: Action2 } = mockFactory();

      const action1 = new Action1({
        actionName: "test1",
        summary: "test1",
        documentation: "test1",
      });
      const action2 = new Action2({
        actionName: "test2",
        summary: "test2",
        documentation: "test2",
      });

      // @ts-ignore - accessing protected properties for testing
      expect(action1.actionName).toBe("test1");
      // @ts-ignore - accessing protected properties for testing
      expect(action2.actionName).toBe("test2");
    });
  });
});
