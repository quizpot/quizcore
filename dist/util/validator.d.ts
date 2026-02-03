import { MultipleChoiceQuestionAnswer } from "../questions/multiple-choice";
import { ShortAnswerQuestionAnswer } from "../questions/short-answer";
import { TrueFalseQuestionAnswer } from "../questions/true-false";
import { Question } from "../types/quizfile";
export type SubmittedAnswer = MultipleChoiceQuestionAnswer | TrueFalseQuestionAnswer | ShortAnswerQuestionAnswer;
export interface Answer {
    playerId: string;
    submission: SubmittedAnswer;
    timeTaken: number;
    isCorrect: boolean;
    pointsAwarded: number;
}
export declare const isCorrect: (question: Question, submission: SubmittedAnswer) => boolean;
//# sourceMappingURL=validator.d.ts.map