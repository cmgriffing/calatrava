import { AnyZodObject, ZodObject, ZodTypeAny } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import * as fs from "fs-extra";
import * as path from "path";

export async function zodToSchema(
  requests: string,
  responses: string,
  out: string
) {
  const cwd = process.cwd();

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
