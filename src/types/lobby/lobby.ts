import z from "zod";
import { AnswerSchema } from "../../util/validator";
import { QuizSchema } from "../quiz/quiz";

export const LobbyStatusSchema = z.enum([
  'waiting',
  'slide',
  'question',
  'answer',
  'answers',
  'score',
  'end'
]);

export const LobbyStatus = LobbyStatusSchema.enum;
export type LobbyStatus = z.infer<typeof LobbyStatusSchema>;

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().int().default(0),
  streak: z.number().int().default(0),
  isConnected: z.boolean().default(true),
});

export type Player = z.infer<typeof PlayerSchema>;

export const LobbySettingsSchema = z.object({
  customNames: z.boolean(),
  displayOnDevice: z.boolean(),
});

export type LobbySettings = z.infer<typeof LobbySettingsSchema>;

export const LobbyStateSchema = z.object({
  code: z.string().length(6),
  host: z.string(),
  quiz: QuizSchema,
  players: z.array(PlayerSchema),
  status: LobbyStatusSchema,
  timeoutStartedAt: z.number().nullable(),
  duration: z.number().nullable(),
  currentStep: z.number().int().nonnegative(),
  currentAnswers: z.array(AnswerSchema),
  answers: z.array(AnswerSchema),
  settings: LobbySettingsSchema,
});

export type LobbyState = z.infer<typeof LobbyStateSchema>;