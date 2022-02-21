#!/usr/bin/env node
import Yargs, { Argv } from "yargs";
import React from "react";
import { render } from "ink";
import { CLI } from "./init";
import child_process from "child_process";
import path from "path";
import * as fs from "fs-extra";
import { buildOpenApiYaml, tsToZod } from "@calatrava/request-response";
import { CalatravaConfiguration } from "./calatrava-config";

const cwd = process.cwd();

(
  Yargs.scriptName("calatrava")
    .usage("$0 <cmd> [args]")
    .command("init", "Initialize a new project", function (_argv: Argv) {
      render(<CLI />);
    })
    .command("env", "Get Architect env variables", function (_argv: Argv) {
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
    }) as any
)
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
        // let config = argv.config;
        console.log("config", argv.config);
        const configPath = path.resolve(cwd, argv.config);
        console.log({ configPath });

        if (!fs.existsSync(configPath)) {
          console.error("config file must exist at configPath: ", configPath);
          process.exit(-1);
        }

        // validate config (eventually)

        const config: CalatravaConfiguration = fs.readJSONSync(configPath);

        console.log({ config });

        // run ts-to-zod
        await tsToZod(config.requestTypesPath, config.requestSchemaPath);
        await tsToZod(config.responseTypesPath, config.responseSchemaPath);

        // run build-openapi-yaml
        await buildOpenApiYaml(
          config.requestTypesPath,
          config.responseTypesPath,
          config.httpRoutesDirectory
        );
      } catch (e) {
        console.log({ e });
      }
    }
  )
  .help().argv;
