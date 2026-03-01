import z from "zod";
import { BaseQuestionSchema } from "../question";

export const ShortAnswerQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("short-answer"),
  answers: z.array(z.string()).min(1),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

export const SafeShortAnswerQuestionSchema = ShortAnswerQuestionSchema.omit({ answers: true });

export type SafeShortAnswerQuestion = z.infer<typeof SafeShortAnswerQuestionSchema>;

export const ShortAnswerQuestionAnswerSchema = z.object({
  type: z.literal("short-answer"),
  answer: z.string(),
});

export type ShortAnswerQuestionAnswer = z.infer<typeof ShortAnswerQuestionAnswerSchema>;
