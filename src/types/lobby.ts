import z from "zod";
import { AnswerSchema } from "../util/validator";
import { QuizFileSchema, QuizThemeSchema } from "./quizfile";

export enum LobbyStatus {
  waiting = 'waiting',
  slide = 'slide',
  question = 'question',
  answer = 'answer',
  answers = 'answers',
  score = 'score',
  end = 'end',
}

export const LobbyStatusSchema = z.enum(LobbyStatus);

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

export const LobbySchema = z.object({
  code: z.string().length(6),
  host: z.string(),
  quiz: QuizFileSchema,
  quizInfo: z.object({
    title: z.string(),
    stepCount: z.number().int().nonnegative(),
    theme: QuizThemeSchema,
  }),
  players: z.array(PlayerSchema),
  status: LobbyStatusSchema,
  timeoutStartedAt: z.number().nullable(),
  duration: z.number().nullable(),
  currentStep: z.number().int().nonnegative(),
  currentAnswers: z.array(AnswerSchema),
  answers: z.array(AnswerSchema),
  settings: LobbySettingsSchema,
});

export type Lobby = z.infer<typeof LobbySchema>;