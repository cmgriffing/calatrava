import * as arc from "@architect/functions";
import { HttpResponse } from "@architect/functions";
import {
	attachCommonHeaders,
	commonHeaders,
	HttpRequestWithTables,
} from "@calatrava/middleware";
import { getTables } from "@architect/shared/middleware";
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
		method: "GET",
		responseJsonSchema: "postUserResponseSchema",
		errorJsonSchema: "errorResponseSchema",
		definedErrors: [400, 500],
	})
	static get() {
		return arc.http.async(
			getTables,
			async function http(req: HttpRequestWithTables): Promise<HttpResponse> {
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
