import * as ts from "typescript";
import { RouteOptions } from "../types";
export declare function getRouteMetadata(node: ts.Node, sourceFile: ts.SourceFile): RouteOptions[];
