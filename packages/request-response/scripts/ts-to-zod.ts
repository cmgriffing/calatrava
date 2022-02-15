import * as tsToZod from "ts-to-zod";
import minimist from "minimist";
import * as path from "path";
import * as fs from "fs-extra";

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

  const sourceText = fs.readFileSync(path.resolve(cwd, interfaces), {
    encoding: "utf8",
  });

  if (!sourceText) {
    throw new Error("sourceText from interfaces file must not be empty");
  }

  const { getZodSchemasFile, getIntegrationTestFile, errors } =
    tsToZod.generate({ sourceText });

  console.log({ getZodSchemasFile, getIntegrationTestFile, errors });

  console.log(getZodSchemasFile(""));

  const outputPath = path.resolve(cwd, out);

  fs.ensureFileSync(outputPath);

  const splitInterfacesPath = interfaces.split("/");
  const relativeInterfacesPath = `./${
    splitInterfacesPath[splitInterfacesPath.length - 1]
  }`
    .replace(".tsx", "")
    .replace(".ts", "");

  fs.outputFileSync(outputPath, getZodSchemasFile(relativeInterfacesPath));
}

main();
