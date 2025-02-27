import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2021",
      dts: true,
    },
    {
      format: "cjs",
      syntax: "es2021",
    },
  ],
  source: {
    entry: {
      index: "src/index.ts",
      cli: "src/cli.ts",
      "inject.env": "src/inject.env.ts",
      environment: "src/environment.ts",
    },
  },
  output: {
    cleanDistPath: true,
    sourceMap: true,
  },
});
