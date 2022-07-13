import * as glob from "glob";
import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { getRouteMetadata } from "./build-openapi-yaml/get-route-metadata";
import { OpenAPIV3 } from "openapi-types";
import { RouteOptions } from "./types";
import * as YAML from "yaml";
import * as TJS from "typescript-json-schema";
import { debug } from "@calatrava/utils";

export async function buildOpenApiYaml(
  requestTypesPath: string,
  responseTypesPath: string,
  routes: string,
  version: string = "0.0.0",
  title: string = "",
  description: string = "",
  out: string = "openapi.yaml"
) {
  try {
    const cwd = process.cwd();

    const settings: TJS.PartialArgs = {
      required: true,
      noExtraProps: true,
    };

    const inputFilePaths = [
      path.resolve(cwd, requestTypesPath),
      path.resolve(cwd, responseTypesPath),
    ];

    debug("Build OpenAPI Yaml: ", { inputFilePaths });

    const tjsProgram = TJS.getProgramFromFiles(inputFilePaths, {});
    const tjsGenerator = TJS.buildGenerator(tjsProgram, settings);

    const routesFolder = path.resolve(cwd, routes);

    const routeOptions: RouteOptions[] = [];

    const handlers = glob.sync(`${routesFolder}/**/index.ts`);

    handlers
      .filter((handlerPath) => handlerPath.indexOf("node_modules") === -1)
      .map((handlerPath) => path.resolve(handlerPath))
      .map((handlerPath) => {
        // parse http handlers using ts
        const fileName = handlerPath.substring(handlerPath.lastIndexOf("/"));
        const sourceText = fs.readFileSync(handlerPath, { encoding: "utf8" });

        return ts.createSourceFile(
          fileName,
          sourceText,
          ts.ScriptTarget.Latest
        );
      })
      .map((sourceFile) => {
        // map parsed handlers and extract metadata from Route
        ts.forEachChild(sourceFile, (node) => {
          if (ts.isClassDeclaration(node)) {
            routeOptions.push(...getRouteMetadata(node, sourceFile));
          }
        });
      });

    // map routes to openApi path objects
    // and build spec json adding paths
    const openApiSchema = {
      openapi: "3.0.3",
      info: {
        version,
        title,
        description,
      },
      paths: {},
      components: {
        schemas: {},
      },
    } as OpenAPIV3.Document;

    routeOptions.forEach((routeOptionObject) => {
      if (!openApiSchema.paths[routeOptionObject.path]) {
        openApiSchema.paths[routeOptionObject.path] =
          {} as OpenAPIV3.PathItemObject;
      }

      let requestSchema: any;
      debug(
        "Build OpenAPI Yaml: routeOptionObject.requestSchema: ",
        routeOptionObject.requestSchema,
        { routeOptionObject }
      );

      if (routeOptionObject?.requestSchema) {
        requestSchema = tjsGenerator?.getSchemaForSymbol(
          routeOptionObject.requestSchema
        );

        if (!requestSchema) {
          throw new Error("Could not generate request schema");
        }

        delete requestSchema?.$schema;

        openApiSchema!.components!.schemas![routeOptionObject.requestSchema] =
          requestSchema as OpenAPIV3.SchemaObject;
      }

      const responses: any = {};

      // set 200 response
      const responseSchema = tjsGenerator?.getSchemaForSymbol(
        routeOptionObject.responseSchema
      );

      if (!responseSchema) {
        throw new Error("Could not generate request schema");
      }

      responses["200"] = {
        description: "Response",
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${routeOptionObject.responseSchema}`,
            },
          },
        },
      };

      delete responseSchema?.$schema;

      openApiSchema!.components!.schemas![routeOptionObject.responseSchema] =
        responseSchema as OpenAPIV3.ResponseObject;

      // set error responses
      const errorSchema = tjsGenerator?.getSchemaForSymbol(
        routeOptionObject.errorSchema
      );

      delete errorSchema?.$schema;

      openApiSchema!.components!.schemas![routeOptionObject.errorSchema] =
        errorSchema as OpenAPIV3.SchemaObject;

      routeOptionObject.definedErrors.forEach((errorCode) => {
        const definedError = {
          description: "Error",
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${routeOptionObject.errorSchema}`,
              },
            },
          },
        };

        responses[errorCode] = definedError;
      });

      const pathObject: any = {
        responses,
        tags: routeOptionObject.tags,
      };

      if (requestSchema) {
        pathObject.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${routeOptionObject.requestSchema}`,
              },
            },
          },
        };
      }
      (openApiSchema!.paths![routeOptionObject.path] as any)![
        routeOptionObject.method.toLowerCase()
      ] = pathObject;
    });

    // convert json to yaml
    const yaml = YAML.stringify(openApiSchema);

    // // output yaml file
    fs.outputFile(path.resolve(cwd, out), yaml);
  } catch (e) {
    debug("Build openapi yaml: Caught exception: ", { e });
  }
}
