import z from "zod";

import { KickPlayerSchema } from "./events/client/host/kick-player";
import { StartLobbySchema } from "./events/client/host/start-lobby";
import { NextStepSchema } from "./events/client/host/next-step";
import { SubmitAnswerSchema } from "./events/client/player/submit-answer";

import { PlayerJoinedSchema } from "./events/server/player-joined";
import { PlayerLeftSchema } from "./events/server/player-left";
import { PlayerUpdateSchema } from "./events/server/player-update";
import { LobbyStatusUpdateSchema } from "./events/server/lobby-status-update";
import { UpdateLobbyAnswersSchema } from "./events/server/update-lobby-answers";
import { PlayerAnswerResultSchema } from "./events/server/player-answer-result";
import { PlayerKickedSchema } from "./events/server/player-kicked";
import { LobbyDeletedSchema } from "./events/server/lobby-deleted";
import { LobbyJoinedSchema } from "./events/server/lobby-joined";

// Sent to Server
export const AllClientEventsSchema = z.discriminatedUnion("type", [
  KickPlayerSchema,
  StartLobbySchema,
  NextStepSchema,
  SubmitAnswerSchema,
]);

export type AllClientEvents = z.infer<typeof AllClientEventsSchema>;

// Sent to Client
export const AllServerEventsSchema = z.discriminatedUnion("type", [
  PlayerJoinedSchema,
  PlayerLeftSchema,
  PlayerUpdateSchema,
  LobbyStatusUpdateSchema,
  UpdateLobbyAnswersSchema,
  PlayerAnswerResultSchema,
  PlayerKickedSchema,
  LobbyDeletedSchema,
  LobbyJoinedSchema,
]);

export type AllServerEvents = z.infer<typeof AllServerEventsSchema>;