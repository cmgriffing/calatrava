import Mustache from "mustache";
import fs from "fs-extra";
import glob from "glob";
import path from "path";
import { debug } from "@calatrava/utils";

export async function buildArcFile(config: string) {
  try {
    const cwd = process.cwd();

    const {
      appName,
      baseDirectory,
      routesDirectory,
      tablesDirectory,
      tableIndexesDirectory,
      hasWebSocketSupport,
      awsConfigPath,
    } = fs.readJSONSync(path.resolve(cwd, config));

    debug("Build Arc File: Config values", {
      appName,
      baseDirectory,
      routesDirectory,
      tablesDirectory,
      tableIndexesDirectory,
      hasWebSocketSupport,
      awsConfigPath,
    });

    const routesString = concatenateArcFiles(routesDirectory);
    const tablesString = concatenateArcFiles(tablesDirectory);
    const tableIndexesString = concatenateArcFiles(tableIndexesDirectory);

    const awsString = fs.readFileSync(
      path.resolve(cwd, `${baseDirectory}/${awsConfigPath}`),
      {
        encoding: "utf8",
      }
    );

    const templateFile = fs.readFileSync(
      path.resolve(__dirname, "../app.template.arc"),
      {
        encoding: "utf8",
      }
    );

    const renderedTemplate = Mustache.render(
      templateFile,
      {
        appName,
        routes: routesString,
        tables: tablesString,
        tableIndexes: tableIndexesString,
        hasWebSocketSupport,
        aws: awsString,
      },
      undefined,
      ["👉", "👈"]
    );

    fs.outputFileSync(path.resolve(cwd, "./app.arc"), renderedTemplate);

    function concatenateArcFiles(directory: string) {
      const directoryPath = path.resolve(
        cwd,
        `${baseDirectory}/${directory}/*.arc`
      );

      debug("Build Arc File: concatenateArcFiles", {
        directory,
        directoryPath,
      });

      const arcFiles = glob.sync(directoryPath);

      let arcString = "";

      arcFiles.forEach((arcFile) => {
        const fileContents = fs.readFileSync(path.resolve(cwd, arcFile), {
          encoding: "utf8",
        });

        arcString += fileContents;
      });

      return arcString;
    }
  } catch (e: any) {
    debug("Build Arc File: Caught exception: ", e);
  }
}
