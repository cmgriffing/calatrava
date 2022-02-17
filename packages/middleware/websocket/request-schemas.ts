// Generated by ts-to-zod
import { z } from "zod";
import {
  WebSocketIncomingMessageType,
  // WebSocketOutgoingMessageType,
} from "./request-types";

export const webSocketIncomingMessageTypeSchema = z.nativeEnum(
  WebSocketIncomingMessageType
);

export const webSocketIncomingConnectedMessageSchema = z.object({
  type: z.literal(WebSocketIncomingMessageType.Connected),
  accessToken: z.string(),
  payload: z.object({
    pollId: z.string(),
  }),
});

export const webSocketIncomingOtherMessageSchema = z.object({
  type: z.literal(WebSocketIncomingMessageType.Other),
  accessToken: z.string(),
  payload: z.object({
    foo: z.string(),
  }),
});

export const webSocketIncomingMessageSchema = z.union([
  webSocketIncomingConnectedMessageSchema,
  webSocketIncomingOtherMessageSchema,
]);

// export const webSocketOutgoingMessageTypeSchema = z.nativeEnum(
//   WebSocketOutgoingMessageType
// );

// export const webSocketOutgoingVoteChangedMessageSchema = z.object({
//   type: z.literal(WebSocketOutgoingMessageType.VoteChanged),
//   payload: z.object({}),
// });

// export const webSocketOutgoingMessageSchema =
//   webSocketOutgoingVoteChangedMessageSchema;
