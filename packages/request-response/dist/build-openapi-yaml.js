"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenApiYaml = void 0;
const glob = __importStar(require("glob"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
const get_route_metadata_1 = require("./build-openapi-yaml/get-route-metadata");
const YAML = __importStar(require("yaml"));
const TJS = __importStar(require("typescript-json-schema"));
async function buildOpenApiYaml(requestTypesPath, responseTypesPath, routes, version = "0.0.0", title = "", description = "", out = "openapi.yaml") {
    try {
        const cwd = process.cwd();
        const settings = {
            required: true,
            noExtraProps: true,
        };
        const inputFilePaths = [
            path.resolve(cwd, requestTypesPath),
            path.resolve(cwd, responseTypesPath),
        ];
        console.log({ inputFilePaths });
        const tjsProgram = TJS.getProgramFromFiles(inputFilePaths, {});
        const tjsGenerator = TJS.buildGenerator(tjsProgram, settings);
        const routesFolder = path.resolve(cwd, routes);
        const routeOptions = [];
        const handlers = glob.sync(`${routesFolder}/**/index.ts`);
        handlers
            .filter((handlerPath) => handlerPath.indexOf("node_modules") === -1)
            .map((handlerPath) => path.resolve(handlerPath))
            .map((handlerPath) => {
            // parse http handlers using ts
            const fileName = handlerPath.substring(handlerPath.lastIndexOf("/"));
            const sourceText = fs.readFileSync(handlerPath, { encoding: "utf8" });
            return ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest);
        })
            .map((sourceFile) => {
            // map parsed handlers and extract metadata from Route
            ts.forEachChild(sourceFile, (node) => {
                if (ts.isClassDeclaration(node)) {
                    routeOptions.push(...(0, get_route_metadata_1.getRouteMetadata)(node, sourceFile));
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
        };
        routeOptions.forEach((routeOptionObject) => {
            if (!openApiSchema.paths[routeOptionObject.path]) {
                openApiSchema.paths[routeOptionObject.path] =
                    {};
            }
            let requestSchema;
            console.log("routeOptionObject.requestJsonSchema", routeOptionObject.requestJsonSchema, { routeOptionObject });
            if (routeOptionObject === null || routeOptionObject === void 0 ? void 0 : routeOptionObject.requestJsonSchema) {
                requestSchema = tjsGenerator === null || tjsGenerator === void 0 ? void 0 : tjsGenerator.getSchemaForSymbol(routeOptionObject.requestJsonSchema);
                if (!requestSchema) {
                    throw new Error("Could not generate request schema");
                }
                requestSchema === null || requestSchema === void 0 ? true : delete requestSchema.$schema;
                openApiSchema.components.schemas[routeOptionObject.requestJsonSchema] = requestSchema;
            }
            const responses = {};
            // set 200 response
            const responseSchema = tjsGenerator === null || tjsGenerator === void 0 ? void 0 : tjsGenerator.getSchemaForSymbol(routeOptionObject.responseJsonSchema);
            if (!responseSchema) {
                throw new Error("Could not generate request schema");
            }
            responses["200"] = {
                description: "Response",
                content: {
                    "application/json": {
                        schema: {
                            $ref: `#/components/schemas/${routeOptionObject.responseJsonSchema}`,
                        },
                    },
                },
            };
            responseSchema === null || responseSchema === void 0 ? true : delete responseSchema.$schema;
            openApiSchema.components.schemas[routeOptionObject.responseJsonSchema] = responseSchema;
            // set error responses
            const errorSchema = tjsGenerator === null || tjsGenerator === void 0 ? void 0 : tjsGenerator.getSchemaForSymbol(routeOptionObject.errorJsonSchema);
            errorSchema === null || errorSchema === void 0 ? true : delete errorSchema.$schema;
            openApiSchema.components.schemas[routeOptionObject.errorJsonSchema] =
                errorSchema;
            routeOptionObject.definedErrors.forEach((errorCode) => {
                const definedError = {
                    description: "Error",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: `#/components/schemas/${routeOptionObject.errorJsonSchema}`,
                            },
                        },
                    },
                };
                responses[errorCode] = definedError;
            });
            const pathObject = {
                responses,
                tags: routeOptionObject.tags,
            };
            if (requestSchema) {
                pathObject.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: `#/components/schemas/${routeOptionObject.requestJsonSchema}`,
                            },
                        },
                    },
                };
            }
            openApiSchema.paths[routeOptionObject.path][routeOptionObject.method.toLowerCase()] = pathObject;
        });
        // convert json to yaml
        const yaml = YAML.stringify(openApiSchema);
        // // output yaml file
        fs.outputFile(path.resolve(cwd, out), yaml);
    }
    catch (e) {
        console.log({ e });
    }
}
exports.buildOpenApiYaml = buildOpenApiYaml;
