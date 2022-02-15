import { AnyZodObject, ZodObject, ZodTypeAny } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import * as fs from "fs-extra";
import minimist from "minimist";
import * as path from "path";

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

  const requestSchemas = await import(path.resolve(cwd, requests));
  const responseSchemas = await import(path.resolve(cwd, responses));

  Object.entries(requestSchemas).forEach(([key, schema]) => {
    const jsonSchema = zodToJsonSchema(schema as ZodObject<any>, {
      name: key,
      target: "openApi3",
      definitionPath: "components/schemas" as any,
    });

    fs.outputFile(
      path.resolve(cwd, out, `${key}.json`),
      JSON.stringify(jsonSchema, null, 2)
    );
  });

  Object.entries(responseSchemas).forEach(([key, schema]) => {
    const jsonSchema = zodToJsonSchema(schema as ZodObject<any>, {
      name: key,
      target: "openApi3",
      definitionPath: "components/schemas" as any,
    });

    fs.outputFile(
      path.resolve(cwd, out, `${key}.json`),
      JSON.stringify(jsonSchema, null, 2)
    );
  });
}

main();
