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
import * as Case from "case";

console.log("Hellooooo Mcflyyyyyyy");

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
  // gen-data-keys
  .command(
    "gen-data-keys [inFile] [outFile]",
    "Generate Maps for Data Keys for querying DynamoDB",
    (yargs: any) => {
      yargs
        .positional("inFile", {
          type: "string",
          describe:
            "the path to the JSON file that defines the mapping of keys to their tables and key types",
        })
        .positional("outFile", {
          type: "string",
          describe:
            "the path to the file that will contain the generated data key maps",
        });
      return yargs;
    },
    async function (argv: any) {
      try {
        console.log("Generating data key maps", argv);
        const inFile: string = argv.inFile;
        const outFile: string = argv.outFile;

        console.log("inFile: ", inFile);
        console.log("outFile: ", outFile);

        const tableKeyMappings: Record<
          string,
          Record<
            "partitionKey" | "sortKey" | "tertiaryKey" | "quaternaryKey",
            string[]
          >
        > = fs.readJSONSync(inFile, { encoding: "utf8" });

        const tableKeyMappingsOutput: string[] = Object.entries(
          tableKeyMappings
        ).map(([tableName, tableKeyMap]) => {
          return `
const ${Case.pascal(tableName)}KeyOrder = {
  partitionKey: [${tableKeyMap.partitionKey
    .map((keyValue) => `"${keyValue}"`)
    .join(", ")}],
  sortKey: [${tableKeyMap.sortKey
    .map((keyValue) => `"${keyValue}"`)
    .join(", ")}],
  tertiaryKey: [${
    tableKeyMap.tertiaryKey?.map((keyValue) => `"${keyValue}"`)?.join(", ") ||
    ""
  }],
  quaternaryKey: [${
    tableKeyMap.quaternaryKey?.map((keyValue) => `"${keyValue}"`)?.join(", ") ||
    ""
  }],
} as const

export const ${Case.pascal(tableName)}KeyMap = {
  ${Object.entries(tableKeyMap)
    .map(([keyType, keyNames]) => {
      return `  get${Case.pascal(keyType)}(keys: {
${keyNames
  .map((keyName) => {
    return `    ${keyName}: string`;
  })
  .join(",\n")}
  }): string {
    return createKeyString("${tableName}", ${Case.pascal(
        tableName
      )}KeyOrder["${keyType}"], keys);
  },`;
    })
    .join("\n")}
} as const;
          `;
        });

        const output = `import { createKeyString } from "@calatrava/datawrapper";
        
${tableKeyMappingsOutput.join("\n")}
`;
        // console.log(output);
        fs.outputFileSync(outFile, output);
      } catch (e) {
        debug("CLI init: Caught exception: ", { e });
        console.log("error: ", e);
      }
    }
  )
  // scaffold
  .command(
    "scaffold [config]",
    "Scaffold out the zod validators and openapi yaml file",
    (yargs: any) => {
      yargs
        .positional("config", {
          type: "string",
          default: "./calatrava.config.json",
          describe: "the path to the Calatrava config file",
        })
        .options({
          o: {
            alias: "out",
            describe: "output file name",
            type: "string",
            nargs: 1,
            default: "openapi.yaml",
          },
          p: {
            alias: "public",
            describe: "filter for public endpoints",
            type: "boolean",
            nargs: 1,
            default: false,
            // also: count:true, requiresArg:true
          },
          u: {
            alias: "url",
            describe: "the base url of the api",
            type: "string",
            nargs: 1,
            default: "http://localhost",
          },
        });

      return yargs;
    },
    async function (argv: any) {
      try {
        const isPublic: boolean = argv.p;
        const baseUrl: string = argv.u;
        const outputFile: string = argv.o;

        const config = getConfig(argv);
        const {
          scaffolding: {
            dependencyTypesPath,
            requestSchemaPath,
            requestTypesPath,
            responseSchemaPath,
            responseTypesPath,
          },
          httpRoutesDirectory,
        } = config;

        // run ts-to-zod
        await tsToZod(requestTypesPath, requestSchemaPath, dependencyTypesPath);
        await tsToZod(
          responseTypesPath,
          responseSchemaPath,
          dependencyTypesPath
        );

        // run build-openapi-yaml for both types (public/private)
        await buildOpenApiYaml(
          requestTypesPath,
          responseTypesPath,
          httpRoutesDirectory,
          "0.0.0",
          "",
          "",
          outputFile,
          isPublic,
          baseUrl
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
