import z from "zod";
import { LobbyStatus, PlayerSchema } from "../../lobby/lobby";
import { AnswerSchema } from "../../../util/validator";
import { SlideLayoutSchema } from "../../quiz/slide";
import { SafeQuestionSchema } from "../../quiz/safe-question";
import { QuestionSchema } from "../../quiz/question";

// ── Shared payloads (identical for host and player) ───────────────────────────

const WaitingPayload = z.object({ status: z.literal(LobbyStatus.waiting) });

const SlidePayload = z.object({
  status: z.literal(LobbyStatus.slide),
  slide: SlideLayoutSchema,
});

const AnswerPayload = z.object({
  status: z.literal(LobbyStatus.answer),
  timeoutStartedAt: z.number(),
  duration: z.number(),
});

const AnswersPayload = z.object({
  status: z.literal(LobbyStatus.answers),
  answers: z.array(AnswerSchema).optional(),
});

const ScorePayload = z.object({
  status: z.literal(LobbyStatus.score),
  leaderboard: z.array(PlayerSchema),
});

const EndPayload = z.object({ status: z.literal(LobbyStatus.end) });

// ── Question payloads (diverge on question schema) ────────────────────────────

/** Players receive a sanitized question — `correct` is stripped from choices. */
const PlayerQuestionPayload = z.object({
  status: z.literal(LobbyStatus.question),
  question: SafeQuestionSchema,
  timeoutStartedAt: z.number(),
  duration: z.number(),
});

/** Host receives the full question — `correct` is present on each choice. */
const HostQuestionPayload = z.object({
  status: z.literal(LobbyStatus.question),
  question: QuestionSchema,
  timeoutStartedAt: z.number(),
  duration: z.number(),
});

// ── Player-facing schema ──────────────────────────────────────────────────────

export const LobbyStatusUpdateSchema = z.object({
  event: z.literal("LOBBY_STATUS_UPDATE"),
  stepNumber: z.number(),
  payload: z.discriminatedUnion("status", [
    WaitingPayload,
    SlidePayload,
    PlayerQuestionPayload,
    AnswerPayload,
    AnswersPayload,
    ScorePayload,
    EndPayload,
  ]),
});

export type LobbyStatusUpdate = z.infer<typeof LobbyStatusUpdateSchema>;

export const createLobbyStatusUpdateEvent = (
  stepNumber: number,
  payload: LobbyStatusUpdate["payload"]
): LobbyStatusUpdate => {
  return LobbyStatusUpdateSchema.parse({
    event: "LOBBY_STATUS_UPDATE",
    stepNumber,
    payload,
  });
};

// ── Host-facing schema ────────────────────────────────────────────────────────

export const HostLobbyStatusUpdateSchema = z.object({
  event: z.literal("LOBBY_STATUS_UPDATE"),
  stepNumber: z.number(),
  payload: z.discriminatedUnion("status", [
    WaitingPayload,
    SlidePayload,
    HostQuestionPayload,
    AnswerPayload,
    AnswersPayload,
    ScorePayload,
    EndPayload,
  ]),
});

export type HostLobbyStatusUpdate = z.infer<typeof HostLobbyStatusUpdateSchema>;

export const createHostLobbyStatusUpdateEvent = (
  stepNumber: number,
  payload: HostLobbyStatusUpdate["payload"]
): HostLobbyStatusUpdate => {
  return HostLobbyStatusUpdateSchema.parse({
    event: "LOBBY_STATUS_UPDATE",
    stepNumber,
    payload,
  });
};