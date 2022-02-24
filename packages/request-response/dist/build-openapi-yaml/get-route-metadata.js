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
exports.getRouteMetadata = void 0;
const ts = __importStar(require("typescript"));
const types_1 = require("../types");
const printer = ts.createPrinter({});
function getRouteMetadata(node, sourceFile) {
    const allNodes = [node];
    let nodeIndex = 0;
    const routeOptions = [];
    while (allNodes.length > nodeIndex) {
        const currentNode = allNodes[nodeIndex];
        if (currentNode) {
            currentNode.forEachChild((childNode) => {
                allNodes.push(childNode);
            });
        }
        nodeIndex += 1;
    }
    allNodes.forEach((childNode) => {
        var _a;
        if ((_a = childNode.decorators) === null || _a === void 0 ? void 0 : _a.length) {
            childNode.decorators.forEach((decorator) => {
                let expression = decorator;
                while (expression.expression !== undefined) {
                    expression = expression.expression;
                }
                const identifier = expression;
                if (identifier.text === "Route") {
                    const args = decorator.expression.arguments;
                    const stringifiedOptions = printer.printNode(ts.EmitHint.Unspecified, args[0], sourceFile);
                    if (stringifiedOptions) {
                        const evalString = `const commonHeaders = ${JSON.stringify(types_1.commonHeaders)}; (${stringifiedOptions})`;
                        const routeOptionObject = eval(evalString);
                        routeOptions.push(routeOptionObject);
                    }
                }
            });
        }
    });
    return routeOptions;
}
exports.getRouteMetadata = getRouteMetadata;
