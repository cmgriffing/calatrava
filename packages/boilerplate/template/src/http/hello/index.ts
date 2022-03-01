import * as arc from "@architect/functions";
import { HttpResponse } from "@architect/functions";
import {
  attachCommonHeaders,
  commonHeaders,
  HttpRequestWithUser,
} from "@calatrava/middleware";
import { getTables, getUser } from "@calatrava/middleware";
import { Route } from "@calatrava/request-response";

class Handler {
  @Route({
    summary: "",
    description: "",
    path: "/",
    tags: [""],
    headers: {
      ...commonHeaders,
    },
    method: "POST",
    requestJsonSchemaPath: "postUserRequestSchema.json",
    responseJsonSchemaPath: "postUserResponseSchema.json",
    errorJsonSchemaPath: "errorResponseSchema.json",
    definedErrors: [400, 500],
  })
  static get() {
    return arc.http.async(
      getTables,
      getUser,
      async function http(req: HttpRequestWithUser): Promise<HttpResponse> {
        try {
          return attachCommonHeaders({
            statusCode: 200,
            json: {},
          });
        } catch (e) {
          console.log("Unhandled Error: ");
          console.log(e);
          return {
            statusCode: 500,
          };
        }
      }
    );
  }
}

exports.handler = Handler.get();
