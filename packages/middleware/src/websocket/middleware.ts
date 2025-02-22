/*
 * WebSocketMiddleware
 */

import { tables } from "@architect/functions";
import type { HttpResponse } from "@architect/functions/http";
import { createDataWrapper, Datastore } from "@calatrava/datawrapper";
// import { createDataWrapper, Datastore } from "../data";
// import { attachCommonHeaders } from "../middleware";
// import { decodeToken } from "../token";
import { WebSocketIncomingMessageType } from "./request-types";
import {
  WebSocketHandler,
  WebSocketRequest,
  WebSocketRequestWithTables,
  WebSocketRequestWithUser,
} from "./types";
import { attachCommonHeaders } from "../common";
import {
  webSocketIncomingConnectedMessageSchema,
  webSocketIncomingOtherMessageSchema,
} from "./request-schemas";
import { BaseUser } from "../types";

export function createGetWebSocketTables() {
  return async function getWebSocketTables(
    req: WebSocketRequest
  ): Promise<HttpResponse | void> {
    const data = await tables();

    (req as WebSocketRequestWithTables).tables = {
      get<T extends {}>(tableName: string = "core") {
        const table = data[tableName] as unknown as Datastore;
        return createDataWrapper<T>(table, data["_doc"]);
      },
    };
  } as WebSocketHandler;
}

export const createGetWebSocketUser = function <User extends BaseUser>(
  decodeToken: Function,
  getPartitionKey: (keys: Record<string, string>) => string
) {
  return async function getWebSocketUser(
    req: WebSocketRequestWithTables
  ): Promise<HttpResponse | void> {
    try {
      if (!req.body.accessToken) {
        return attachCommonHeaders({
          statusCode: 401,
          json: {},
        });
      }

      const { accessToken } = req.body;
      const usersTable = req.tables.get<User>();
      const decodedToken = decodeToken(accessToken);
      const userId = (decodedToken.sub as any).userId;
      const user = await usersTable.getById(getPartitionKey({ userId }));

      if (!user) {
        throw new Error("No user found.");
      }

      (req as WebSocketRequestWithUser<User>).user = user;
    } catch (e) {
      console.log("Error decoding token and fetching user");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 401,
        json: {},
      });
    }
  } as WebSocketHandler;
};

const webSocketRequestTypeToValidatorMap: {
  [value in WebSocketIncomingMessageType]: any;
} = {
  [WebSocketIncomingMessageType.Connected]:
    webSocketIncomingConnectedMessageSchema,
  [WebSocketIncomingMessageType.Other]: webSocketIncomingOtherMessageSchema,
};

export const isValidWebSocketRequest = async function (req: WebSocketRequest) {
  try {
    const requestType = req.body.type;

    const validator = webSocketRequestTypeToValidatorMap[requestType];

    if (!validator) {
      return attachCommonHeaders({
        statusCode: 400,
        json: {},
      });
    }

    validator.strict().parse(req.body);

    return;
  } catch (e) {
    console.log("Error validating request body");
    console.log(e);

    return attachCommonHeaders({
      statusCode: 400,
      json: e,
    });
  }
} as WebSocketHandler;
