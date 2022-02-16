import * as minimist from "minimist";
import { setEnvVarsCircleCI } from "../src/set-env-vars-circleci";

async function main() {
  const args = minimist(process.argv.slice(2));

  const { config } = args;

  if (!config) {
    throw new Error("Config path not set for set-env-vars-circleci");
  }

  await setEnvVarsCircleCI(config);
}

main();
