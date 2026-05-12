import z from "zod";
import { LobbySettingsSchema, LobbyStatusSchema, PlayerSchema } from "./lobby";
import { QuizInfoSchema } from "../quiz/quiz";
import { AnswerSchema } from "../../util/validator";
import { QuizStepSchema } from "../quiz/step";

export const HostLobbyStateSchema = z.object({
  code: z.string(),
  status: LobbyStatusSchema,
  players: z.array(PlayerSchema),
  stepNumber: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentStep: z.optional(QuizStepSchema),
  answers: z.array(AnswerSchema),
  lobbySettings: LobbySettingsSchema,
  timeout: z.optional(z.iso.datetime()),
  answerCount: z.number().int().nonnegative(),
});

export type HostLobbyState = z.infer<typeof HostLobbyStateSchema>;