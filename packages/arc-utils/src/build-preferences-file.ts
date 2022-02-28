import fs from "fs-extra";
import Mustache from "mustache";
import * as path from "path";

export async function buildPreferencesFile(config: string) {
  const cwd = process.cwd();

  const { preferencesTemplatePath } = fs.readJSONSync(
    path.resolve(cwd, config)
  );

  const templateFile = fs.readFileSync(
    path.resolve(cwd, preferencesTemplatePath),
    {
      encoding: "utf8",
    }
  );

  const renderedTemplate = Mustache.render(templateFile, {});

  fs.outputFileSync(path.resolve(cwd, "./preferences.arc"), renderedTemplate);
}
