import * as fs from "fs-extra";
import * as child_process from "child_process";

test("Build Arc file from example", () => {
  child_process.execSync(
    "npx ts-node scripts/build-arc-file.ts config.test.json"
  );

  const arcContents = fs.readFileSync("./app.arc", {
    encoding: "utf8",
  });

  expect(arcContents).toMatchSnapshot();
});
