import minimist from "minimist";
import { scaffoldBoilerplate } from "../src/scaffold-boilerplate";

async function main() {
  const args = minimist(process.argv.slice(2));

  const { name, description, hasWebSocketSupport, outputFolder } = args;

  // if (!config) {
  //   throw new Error("Config path not set for scaffold-boilerplate");
  // }

  await scaffoldBoilerplate({
    name,
    description,
    hasWebSocketSupport,
    outputFolder,
  });
}

main();
