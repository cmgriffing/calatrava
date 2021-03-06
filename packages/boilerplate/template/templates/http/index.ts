import * as arc from "@architect/functions";
import { HttpResponse } from "@architect/functions";
import {
  attachCommonHeaders,
  commonHeaders,
  HttpRequestWithUser,
} from "@calatrava/middleware";
import { User } from "@architect/shared/types";
import { getTables, getUser } from "@architect/shared/middleware";
import { Route } from "@calatrava/request-response";

class Handler {
  @Route({
    summary: "SET_ROUTE_SUMMARY",
    description: "SET_ROUTE_DECRIPTION",
    path: "/SET_PATH_HERE",
    tags: ["SET_TAGS_HERE"],
    headers: {
      ...commonHeaders,
    },
    method: "POST",
    requestSchema: "SET_REQUEST_SCHEMA_HERE",
    responseSchema: "SET_RESPONSE_SCHEMA_HERE",
    errorSchema: "ErrorResponse",
    definedErrors: [400, 500], // ADD EXTRA RESPONSE CODES
  })
  static get() {
    return arc.http.async(
      getTables,
      getUser,
      async function http(
        req: HttpRequestWithUser<User>
      ): Promise<HttpResponse> {
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
