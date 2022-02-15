import fs from "fs-extra";
import child_process from "child_process";
import Mustache from "mustache";

const [configPath] = process.argv.slice(2);

if (!configPath) {
  throw new Error("Config path not set for set-env-vars-circleci");
}

const { preferencesTemplatePath, envVarListPath } = fs.readJSONSync(configPath);

const templateFile = fs.readFileSync(preferencesTemplatePath, {
  encoding: "utf8",
});

const renderedTemplate = Mustache.render(templateFile, {});

fs.outputFileSync("./preferences.arc", renderedTemplate);

const ENV_KEYS = fs.readJsonSync(envVarListPath);

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

fs.outputFileSync("./.env", envFileString);
