import fs from "fs-extra";
import path from "path";
import glob from "glob";

export async function copyShared() {
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
}
