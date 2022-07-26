import child_process from "child_process";

const childProcessResponse = child_process.spawnSync("git", ["status", "-uno"]);

const statusResponse = childProcessResponse.output.toString();

console.log("Git status -uno response: ", statusResponse);

if (statusResponse) {
  process.exit(-1);
} else {
  process.exit(0);
}
