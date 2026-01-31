import { MultipleChoiceQuestionAnswer } from "./questions/multiple-choice";
import { ShortAnswerQuestionAnswer } from "./questions/short-answer";
import { TrueFalseQuestionAnswer } from "./questions/true-false";
import { Question } from "./quizfile";
export type Answer = MultipleChoiceQuestionAnswer | TrueFalseQuestionAnswer | ShortAnswerQuestionAnswer;
export declare const validateAnswer: (question: Question, answer: Answer) => boolean;
//# sourceMappingURL=validator.d.ts.map