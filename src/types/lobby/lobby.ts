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
  position: z.number().int(),
  streak: z.number().int().default(0),
  isConnected: z.boolean().default(true),
});

export type Player = z.infer<typeof PlayerSchema>;

export const LobbySettingsSchema = z.object({
  customNames: z.boolean().default(false),
  displayOnDevice: z.boolean().default(false),
  joinMidGame: z.boolean().default(true),
  showLink: z.boolean().default(true),
  playerLimit: z.object({
    enabled: z.boolean().default(false),
    limit: z.number().int().default(20),
  }),
});

export type LobbySettings = z.infer<typeof LobbySettingsSchema>;

export const LobbySchema = z.object({
  code: z.string().length(6),
  hostId: z.string(),
  hostConnected: z.boolean().default(false),
  quiz: QuizSchema,
  players: z.array(PlayerSchema),
  status: LobbyStatusSchema,
  timeoutStartedAt: z.number().nullable(),
  duration: z.number().nullable(),
  currentStep: z.number().int().nonnegative(),
  currentAnswers: z.array(AnswerSchema),
  answers: z.array(AnswerSchema),
  results: z.array(z.array(AnswerSchema)),
  settings: LobbySettingsSchema,
});

export type Lobby = z.infer<typeof LobbySchema>;