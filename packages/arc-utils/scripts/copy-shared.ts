import * as minimist from "minimist";
import fs from "fs-extra";
import path from "path";
import glob from "glob";

throw new Error("Unimplemented");

async function main() {
  const sharedFolder = path.resolve("src/shared");

  console.log({ sharedFolder });

  glob
    .sync("src/**/index.ts", {
      ignore: "**/node_modules/**/index.ts",
    })
    .map((filePath) => path.resolve(filePath))
    .filter((filePath) => filePath.indexOf("node_modules") === -1)
    .forEach((indexFile) => {
      const lastSlashIndex = indexFile.lastIndexOf("/");
      const targetFolderPath = indexFile.substring(0, lastSlashIndex);

      const nodeModulesFolderPath = `${targetFolderPath}/node_modules/@architect/shared`;

      console.log(`Found shared path: `, nodeModulesFolderPath);

      if (!fs.existsSync(nodeModulesFolderPath)) {
        console.log(`Writing shared path: `, nodeModulesFolderPath);
        const indexOfLastSlash = nodeModulesFolderPath.lastIndexOf("/");
        const architectFolder = nodeModulesFolderPath.substring(
          0,
          indexOfLastSlash
        );

        fs.ensureDirSync(architectFolder);
        fs.copySync(sharedFolder, nodeModulesFolderPath);
      }
    });
}

main();
