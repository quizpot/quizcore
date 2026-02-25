import { z } from "zod";

const QuestionPointsSchema = z.enum(["normalPoints", "doublePoints", "noPoints"]);

const ThemeSchema = z.object({
  color: z.string(),
  background: z.string().optional(),
});

const SlideLayoutSchema = z.discriminatedUnion("slideType", [
  z.object({ slideType: z.literal("title"), title: z.string(), subtitle: z.string().optional() }),
  z.object({ slideType: z.literal("titleAndText"), title: z.string(), text: z.string() }),
  z.object({ slideType: z.literal("titleAndTextWithImage"), title: z.string(), text: z.string(), imageHash: z.string().optional() }),
  z.object({ slideType: z.literal("comparison"), title: z.string(), left: z.string(), right: z.string() }),
  z.object({ slideType: z.literal("titleImageText"), title: z.string(), imageHash: z.string().optional(), text: z.string() }),
]);

const BaseQuestionSchema = z.object({
  question: z.string().min(1),
  imageHash: z.string().optional(),
  displayTime: z.number().min(0),
  timeLimit: z.number().min(1),
  points: QuestionPointsSchema,
});

const MultipleChoiceSchema = BaseQuestionSchema.extend({
  type: z.literal("multiple-choice"),
  options: z.array(z.object({ id: z.string(), text: z.string(), isCorrect: z.boolean() })).min(2),
});

const TrueFalseSchema = BaseQuestionSchema.extend({
  type: z.literal("true-false"),
  answer: z.boolean(),
});

const ShortAnswerSchema = BaseQuestionSchema.extend({
  type: z.literal("short-answer"),
  acceptedAnswers: z.array(z.string()).min(1),
});

const QuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceSchema,
  TrueFalseSchema,
  ShortAnswerSchema,
]);

// --- Quiz Steps ---
const QuizStepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("question"), data: QuestionSchema }),
  z.object({ type: z.literal("slide"), data: SlideLayoutSchema }),
]);

// --- Main QuizFile Schema ---
export const QuizFileSchema = z.object({
  id: z.string().uuid(),
  version: z.literal(2),
  title: z.string().min(1),
  description: z.string().optional(),
  theme: ThemeSchema,
  language: z.string().length(2), // ISO 639-1 format
  steps: z.array(QuizStepSchema).min(1),
  images: z.record(z.string(), z.string()), // Hash -> URL/Base64
  updatedAt: z.string().datetime(), // Validates ISO strings
  createdAt: z.string().datetime(),
});

// Infer the type from Zod so you don't have to maintain two definitions
export type QuizFile = z.infer<typeof QuizFileSchema>;