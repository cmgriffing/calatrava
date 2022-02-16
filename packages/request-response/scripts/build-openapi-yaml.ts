import minimist from "minimist";
import { buildOpenApiYaml } from "../src/build-openapi-yaml";

async function main() {
  const args = minimist(process.argv.slice(2));

  const cwd = process.cwd();
  const { schema, routes, version, title, description, out } = args;

  if (!schema) {
    throw new Error("Schema directory path must exist");
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

  await buildOpenApiYaml(schema, routes, version, title, description, out);
}

main();
