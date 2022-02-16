import Mustache from "mustache";
import fs from "fs-extra";
import glob from "glob";
import path from "path";

export async function buildArcFile(config: string) {
  const cwd = process.cwd();

  const {
    appName,
    baseDirectory,
    routesDirectory,
    tablesDirectory,
    tableIndexesDirectory,
    ws,
    awsConfigPath,
  } = fs.readJSONSync(config);

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

  const renderedTemplate = Mustache.render(templateFile, {
    appName,
    routes: routesString,
    tables: tablesString,
    tableIndexes: tableIndexesString,
    ws: ws ? "@ws" : "",
    aws: awsString,
  });

  fs.outputFileSync(path.resolve(cwd, "./app.arc"), renderedTemplate);

  function concatenateArcFiles(directory: string) {
    const arcFiles = glob.sync(
      path.resolve(cwd, `${baseDirectory}/${directory}/*.arc`)
    );

    let arcString = "";

    arcFiles.forEach((arcFile) => {
      const fileContents = fs.readFileSync(path.resolve(cwd, arcFile), {
        encoding: "utf8",
      });

      arcString += fileContents;
    });

    return arcString;
  }
}
