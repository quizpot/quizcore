import z from "zod";
import { BaseQuestionSchema } from "../question";

export const ChoiceSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});

export type Choice = z.infer<typeof ChoiceSchema>;

export const SafeChoiceSchema = ChoiceSchema.omit({ correct: true });

export type SafeChoice = z.infer<typeof SafeChoiceSchema>;

export const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("multiple-choice"),
  choices: z.array(ChoiceSchema).min(2),
  matchAll: z.boolean(),
});

export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;

export const SafeMultipleChoiceQuestionSchema = MultipleChoiceQuestionSchema.omit({ 
  choices: true 
}).extend({
  choices: z.array(SafeChoiceSchema).min(2),
});

export type SafeMultipleChoiceQuestion = z.infer<typeof SafeMultipleChoiceQuestionSchema>;

export const MultipleChoiceQuestionAnswerSchema = z.object({
  type: z.literal("multiple-choice"),
  choices: z.array(z.number()).min(1),
});

export type MultipleChoiceQuestionAnswer = z.infer<typeof MultipleChoiceQuestionAnswerSchema>;