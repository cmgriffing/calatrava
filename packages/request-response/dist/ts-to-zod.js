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
exports.tsToZod = void 0;
const tsToZodCore = __importStar(require("ts-to-zod"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
async function tsToZod(interfaces, out) {
    try {
        const cwd = process.cwd();
        const sourceText = fs.readFileSync(path.resolve(cwd, interfaces), {
            encoding: "utf8",
        });
        if (!sourceText) {
            throw new Error("sourceText from interfaces file must not be empty");
        }
        const { getZodSchemasFile } = tsToZodCore.generate({ sourceText });
        const outputPath = path.resolve(cwd, out);
        fs.ensureFileSync(outputPath);
        const splitInterfacesPath = interfaces.split("/");
        const relativeInterfacesPath = `./${splitInterfacesPath[splitInterfacesPath.length - 1]}`
            .replace(".tsx", "")
            .replace(".ts", "");
        fs.outputFileSync(outputPath, getZodSchemasFile(relativeInterfacesPath));
    }
    catch (e) {
        console.log({ e });
    }
}
exports.tsToZod = tsToZod;
