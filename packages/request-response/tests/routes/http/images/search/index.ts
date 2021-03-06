import * as arc from "@architect/functions";
import { Route, commonHeaders } from "../../../../../src/types";

class Handler {
  @Route({
    public: true,
    summary: "",
    description: "",
    path: "/images/search",
    tags: ["images"],
    headers: {
      ...commonHeaders,
    },
    method: "POST",
    requestSchema: "ImageSearchRequest",
    responseSchema: "ImageSearchResponse",
    errorSchema: "ErrorResponse",
    definedErrors: [
      // HTTPStatusCode.BadRequest,
      // HTTPStatusCode.InternalServerError,
      400, 401, 402, 403, 500,
    ],
  })
  static get() {
    return arc.http.async(async function http(req: any): Promise<any> {
      try {
        return {
          statusCode: 200,
          json: { images: [] },
        };
      } catch (e) {
        console.log("Unhandled Error: ");
        console.log(e);
        return {
          statusCode: 500,
        };
      }
    });
  }
}

exports.handler = Handler.get();
