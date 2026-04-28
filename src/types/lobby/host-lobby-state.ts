import z from "zod";
import { LobbyStatusSchema, PlayerSchema } from "./lobby";
import { QuizInfoSchema } from "../quiz/quiz";
import { SubmittedAnswerSchema } from "../../util/validator";
import { QuizStepSchema } from "../quiz/step";

export const HostLobbyStateSchema = z.object({
  code: z.string(),
  status: LobbyStatusSchema,
  players: z.array(PlayerSchema),
  stepNumber: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentStep: z.optional(QuizStepSchema),
  answers: z.array(SubmittedAnswerSchema),
  timeout: z.optional(z.iso.datetime()),
});

export type HostLobbyState = z.infer<typeof HostLobbyStateSchema>;