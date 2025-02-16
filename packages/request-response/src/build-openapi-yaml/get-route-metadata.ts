import * as ts from "typescript";
import { commonHeaders, RouteOptions } from "../types";

const printer = ts.createPrinter({});

export function getRouteMetadata(
  node: ts.Node,
  sourceFile: ts.SourceFile
): RouteOptions[] {
  const allNodes = [node];
  let nodeIndex = 0;

  const routeOptions: RouteOptions[] = [];

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
    const decorators = ts.canHaveDecorators(childNode)
      ? ts.getDecorators(childNode)
      : [];
    if (decorators?.length) {
      decorators.forEach((decorator: any) => {
        let expression = decorator;
        while (expression.expression !== undefined) {
          expression = expression.expression;
        }
        const identifier = expression as ts.Identifier;

        if (identifier.text === "Route") {
          const args = decorator.expression.arguments;

          const stringifiedOptions = printer.printNode(
            ts.EmitHint.Unspecified,
            args[0],
            sourceFile
          );

          if (stringifiedOptions) {
            const evalString = `const commonHeaders = ${JSON.stringify(
              commonHeaders
            )}; (${stringifiedOptions})`;
            const routeOptionObject = eval(evalString);
            routeOptions.push(routeOptionObject);
          }
        }
      });
    }
  });

  return routeOptions;
}
