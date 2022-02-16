import minimist from "minimist";
import { tsToZod } from "../src/ts-to-zod";

async function main() {
  const args = minimist(process.argv.slice(2));

  const cwd = process.cwd();
  const { interfaces, out } = args;

  console.log({ args });
  console.log({ interfaces, out });

  if (!interfaces) {
    throw new Error("A path to an interfaces file is required");
  }

  if (!out) {
    throw new Error("A path to an output file is required");
  }

  await tsToZod(interfaces, out);
}

main();
