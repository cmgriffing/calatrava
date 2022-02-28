import fs from "fs-extra";
import path from "path";
import glob from "glob";
import { debug } from "@calatrava/utils";

export async function copyShared() {
  try {
    const cwd = process.cwd();
    const sharedFolder = path.resolve(cwd, "src/shared");

    glob
      .sync(path.resolve(cwd, "src/**/index.ts"), {
        ignore: "**/node_modules/**/index.ts",
      })
      .map((filePath) => path.resolve(filePath))
      // is this filter even necessary?
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
  } catch (e: any) {
    debug("Copy Shared: Caught exception: ", e);
  }
}
