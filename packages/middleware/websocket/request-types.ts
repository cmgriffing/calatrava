/*
 * Incoming
 */
export enum WebSocketIncomingMessageType {
  Connected = "connected",
  Other = "other",
}

export interface WebSocketIncomingConnectedMessage {
  type: WebSocketIncomingMessageType.Connected;
  accessToken: string;
  payload: Object;
}

export interface WebSocketIncomingOtherMessage {
  type: WebSocketIncomingMessageType.Other;
  accessToken: string;
  payload: Object;
}

export type WebSocketIncomingMessage =
  | WebSocketIncomingConnectedMessage
  | WebSocketIncomingOtherMessage;

/*
 * Outgoing
 */

// export enum WebSocketOutgoingMessageType {
//   VoteChanged = "voteChanged",
// }

// export interface WebSocketOutgoingVoteChangedMessage {
//   type: WebSocketOutgoingMessageType.VoteChanged;
//   payload: Object;
// }

// export type WebSocketOutgoingMessage = WebSocketOutgoingVoteChangedMessage;
