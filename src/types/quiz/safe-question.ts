import z from "zod";
import { SafeMultipleChoiceQuestion, SafeMultipleChoiceQuestionSchema } from "../questions/multiple-choice";
import { SafeShortAnswerQuestion, SafeShortAnswerQuestionSchema } from "../questions/short-answer";
import { SafeTrueFalseQuestion, SafeTrueFalseQuestionSchema } from "../questions/true-false";

export type SafeQuestion =
  | SafeMultipleChoiceQuestion
  | SafeTrueFalseQuestion
  | SafeShortAnswerQuestion;

export const SafeQuestionSchema = z.discriminatedUnion("type", [
  SafeMultipleChoiceQuestionSchema,
  SafeTrueFalseQuestionSchema,
  SafeShortAnswerQuestionSchema,
]);