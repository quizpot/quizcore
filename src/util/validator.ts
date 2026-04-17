import { MultipleChoiceQuestionAnswerSchema } from "../types/questions/multiple-choice";
import { ShortAnswerQuestionAnswerSchema } from "../types/questions/short-answer";
import { TrueFalseQuestionAnswerSchema } from "../types/questions/true-false";
import { Question } from "../types/quiz/question";
import { isMultipleChoice, isShortAnswer, isTrueFalse } from "../util/guards"
import z from "zod";

export const SubmittedAnswerSchema = z.discriminatedUnion("type", [
  MultipleChoiceQuestionAnswerSchema,
  TrueFalseQuestionAnswerSchema,
  ShortAnswerQuestionAnswerSchema,
]);

export type SubmittedAnswer = z.infer<typeof SubmittedAnswerSchema>;

export const AnswerSchema = z.object({
  playerId: z.uuid(),
  submission: SubmittedAnswerSchema,
  timeTaken: z.number().nonnegative(),
  isCorrect: z.boolean(),
  pointsAwarded: z.number().min(0),
});

export type Answer = z.infer<typeof AnswerSchema>;

export const isCorrect = (question: Question, submission: SubmittedAnswer): boolean => {
  if (submission.type === "multipleChoice" && isMultipleChoice(question)) {
    const correctIndices = question.choices
      .map((c, i) => (c.correct ? i : -1))
      .filter((i) => i !== -1);

    if (question.matchAll) {
      return (
        submission.choices.length === correctIndices.length &&
        submission.choices.every((index) => correctIndices.includes(index))
      );
    }

    if (submission.choices.length === 0) return false;

    return submission.choices.every(index => question.choices[index]?.correct);
  }

  if (isTrueFalse(question) && submission.type === "trueFalse") {
    return question.answer === submission.answer;
  }

  if (isShortAnswer(question) && submission.type === "shortAnswer") {
    const playerAns = submission.answer.trim().toLowerCase();
    return question.answers.some(ans => ans.trim().toLowerCase() === playerAns);
  }

  return false;
};