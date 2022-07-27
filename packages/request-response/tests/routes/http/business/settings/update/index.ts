import * as arc from "@architect/functions";
import { Route, commonHeaders } from "../../../../../../src/types";

class Handler {
  @Route({
    public: true,
    summary: "Update Business Settings",
    description: "Update Business Settings",
    path: "/businesses/:businessId",
    tags: ["Businesses"],
    headers: {
      ...commonHeaders,
    },
    method: "PATCH",
    requestSchema: "PatchBusinessSettingsRequest",
    responseSchema: "BusinessSettingsResponse",
    errorSchema: "ErrorResponse",
    definedErrors: [400, 401, 403, 500],
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
