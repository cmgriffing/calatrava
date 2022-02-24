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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodToSchema = void 0;
const zod_to_json_schema_1 = __importDefault(require("zod-to-json-schema"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
async function zodToSchema(requests, responses, out) {
    try {
        console.log("zodToSchema starting", { requests, responses, out });
        const cwd = process.cwd();
        const requestSchemas = await Promise.resolve().then(() => __importStar(require(path.resolve(cwd, requests))));
        const responseSchemas = await Promise.resolve().then(() => __importStar(require(path.resolve(cwd, responses))));
        Object.entries(requestSchemas).forEach(([key, schema]) => {
            const jsonSchema = (0, zod_to_json_schema_1.default)(schema, {
                name: key,
                target: "openApi3",
                definitionPath: "components/schemas",
            });
            console.log("jsonSchema", jsonSchema);
            fs.outputFile(path.resolve(cwd, out, `${key}.json`), JSON.stringify(jsonSchema, null, 2));
        });
        Object.entries(responseSchemas).forEach(([key, schema]) => {
            const jsonSchema = (0, zod_to_json_schema_1.default)(schema, {
                name: key,
                target: "openApi3",
                definitionPath: "components/schemas",
            });
            fs.outputFile(path.resolve(cwd, out, `${key}.json`), JSON.stringify(jsonSchema, null, 2));
        });
    }
    catch (e) {
        console.log({ e });
    }
}
exports.zodToSchema = zodToSchema;
