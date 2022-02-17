/*
 * Outgoing
 */

export enum WebSocketOutgoingMessageType {
  VoteChanged = "voteChanged",
}

export interface WebSocketOutgoingVoteChangedMessage {
  type: WebSocketOutgoingMessageType.VoteChanged;
  payload: {};
}

export type WebSocketOutgoingMessage = WebSocketOutgoingVoteChangedMessage;
