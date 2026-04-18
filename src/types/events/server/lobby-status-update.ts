import z from "zod";
import { LobbyStatus, PlayerSchema } from "../../lobby";
import { SafeQuestionSchema, SlideLayoutSchema } from "../../quizfile";
import { AnswerSchema } from "../../../util/validator";

const WaitingPayload = z.object({ status: z.literal(LobbyStatus.waiting) });

const SlidePayload = z.object({ 
  status: z.literal(LobbyStatus.slide), 
  slide: SlideLayoutSchema 
});

const QuestionPayload = z.object({ 
  status: z.literal(LobbyStatus.question), 
  question: SafeQuestionSchema, 
  timeoutStartedAt: z.number(), 
  duration: z.number() 
});

const AnswerPayload = z.object({ 
  status: z.literal(LobbyStatus.answer), 
  timeoutStartedAt: z.number(), 
  duration: z.number() 
});

const AnswersPayload = z.object({ 
  status: z.literal(LobbyStatus.answers), 
  answers: z.array(AnswerSchema) 
});

const ScorePayload = z.object({ 
  status: z.literal(LobbyStatus.score), 
  leaderboard: z.array(PlayerSchema) 
});

const EndPayload = z.object({ status: z.literal(LobbyStatus.end) });

export const LobbyStatusUpdateSchema = z.object({
  type: z.literal("LOBBY_STATUS_UPDATE"),
  payload: z.discriminatedUnion("status", [
    WaitingPayload,
    SlidePayload,
    QuestionPayload,
    AnswerPayload,
    AnswersPayload,
    ScorePayload,
    EndPayload,
  ]),
});

export type LobbyStatusUpdate = z.infer<typeof LobbyStatusUpdateSchema>;

export const createLobbyStatusUpdateEvent = (
  payload: LobbyStatusUpdate["payload"]
): LobbyStatusUpdate => {
  return LobbyStatusUpdateSchema.parse({
    type: "LOBBY_STATUS_UPDATE",
    payload,
  });
};