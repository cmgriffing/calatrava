import {
  HTTPClientErrorResponses,
  HTTPServerErrorResponses,
} from "./http-status";

export const commonHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE,OPTIONS",
  "access-control-allow-headers": "content-type,authorization",
  "cache-control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
  "content-type": "application/json; charset=utf8",
};

export interface RouteOptions {
  public?: boolean;
  path: string;
  summary: string;
  description: string;
  tags: string[];
  headers: { [key: string]: string };
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  definedErrors: (HTTPClientErrorResponses | HTTPServerErrorResponses)[];
  // Maybe we could combine the schema paths into a common interpolatable variable. (postUser)
  requestSchema?: string;
  responseSchema: string;
  errorSchema: string | "ErrorResponse";
}

// There is probably a better place for this
export function Route(_options: RouteOptions): Function {
  return () => {
    return;
  };
}
