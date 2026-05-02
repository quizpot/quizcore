import z from "zod";
import { LobbySettingsSchema, LobbyStatusSchema, PlayerSchema } from "./lobby";
import { QuizInfoSchema } from "../quiz/quiz";
import { SafeQuizStepSchema } from "../quiz/step";

export const PlayerLobbyStateSchema = z.object({
  code: z.string(),
  me: PlayerSchema,
  status: LobbyStatusSchema,
  hostConnected: z.boolean(),
  stepNumber: z.number().int().nonnegative(),
  quizInfo: QuizInfoSchema,
  currentStep: z.optional(SafeQuizStepSchema),
  timeout: z.optional(z.iso.datetime()),
  hasAnswered: z.boolean(),
  wasCorrect: z.boolean(),
  lobbySettings: LobbySettingsSchema
});

export type PlayerLobbyState = z.infer<typeof PlayerLobbyStateSchema>;