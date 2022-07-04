import fs from "fs-extra";
import Mustache from "mustache";
import * as path from "path";
import { debug } from "@calatrava/utils";

export async function buildPreferencesFile(config: string) {
  try {
    const cwd = process.cwd();

    const {
      arc: { preferencesTemplatePath },
    } = fs.readJSONSync(path.resolve(cwd, config));

    const preferencesPath = path.resolve(cwd, "./preferences.arc");

    // prevent overriding existing preferences.arc
    if (!fs.existsSync(preferencesPath)) {
      const templateFile = fs.readFileSync(
        path.resolve(cwd, preferencesTemplatePath),
        {
          encoding: "utf8",
        }
      );
      const renderedTemplate = Mustache.render(templateFile, {});
      fs.outputFileSync(preferencesPath, renderedTemplate);
    }
  } catch (e: any) {
    debug("Build preferences File: Caught exception: ", e);
  }
}
