import axios from "axios";
import Case from "case";
import fs from "fs-extra";
import glob from "glob";
import path from "path";
import Mustache from "mustache";
import { debug } from "@calatrava/utils";

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
  try {
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

    const files = glob.sync(templateLocation, globConfig);

    files.forEach((file) => {
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

    // parse package json from output folder
    const packageJsonPath = path.resolve(cwd, outputFolder, "package.json");

    const packageJson = fs.readJSONSync(packageJsonPath);

    packageJson.dependencies = await getDependencyVersions(
      packageJson.dependencies
    );

    packageJson.devDependencies = await getDependencyVersions(
      packageJson.devDependencies
    );

    fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
  } catch (e: any) {
    debug("Scaffold boilerplate: Caught exception: ", e);
  }
}

async function getDependencyVersions(dependencies: { [key: string]: string }) {
  const versions: { [key: string]: string } = {};

  await Promise.all(
    Object.entries(dependencies).map(async ([name, rawVersion]) => {
      if (name.indexOf("@calatrava") > -1) {
        const versionPrefix = (rawVersion as string).split(":")[1] || "~";
        const baseName = name.split("/")[1] || "";

        const externalPackageJsonUrl = `https://raw.githubusercontent.com/cmgriffing/calatrava/main/packages/${baseName}/package.json`;

        const externalPackageJson = (await axios.get(externalPackageJsonUrl))
          .data;

        const packageVersion = `${versionPrefix}${externalPackageJson.version}`;

        versions[name] = packageVersion;
      }
    })
  );

  Object.entries(versions).forEach(([packageName, version]) => {
    dependencies[packageName] = version;
  });

  return dependencies;
}
