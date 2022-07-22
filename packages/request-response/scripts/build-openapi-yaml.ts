import minimist from "minimist";
import { buildOpenApiYaml } from "../src/build-openapi-yaml";

async function main() {
  const args = minimist(process.argv.slice(2));

  // const cwd = process.cwd();
  const {
    requests,
    responses,
    routes,
    version,
    title,
    description,
    out,
    isPublic,
  } = args;

  if (!requests) {
    throw new Error("Requests path is required");
  }

  if (!responses) {
    throw new Error("Responses path is required");
  }

  if (!routes) {
    throw new Error("Routes path is required.");
  }

  if (!version) {
    throw new Error("Version is required.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!description) {
    throw new Error("Description is required.");
  }

  if (!out) {
    throw new Error("Out path is required.");
  }

  await buildOpenApiYaml(
    requests,
    responses,
    routes,
    version,
    title,
    description,
    out,
    !!isPublic
  );
}

main();
