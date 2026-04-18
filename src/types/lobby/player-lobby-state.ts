import z from "zod";
import { LobbyStatusSchema, PlayerSchema } from "./lobby";
import { QuizInfoSchema } from "../quiz/quiz";
import { SafeQuestionSchema } from "../quiz/safe-question";

export const PlayerLobbyStateSchema = z.object({
  code: z.string(),
  me: PlayerSchema,
  status: LobbyStatusSchema,
  stepNumber: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentQuestion: z.optional(SafeQuestionSchema),
  timeout: z.optional(z.iso.datetime()),
});

export type PlayerLobbyState = z.infer<typeof PlayerLobbyStateSchema>;