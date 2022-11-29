import * as tsToZodCore from "ts-to-zod";
import * as path from "path";
import * as fs from "fs-extra";

export async function tsToZod(
  interfaces: string,
  out: string,
  dependencyPaths: string[] = []
) {
  try {
    const cwd = process.cwd();

    const dependencyText = dependencyPaths
      .map((dependencyPath) => {
        const dependencyText = fs.readFileSync(
          path.resolve(cwd, dependencyPath),
          {
            encoding: "utf8",
          }
        );

        return dependencyText || "";
      })
      .join("\n")
      .trim();

    const sourceText = fs.readFileSync(path.resolve(cwd, interfaces), {
      encoding: "utf8",
    });

    if (!sourceText) {
      throw new Error("sourceText from interfaces file must not be empty");
    }

    const fullText = `
//----------Automatically Inserted for Zod Purposes------------
${dependencyText}
//----------End Insertion------------

${sourceText}

`;

    const { getZodSchemasFile } = tsToZodCore.generate({
      sourceText: fullText,
    });

    const outputPath = path.resolve(cwd, out);

    fs.ensureFileSync(outputPath);

    const relativeInterfacesPath = path
      .relative(outputPath, interfaces)
      .replace(".tsx", "")
      .replace(".ts", "");

    fs.outputFileSync(outputPath, getZodSchemasFile(relativeInterfacesPath));
  } catch (e) {
    console.log({ e });
  }
}
