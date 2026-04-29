import z from "zod";
import { KickPlayerSchema } from "./client/host/kick-player";
import { StartLobbySchema } from "./client/host/start-lobby";
import { NextStepSchema } from "./client/host/next-step";
import { SubmitAnswerSchema } from "./client/player/submit-answer";
import { PlayerJoinedSchema } from "./server/player-joined";
import { PlayerLeftSchema } from "./server/player-left";
import { PlayerUpdateSchema } from "./server/player-update";
import { LobbyStatusUpdateSchema, HostLobbyStatusUpdateSchema } from "./server/lobby-status-update";
import { UpdateLobbyAnswersSchema } from "./server/update-lobby-answers";
import { PlayerAnswerResultSchema } from "./server/player-answer-result";
import { PlayerKickedSchema } from "./server/player-kicked";
import { LobbyDeletedSchema } from "./server/lobby-deleted";
import { LobbyJoinedSchema } from "./server/lobby-joined";
import { ServerErrorSchema } from "./server/server-error";
import { HostStatusSchema } from "./server/host-status";

// ── Sent to Server ────────────────────────────────────────────────────────────

export const AllClientEventsSchema = z.discriminatedUnion("event", [
  KickPlayerSchema,    // Host event to kick a player
  StartLobbySchema,    // Host event to start the lobby
  NextStepSchema,      // Host event to advance to the next step
  SubmitAnswerSchema,  // Player event to submit an answer
]);
export type AllClientEvents = z.infer<typeof AllClientEventsSchema>;

// ── Sent to Host ──────────────────────────────────────────────────────────────
// Includes full QuestionData (with `correct`) in LOBBY_STATUS_UPDATE.

export const AllHostServerEventsSchema = z.discriminatedUnion("event", [
  PlayerJoinedSchema,            // Track players joining
  PlayerLeftSchema,              // Track players leaving
  PlayerUpdateSchema,            // Track player state changes
  HostLobbyStatusUpdateSchema,   // Full question data for host
  UpdateLobbyAnswersSchema,      // Track answer count
  PlayerAnswerResultSchema,      // (unused by host but kept for union completeness)
  PlayerKickedSchema,            // (unused by host but kept for union completeness)
  LobbyDeletedSchema,            // Notify host that the lobby was closed
  LobbyJoinedSchema,             // Sync lobby state on (re)connect
  ServerErrorSchema,             // Server error notifications
  HostStatusSchema,              // (unused by host but kept for union completeness)
]);
export type AllHostServerEvents = z.infer<typeof AllHostServerEventsSchema>;

// ── Sent to Players ───────────────────────────────────────────────────────────
// Includes SafeQuestion (no `correct`) in LOBBY_STATUS_UPDATE.

export const AllPlayerServerEventsSchema = z.discriminatedUnion("event", [
  PlayerJoinedSchema,            // (unused by players but kept for union completeness)
  PlayerLeftSchema,              // (unused by players but kept for union completeness)
  PlayerUpdateSchema,            // Track own player state changes
  LobbyStatusUpdateSchema,       // Sanitized question data for players
  UpdateLobbyAnswersSchema,      // (unused by players but kept for union completeness)
  PlayerAnswerResultSchema,      // Notify player of their answer result
  PlayerKickedSchema,            // Notify player they were kicked
  LobbyDeletedSchema,            // Notify player the lobby was closed
  LobbyJoinedSchema,             // Sync lobby state on (re)connect
  ServerErrorSchema,             // Server error notifications
  HostStatusSchema,              // Notify players of host connection status
]);
export type AllPlayerServerEvents = z.infer<typeof AllPlayerServerEventsSchema>;

// ── Convenience union (used where host/player distinction doesn't matter) ─────
// Uses the player (safe) variant of LOBBY_STATUS_UPDATE.

export const AllServerEventsSchema = AllPlayerServerEventsSchema;
export type AllServerEvents = AllPlayerServerEvents;