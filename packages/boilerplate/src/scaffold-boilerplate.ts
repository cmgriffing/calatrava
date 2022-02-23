import Case from "case";
import fs from "fs-extra";
import glob from "glob";
import path from "path";
import Mustache from "mustache";

export async function scaffoldBoilerplate({
  name,
  hasWebSocketSupport,
  outputFolder,
  description,
}: {
  name: string;
  hasWebSocketSupport: boolean;
  outputFolder: string;
  description: string;
}) {
  const cwd = process.cwd();

  const packageName = Case.kebab(name);
  const titleName = Case.title(name);
  const camelName = Case.camel(name);

  const globConfig: glob.IOptions = {
    nodir: true,
  };

  if (!hasWebSocketSupport) {
    globConfig.ignore = "**/websocket/*";
  }

  // crawl template folder, injecting values as needed
  const templateLocation = path.resolve(__dirname, "../template/**/*");
  console.log({ templateLocation });

  glob
    .sync(path.resolve(__dirname, "../template/**/*"), globConfig)
    .forEach((file) => {
      const fileContents = fs.readFileSync(file, { encoding: "utf8" });

      const parsedFile = Mustache.render(
        fileContents,
        {
          hasWebSocketSupport,
          packageName,
          description,
          titleName,
          camelName,
        },
        undefined,
        ["👉", "👈"]
      );

      const [_, innerPath] = file.split("/template/");

      if (innerPath) {
        const newFilePath = path.resolve(cwd, outputFolder, innerPath);

        fs.ensureFileSync(newFilePath);

        fs.outputFileSync(newFilePath, parsedFile);
      }
    });
}
