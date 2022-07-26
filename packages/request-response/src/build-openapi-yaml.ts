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
import lodash from "lodash";
const deepdashPaths = require("deepdash/paths");

export async function buildOpenApiYaml(
  requestTypesPath: string,
  responseTypesPath: string,
  routes: string,
  version: string = "0.0.0",
  title: string = "",
  description: string = "",
  out: string = "openapi.yaml",
  isPublic: boolean = false,
  baseUrl: string = "http://localhost"
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
            const routeMetadata = getRouteMetadata(node, sourceFile);
            if (routeMetadata.length) {
              routeOptions.push(...routeMetadata);
            }
          }
        });
      });

    // map routes to openApi path objects
    // and build spec json adding paths
    const yaml = getRouteOptionsYaml(
      routeOptions,
      tjsGenerator,
      {
        version,
        title,
        description,
      },
      isPublic,
      baseUrl
    );

    fs.outputFile(path.resolve(cwd, out), yaml);
  } catch (e) {
    debug("Build openapi yaml: Caught exception: ", { e });
  }
}

function getRouteOptionsYaml(
  routeOptions: RouteOptions[],
  tjsGenerator: TJS.JsonSchemaGenerator | null,
  info: {
    version: string;
    title: string;
    description: string;
  },
  isPublic?: boolean,
  baseUrl: string = "http://localhost"
) {
  let openApiSchema: OpenAPIV3.Document = {
    openapi: "3.0.3",
    info,
    paths: {},
    servers: [{ url: baseUrl }],
    components: {
      schemas: {},
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },
    },
  };

  let filteredRouteOptions = routeOptions;

  if (isPublic) {
    filteredRouteOptions = routeOptions.filter(
      (routeOption) => routeOption.public
    );
    openApiSchema.security = [];
    openApiSchema.security.push({
      ApiKeyAuth: [],
    });
  } else {
    openApiSchema.components!.securitySchemes!["BearerAuth"] = {
      type: "http",
      scheme: "bearer",
    };
  }

  filteredRouteOptions.forEach((routeOptionObject) => {
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

      requestSchema =
        scrubSchemaDefinitionsProps<OpenAPIV3.SchemaObject>(requestSchema);

      const scrubbedSchemas =
        scrubSchemaDefinitionsRefs<OpenAPIV3.SchemaObject>(
          requestSchema,
          openApiSchema,
          tjsGenerator
        );

      requestSchema = scrubbedSchemas.schema;
      openApiSchema = scrubbedSchemas.doc;

      delete requestSchema?.$schema;

      openApiSchema!.components!.schemas![routeOptionObject.requestSchema] =
        requestSchema as OpenAPIV3.SchemaObject;
    }

    const responses: any = {};

    // set 200 response
    let responseSchema = tjsGenerator?.getSchemaForSymbol(
      routeOptionObject.responseSchema
    );

    if (!responseSchema) {
      throw new Error(
        `Could not generate response schema:  ${routeOptionObject.responseSchema}`
      );
    }

    responseSchema =
      scrubSchemaDefinitionsProps<TJS.Definition>(responseSchema);

    const scrubbedSchemas = scrubSchemaDefinitionsRefs<TJS.Definition>(
      responseSchema,
      openApiSchema,
      tjsGenerator
    );

    responseSchema = scrubbedSchemas.schema;
    openApiSchema = scrubbedSchemas.doc;

    if (!responseSchema) {
      throw new Error("Could not generate request schema");
    }

    delete responseSchema?.$schema;

    openApiSchema!.components!.schemas![routeOptionObject.responseSchema] =
      responseSchema as OpenAPIV3.ResponseObject;

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

    // set error responses
    let errorSchema = tjsGenerator?.getSchemaForSymbol(
      routeOptionObject.errorSchema
    );

    delete errorSchema?.$schema;

    errorSchema = scrubSchemaDefinitionsProps<TJS.Definition>(responseSchema);

    const scrubbedErrorSchemas = scrubSchemaDefinitionsRefs<TJS.Definition>(
      errorSchema,
      openApiSchema,
      tjsGenerator
    );

    errorSchema = scrubbedErrorSchemas.schema;
    openApiSchema = scrubbedErrorSchemas.doc;

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
      summary: routeOptionObject.summary,
      description: routeOptionObject.description,
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

    if (!isPublic && !routeOptionObject.open) {
      pathObject.security = [
        {
          BearerAuth: [],
        },
      ];
      if (!!routeOptionObject.public) {
        pathObject.security.push({
          ApiKeyAuth: [],
        });
      }
    }

    (openApiSchema!.paths![routeOptionObject.path] as any)![
      routeOptionObject.method.toLowerCase()
    ] = pathObject;
  });

  // convert json to yaml
  const yaml = YAML.stringify(openApiSchema);
  return yaml;
}

function scrubSchemaDefinitionsProps<T>(schema: T): T {
  const newSchema = lodash.cloneDeep(schema);
  delete (newSchema as any).definitions;
  return newSchema;
}

function scrubSchemaDefinitionsRefs<T extends Object>(
  schema: T,
  doc: OpenAPIV3.Document,
  tjsGenerator: TJS.JsonSchemaGenerator | null
): { schema: T; doc: OpenAPIV3.Document } {
  if (!tjsGenerator) {
    throw new Error("TJS Generator not instantiated.");
  }

  const newSchema = lodash.cloneDeep(schema);
  const newDoc = lodash.cloneDeep(doc);

  const schemaPaths: string[] = deepdashPaths(newSchema);
  schemaPaths.forEach((schemaPath) => {
    if (lodash.endsWith(schemaPath as string, "$ref")) {
      const refPath: string = lodash.get(newSchema, schemaPath);

      const splitRefPath = refPath.split("/");

      const componentName: string = splitRefPath[splitRefPath.length - 1] || "";
      const splitComponentName = componentName.split("_");
      const scrubbedComponentName = splitComponentName[0];

      let newRefPath = refPath.replace("#/definitions", "#/components/schema");

      newRefPath = newRefPath.replace(
        componentName,
        scrubbedComponentName || componentName
      );

      lodash.set(newSchema, schemaPath, newRefPath);

      if (
        scrubbedComponentName &&
        !newDoc!.components!.schemas![scrubbedComponentName]
      ) {
        const lookedUpSchema = tjsGenerator.getSchemaForSymbol(
          scrubbedComponentName
        );
        if (lookedUpSchema) {
          if (lookedUpSchema.definitions) {
            const internalSchema =
              lookedUpSchema.definitions[scrubbedComponentName];

            newDoc!.components!.schemas![scrubbedComponentName] =
              internalSchema as OpenAPIV3.SchemaObject;
          }
        }
      }
    }
  });

  return {
    schema: newSchema,
    doc: newDoc,
  };
}
