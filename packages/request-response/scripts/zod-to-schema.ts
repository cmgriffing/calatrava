import minimist from "minimist";

async function main() {
  const args = minimist(process.argv.slice(2));

  const cwd = process.cwd();
  const { requests, responses, out } = args;

  if (!out || !requests || !responses) {
    throw new Error(
      `All arguments must be passed: ${JSON.stringify({
        requests,
        responses,
        out,
      })}`
    );
  }
}

main();
