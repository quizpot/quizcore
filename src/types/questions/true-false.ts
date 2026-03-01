import z from "zod";
import { BaseQuestionSchema } from "../question";

export const TrueFalseQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("true-false"),
  answer: z.boolean(),
  labels: z.array(z.string()).min(2).max(2),
});

export type TrueFalseQuestion = z.infer<typeof TrueFalseQuestionSchema>;

export const SafeTrueFalseQuestionSchema = TrueFalseQuestionSchema.omit({ answer: true });

export type SafeTrueFalseQuestion = z.infer<typeof SafeTrueFalseQuestionSchema>;

export const TrueFalseQuestionAnswerSchema = z.object({
  type: z.literal("true-false"),
  answer: z.boolean(),
});

export type TrueFalseQuestionAnswer = z.infer<typeof TrueFalseQuestionAnswerSchema>;
