import { HttpResponse } from "@architect/functions/http";
import { WebSocketIncomingMessage } from "./request-types";
import { WrappedDatastore } from "@calatrava/datawrapper";

export interface WebSocketRequest {
  requestContext: {
    connectedAt: number;
    connectionId: string;
    domainName: string;
    eventType: "MESSAGE";
    messageDirection: "IN" | "OUT";
    messageId: string;
    requestId: string;
    requestTimeEpoch: number;
    routeKey: string;
    stage: string;
  };
  isBase64Encoded: boolean;
  body: WebSocketIncomingMessage;
}

export interface WebSocketRequestWithTables extends WebSocketRequest {
  tables: {
    get: <T extends {}>(tableName?: string) => WrappedDatastore<T>;
  };
}

export interface WebSocketRequestWithUser<User>
  extends WebSocketRequestWithTables {
  user: User;
}

export type WebSocketHandler = (req: WebSocketRequest) => Promise<HttpResponse>;
