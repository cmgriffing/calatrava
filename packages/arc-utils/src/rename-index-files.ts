import fs from "fs-extra";
import glob from "glob";

export function renameIndexFiles() {
  glob
    .sync("./src/**/index.js", {
      ignore: "./**/node_modules/**.index.js",
    })
    .forEach((indexFilePath) => {
      const tsPath = indexFilePath.replace(".js", ".ts");
      if (!fs.existsSync(tsPath)) {
        fs.moveSync(indexFilePath, tsPath);
      }
    });
}
