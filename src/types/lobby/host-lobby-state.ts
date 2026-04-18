import z from "zod";
import { LobbyStatusSchema, PlayerSchema } from "../lobby";
import { QuizInfoSchema } from "../quiz";
import { QuestionSchema } from "../quiz/question";
import { SubmittedAnswerSchema } from "../../util/validator";

export const HostLobbyStateSchema = z.object({
  code: z.string(),
  status: LobbyStatusSchema,
  players: z.array(PlayerSchema),
  currentStep: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentQuestion: z.optional(QuestionSchema),
  answers: z.array(SubmittedAnswerSchema),
  timeout: z.optional(z.iso.datetime()),
});

export type HostLobbyState = z.infer<typeof HostLobbyStateSchema>;