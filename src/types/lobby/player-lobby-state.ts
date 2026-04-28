import z from "zod";
import { LobbyStatusSchema, PlayerSchema } from "./lobby";
import { QuizInfoSchema } from "../quiz/quiz";
import { SafeQuestionSchema } from "../quiz/safe-question";
import { QuizStepSchema } from "../quiz/step";

export const PlayerLobbyStateSchema = z.object({
  code: z.string(),
  me: PlayerSchema,
  status: LobbyStatusSchema,
  hostConnected: z.boolean(),
  stepNumber: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentStep: z.optional(QuizStepSchema),
  timeout: z.optional(z.iso.datetime()),
  hasAnswered: z.boolean(),
  wasCorrect: z.boolean(),
});

export type PlayerLobbyState = z.infer<typeof PlayerLobbyStateSchema>;