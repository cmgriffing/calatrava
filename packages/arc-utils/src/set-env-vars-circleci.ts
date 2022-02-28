import fs from "fs-extra";
import child_process from "child_process";
import * as path from "path";

export async function setEnvVarsCircleCI(config: string) {
  const cwd = process.cwd();

  const { envVarListPath } = fs.readJSONSync(path.resolve(cwd, config));

  const ENV_KEYS = fs.readJsonSync(path.resolve(cwd, envVarListPath));

  const { CIRCLE_BRANCH } = process.env;

  let envFileString = "";

  ENV_KEYS.forEach((key: string) => {
    const value = process.env[`${CIRCLE_BRANCH?.toUpperCase() || ""}_${key}`];

    console.log("Setting ENV VAR: ", key);
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
}
