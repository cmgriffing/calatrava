import { HTTPClientErrorResponses, HTTPServerErrorResponses } from "./http-status";
export declare const commonHeaders: {
    "access-control-allow-origin": string;
    "access-control-allow-methods": string;
    "access-control-allow-headers": string;
    "cache-control": string;
    "content-type": string;
};
export interface RouteOptions {
    path: string;
    summary: string;
    description: string;
    tags: string[];
    headers: {
        [key: string]: string;
    };
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    definedErrors: (HTTPClientErrorResponses | HTTPServerErrorResponses)[];
    requestJsonSchema?: string;
    responseJsonSchema: string;
    errorJsonSchema: string | "ErrorResponse";
}
export declare function Route(_options: RouteOptions): Function;
