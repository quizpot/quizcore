import z from "zod";
import { MultipleChoiceQuestion, MultipleChoiceQuestionSchema, SafeMultipleChoiceQuestion, SafeMultipleChoiceQuestionSchema } from "./questions/multiple-choice";
import { SafeTrueFalseQuestion, SafeTrueFalseQuestionSchema, TrueFalseQuestion, TrueFalseQuestionSchema } from "./questions/true-false";
import { SafeShortAnswerQuestion, SafeShortAnswerQuestionSchema, ShortAnswerQuestion, ShortAnswerQuestionSchema } from "./questions/short-answer";

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export const QuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceQuestionSchema,
  TrueFalseQuestionSchema,
  ShortAnswerQuestionSchema,
]);

export type SafeQuestion =
  | SafeMultipleChoiceQuestion
  | SafeTrueFalseQuestion
  | SafeShortAnswerQuestion;

export const SafeQuestionSchema = z.discriminatedUnion("type", [
  SafeMultipleChoiceQuestionSchema,
  SafeTrueFalseQuestionSchema,
  SafeShortAnswerQuestionSchema,
]);

export type QuestionPoints = z.infer<typeof QuestionPointsSchema>;

export const QuestionPointsSchema = z.enum(["normalPoints", "doublePoints", "noPoints"]);

export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;

export const BaseQuestionSchema = z.object({
  question: z.string().min(1),
  imageHash: z.hash("sha256", { error: "Invalid image hash" }).optional(),
  displayTime: z.number().min(1).max(60),
  timeLimit: z.number().min(1).max(180),
  points: QuestionPointsSchema,
});