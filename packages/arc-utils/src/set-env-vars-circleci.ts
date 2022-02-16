import fs from "fs-extra";
import child_process from "child_process";
import Mustache from "mustache";
import * as path from "path";

export async function setEnvVarsCircleCI(config: string) {
  const { preferencesTemplatePath, envVarListPath } = fs.readJSONSync(config);

  const cwd = process.cwd();

  const templateFile = fs.readFileSync(
    path.resolve(cwd, preferencesTemplatePath),
    {
      encoding: "utf8",
    }
  );

  const renderedTemplate = Mustache.render(templateFile, {});

  fs.outputFileSync(path.resolve(cwd, "./preferences.arc"), renderedTemplate);

  const ENV_KEYS = fs.readJsonSync(path.resolve(cwd, envVarListPath));

  const { CIRCLE_BRANCH } = process.env;

  let envFileString = "";

  ENV_KEYS.forEach((key) => {
    const value = process.env[`${CIRCLE_BRANCH.toUpperCase()}_${key}`];

    console.log("Setting ENV VAR: ", key);
    const addedKeyResult = child_process.spawnSync(`arc`, [
      "env",
      CIRCLE_BRANCH,
      key,
      value,
    ]);

    envFileString += `${key}=${value}\n`;
  });

  child_process.spawnSync(`arc`, ["env"]);

  fs.outputFileSync(path.resolve(cwd, "./.env"), envFileString);
}
