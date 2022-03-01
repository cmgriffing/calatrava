import fs from "fs-extra";
import child_process from "child_process";
import * as path from "path";
import { debug } from "@calatrava/utils";

export async function setEnvVarsCircleCI(config: string) {
  try {
    const cwd = process.cwd();

    const { envVarListPath } = fs.readJSONSync(path.resolve(cwd, config));

    const ENV_KEYS = fs.readJsonSync(path.resolve(cwd, envVarListPath));

    const { CIRCLE_BRANCH } = process.env;

    let envFileString = "";

    ENV_KEYS.forEach((key: string) => {
      const value = process.env[`${CIRCLE_BRANCH?.toUpperCase() || ""}_${key}`];

      debug("Setting ENV VAR: ", key);
      child_process.spawnSync(`arc`, [
        "env",
        CIRCLE_BRANCH || "",
        key,
        value || "",
      ]);

      envFileString += `${key}=${value}\n`;
    });

    child_process.spawnSync(`arc`, ["env"]);

    fs.outputFileSync(path.resolve(cwd, "./.env"), envFileString);
  } catch (e: any) {
    debug("Build preferences File: Caught exception: ", e);
  }
}
