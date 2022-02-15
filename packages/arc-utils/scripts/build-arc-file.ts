import Mustache from "mustache";
import fs from "fs-extra";
import glob from "glob";
import path from "path";

const [configPath] = process.argv.slice(2);

if (!configPath) {
  throw new Error("Config path not set for set-env-vars-circleci");
}

const {
  appName,
  baseDirectory,
  routesDirectory,
  tablesDirectory,
  tableIndexesDirectory,
  ws,
  awsConfigPath,
} = fs.readJSONSync(configPath);

const routesString = concatenateArcFiles(routesDirectory);
const tablesString = concatenateArcFiles(tablesDirectory);
const tableIndexesString = concatenateArcFiles(tableIndexesDirectory);

const awsString = fs.readFileSync(
  path.resolve(`${baseDirectory}/${awsConfigPath}`),
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

fs.outputFileSync("./app.arc", renderedTemplate);

function concatenateArcFiles(directory: string) {
  const arcFiles = glob.sync(`${baseDirectory}/${directory}/*.arc`);

  let arcString = "";

  arcFiles.forEach((arcFile) => {
    const fileContents = fs.readFileSync(arcFile, { encoding: "utf8" });

    arcString += fileContents;
  });

  return arcString;
}
