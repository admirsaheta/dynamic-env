#!/usr/bin/env node

import { InjectEnvCommandLine } from "@/inject.env";

const commandLine = new InjectEnvCommandLine();

commandLine.executeAsync();
