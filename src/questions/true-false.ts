import z from "zod";
import { BaseQuestionSchema } from "../types/quizfile";

export const TrueFalseQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal("trueFalse"),
  answer: z.boolean(),
});

export type TrueFalseQuestion = z.infer<typeof TrueFalseQuestionSchema>;

export const SafeTrueFalseQuestionSchema = TrueFalseQuestionSchema.omit({
  answer: true,
});

export type SafeTrueFalseQuestion = z.infer<typeof SafeTrueFalseQuestionSchema>;

export const TrueFalseQuestionAnswerSchema = z.object({
  type: z.literal("trueFalse"),
  answer: z.boolean(),
});

export type TrueFalseQuestionAnswer = z.infer<typeof TrueFalseQuestionAnswerSchema>;