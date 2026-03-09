import z from "zod";
import { BaseQuestionSchema } from "../types/quizfile";

export const ShortAnswerQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal("shortAnswer"),
  answers: z.array(z.string()),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

export const SafeShortAnswerQuestionSchema = ShortAnswerQuestionSchema.omit({
  answers: true,
});

export type SafeShortAnswerQuestion = z.infer<typeof SafeShortAnswerQuestionSchema>;

export const ShortAnswerQuestionAnswerSchema = z.object({
  type: z.literal("shortAnswer"),
  answer: z.string(),
});

export type ShortAnswerQuestionAnswer = z.infer<typeof ShortAnswerQuestionAnswerSchema>;