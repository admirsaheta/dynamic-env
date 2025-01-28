import { BuildMotion } from "@/motions/build.motion";
import { CommandLineParser } from "@rushstack/ts-command-line";
import { DynamicConfig } from "@/config/dynamic.config";
import { InjectMotion } from "@/motions/inject.motion";
import { SetMotion } from "@/motions/set.motion";

export class InjectEnvCommandLine extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: DynamicConfig.name,
      toolDescription:
        "This tool is used to inject environment variables into your react /build folder.",
    });

    this.addAction(new BuildMotion());
    this.addAction(new InjectMotion());
    this.addAction(new SetMotion());
  }

  protected onDefineParameters(): void {}

  protected onExecute(): Promise<void> {
    return super.onExecute();
  }
}
