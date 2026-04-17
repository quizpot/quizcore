import z from "zod";
import { LobbyStatusSchema } from "../lobby";
import { QuizInfoSchema } from "../quiz";
import { SafeQuestionSchema } from "../quiz/safe-question";

export const PlayerLobbyStateSchema = z.object({
  code: z.string(),
  status: LobbyStatusSchema,
  currentStep: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentQuestion: z.optional(SafeQuestionSchema),
  timeout: z.optional(z.iso.datetime()),
});

export type PlayerLobbyState = z.infer<typeof PlayerLobbyStateSchema>;