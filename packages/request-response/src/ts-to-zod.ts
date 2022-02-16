import * as tsToZodCore from "ts-to-zod";
import * as path from "path";
import * as fs from "fs-extra";

export async function tsToZod(interfaces: string, out: string) {
  const cwd = process.cwd();

  const sourceText = fs.readFileSync(path.resolve(cwd, interfaces), {
    encoding: "utf8",
  });

  if (!sourceText) {
    throw new Error("sourceText from interfaces file must not be empty");
  }

  const { getZodSchemasFile, getIntegrationTestFile, errors } =
    tsToZodCore.generate({ sourceText });

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
