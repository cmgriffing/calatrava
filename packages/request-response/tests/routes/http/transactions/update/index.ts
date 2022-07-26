import * as arc from "@architect/functions";
import { Route, commonHeaders } from "../../../../../src/types";

class Handler {
  @Route({
    public: true,
    summary: "Update a Transaction for a Business",
    description: "Update a Transaction for a Business",
    path: "/transactions/:transactionId",
    tags: ["Transactions"],
    headers: {
      ...commonHeaders,
    },
    method: "PATCH",
    requestSchema: "PatchTransactionRequest",
    responseSchema: "TransactionResponse",
    errorSchema: "ErrorResponse",
    definedErrors: [400, 401, 403, 404, 500],
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
