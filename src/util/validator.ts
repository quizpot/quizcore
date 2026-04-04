import { isMultipleChoice, isShortAnswer, isTrueFalse } from "../util/guards";
import { ShortAnswerQuestionAnswer } from "../types/questions/short-answer";
import { TrueFalseQuestionAnswer } from "../types/questions/true-false";
import { MultipleChoiceQuestionAnswer } from "../types/questions/multiple-choice";
import { Question } from "../types/question";

export type SubmittedAnswer = 
  | MultipleChoiceQuestionAnswer
  | TrueFalseQuestionAnswer 
  | ShortAnswerQuestionAnswer;

export interface Answer {
  playerId: string;
  submission: SubmittedAnswer;
  timeTaken: number;
  isCorrect: boolean;
  pointsAwarded: number;
};

export const isCorrect = (question: Question, submission: SubmittedAnswer): boolean => {
  if (isMultipleChoice(question) && submission.type === "multiple-choice") {
    if (question.matchAll) {
      const correctIndices = question.choices
        .map((c, i) => (c.correct ? i : -1))
        .filter((i) => i !== -1);

      return (
        submission.choices.length === correctIndices.length &&
        submission.choices.every((index) => correctIndices.includes(index))
      );
    }

    if (submission.choices.length === 0) return false;

    return submission.choices.every(index => {
      const choice = question.choices[index];
      return choice ? choice.correct : false;
    });
  }

  if (isTrueFalse(question) && submission.type === "true-false") {
    return question.answer === submission.answer;
  }

  if (isShortAnswer(question) && submission.type === "short-answer") {
    const playerAns = submission.answer.trim().toLowerCase();
    return question.answers.some(ans => ans.trim().toLowerCase() === playerAns);
  }

  return false;
};