import z from "zod";
import { MultipleChoiceQuestion, MultipleChoiceQuestionSchema } from "../questions/multiple-choice";
import { ShortAnswerQuestion, ShortAnswerQuestionSchema } from "../questions/short-answer";
import { TrueFalseQuestion, TrueFalseQuestionSchema } from "../questions/true-false";

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export const QuestionSchema = z.discriminatedUnion("type", [
  MultipleChoiceQuestionSchema,
  TrueFalseQuestionSchema,
  ShortAnswerQuestionSchema,
]);