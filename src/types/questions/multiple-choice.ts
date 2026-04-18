import z from "zod";
import { BaseQuestionSchema } from "../quiz/base-question";

export const ChoiceSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});

export type Choice = z.infer<typeof ChoiceSchema>;

export const SafeChoiceSchema = ChoiceSchema.omit({ correct: true });

export type SafeChoice = z.infer<typeof SafeChoiceSchema>;

export const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal("multipleChoice"),
  choices: z.array(ChoiceSchema),
  matchAll: z.boolean(),
});

export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;

export const SafeMultipleChoiceQuestionSchema = MultipleChoiceQuestionSchema.extend({
  choices: z.array(SafeChoiceSchema),
});

export type SafeMultipleChoiceQuestion = z.infer<typeof SafeMultipleChoiceQuestionSchema>;

export const MultipleChoiceQuestionAnswerSchema = z.object({
  type: z.literal("multipleChoice"),
  choices: z.array(z.number()),
});

export type MultipleChoiceQuestionAnswer = z.infer<typeof MultipleChoiceQuestionAnswerSchema>;