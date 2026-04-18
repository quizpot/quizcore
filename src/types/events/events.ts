import z from "zod";

import { KickPlayerSchema } from "./client/host/kick-player";
import { StartLobbySchema } from "./client/host/start-lobby";
import { NextStepSchema } from "./client/host/next-step";
import { SubmitAnswerSchema } from "./client/player/submit-answer";

import { PlayerJoinedSchema } from "./server/player-joined";
import { PlayerLeftSchema } from "./server/player-left";
import { PlayerUpdateSchema } from "./server/player-update";
import { LobbyStatusUpdateSchema } from "./server/lobby-status-update";
import { UpdateLobbyAnswersSchema } from "./server/update-lobby-answers";
import { PlayerAnswerResultSchema } from "./server/player-answer-result";
import { PlayerKickedSchema } from "./server/player-kicked";
import { LobbyDeletedSchema } from "./server/lobby-deleted";
import { LobbyJoinedSchema } from "./server/lobby-joined";
import { ServerErrorSchema } from "./server/server-error";

// Sent to Server
export const AllClientEventsSchema = z.discriminatedUnion("event", [
  KickPlayerSchema, // Blank event telling the client that they've been kicked
  StartLobbySchema, // Host event starting the lobby
  NextStepSchema, // Host event to skip to the next step
  SubmitAnswerSchema, // Player event to submit an answer
]);

export type AllClientEvents = z.infer<typeof AllClientEventsSchema>;

// Sent to Client
export const AllServerEventsSchema = z.discriminatedUnion("event", [
  PlayerJoinedSchema, // Host event for keeping track of players
  PlayerLeftSchema, // Host event for keeping track of players
  PlayerUpdateSchema, // Host & Player event for keeping track of player state
  LobbyStatusUpdateSchema, // Host & Player event for keeping track of lobby status
  UpdateLobbyAnswersSchema, // Host event for keeping track of answers
  PlayerAnswerResultSchema, // Player event to see results
  PlayerKickedSchema, // Player event to be notified of being kicked
  LobbyDeletedSchema, // Host & Player event to notice that the lobby has been deleted
  LobbyJoinedSchema, // Player event to sync current status of the lobby
  ServerErrorSchema, // Event to send server errors
]);

export type AllServerEvents = z.infer<typeof AllServerEventsSchema>;