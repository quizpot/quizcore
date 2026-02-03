import { isMultipleChoice, isShortAnswer, isTrueFalse } from "../util/guards";
import { MultipleChoiceQuestionAnswer } from "../questions/multiple-choice";
import { ShortAnswerQuestionAnswer } from "../questions/short-answer";
import { TrueFalseQuestionAnswer } from "../questions/true-false";
import { Question } from "../types/quizfile";

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
  if (isMultipleChoice(question) && submission.type === "multipleChoice") {
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

  if (isTrueFalse(question) && submission.type === "trueFalse") {
    return question.answer === submission.answer;
  }

  if (isShortAnswer(question) && submission.type === "shortAnswer") {
    const playerAns = submission.answer.trim().toLowerCase();
    return question.answers.some(ans => ans.trim().toLowerCase() === playerAns);
  }

  return false;
};