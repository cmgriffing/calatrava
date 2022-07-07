#!/usr/bin/env node
import Yargs, { Argv } from "yargs";
import React from "react";
import { render } from "ink";
import { CLI } from "./init";
import child_process from "child_process";
import path from "path";
import * as fs from "fs-extra";
import { buildOpenApiYaml, tsToZod } from "@calatrava/request-response";
import { buildEmailTemplates, EmailProvider } from "@calatrava/email";
import { CalatravaConfiguration } from "./calatrava-config";
import {
  buildArcFile,
  buildPreferencesFile,
  copyShared,
  renameIndexFiles,
} from "@calatrava/arc-utils";
import { debug } from "@calatrava/utils";

const cwd = process.cwd();
Yargs.scriptName("calatrava")
  .usage("$0 <cmd> [args]")
  // init
  .command("init", "Initialize a new project", function (_argv: Argv) {
    debug("cwd", process.cwd());

    try {
      render(<CLI />);
    } catch (e) {
      debug("CLI init: Caught exception: ", { e });
    }
  })
  // env
  .command("env", "Get Architect env variables", function (_argv: Argv) {
    try {
      const child = child_process.execSync("FORCE_COLOR=1 npx arc env", {
        stdio: "pipe",
      });

      const output = child.toString();
      const lines = output
        .split("\n")
        .map((line) => {
          if (line.indexOf("  |") > -1 && line.indexOf("None found!") === -1) {
            const words = line.split(" ");
            const lastWord = words[words.length - 1];

            const wordWithoutColors = lastWord?.replace(
              new RegExp("(\\x1B\\[\\d.m)", "gm"),
              ""
            );

            const scrubbedWord = wordWithoutColors
              ?.split("")
              .map((character, index) => {
                if (index < wordWithoutColors.length - 4) {
                  return "*";
                } else {
                  return character;
                }
              })
              .join("");

            return line.replace(wordWithoutColors || "", scrubbedWord || "");
          }
          return line;
        })
        .join("\n");

      console.log(lines);
    } catch (e) {
      debug("CLI env: Caught exception: ", { e });
    }
  })
  // arc
  .command(
    "arc",
    "Build app.arc and preferences.arc",
    (yargs: any) => {
      yargs.positional("config", {
        type: "string",
        default: "./calatrava.config.json",
        describe: "the path to the Calatrava config file",
      });
    },
    async function (argv: any) {
      try {
        debug("CLI arc: building arc file");
        await buildArcFile(argv.config);
        debug("CLI arc: building preferences file");
        await buildPreferencesFile(argv.config);

        debug("CLI arc: running arc init");
        child_process.spawnSync(`arc`, ["init"], { cwd });

        debug("CLI arc: running copyShared");
        await copyShared();

        debug("CLI arc: running renameIndexFiles");
        await renameIndexFiles();
      } catch (e) {
        debug("CLI arc: Caught exception: ", { e });
      }
    }
  )
  // scaffold
  .command(
    "scaffold [config]",
    "Scaffold out the zod validators and openapi yaml file",
    (yargs: any) => {
      yargs.positional("config", {
        type: "string",
        default: "./calatrava.config.json",
        describe: "the path to the Calatrava config file",
      });
    },
    async function (argv: any) {
      try {
        const config = getConfig(argv);
        const {
          scaffolding: {
            requestSchemaPath,
            requestTypesPath,
            responseSchemaPath,
            responseTypesPath,
          },
          httpRoutesDirectory,
        } = config;

        // run ts-to-zod
        await tsToZod(requestTypesPath, requestSchemaPath);
        await tsToZod(responseTypesPath, responseSchemaPath);

        // run build-openapi-yaml
        await buildOpenApiYaml(
          requestTypesPath,
          responseTypesPath,
          httpRoutesDirectory
        );
      } catch (e) {
        debug("CLI init: Caught exception: ", { e });
      }
    }
  )
  // email
  .command(
    "email [config]",
    "Scaffolds email template id map and uploads missing templates to provider",
    (yargs: any) => {
      yargs.positional("config", {
        type: "string",
        default: "./calatrava.config.json",
        describe: "the path to the Calatrava config file",
      });
    },
    async function (argv: any) {
      try {
        const config = getConfig(argv);

        const {
          email: {
            provider,
            templateJsonPath,
            templateEnumPath,
            templateIdPath,
            mjmlDirectory,
          },
        } = config;
        // validate relevant paths making sure they exist

        // call email script
        await buildEmailTemplates(
          provider as EmailProvider,
          templateJsonPath,
          mjmlDirectory,
          templateIdPath,
          templateEnumPath
        );
      } catch (e) {
        debug("CLI scaffold: Caught exception: ", { e });
      }
    }
  )
  .help().argv;

function getConfig(argv: any): CalatravaConfiguration {
  const configPath = path.resolve(cwd, argv.config);

  if (!fs.existsSync(configPath)) {
    console.error("Config file must exist at configPath: ", configPath);
    process.exit(-1);
  }

  // validate config (eventually)

  // return config
  return fs.readJSONSync(configPath);
}
