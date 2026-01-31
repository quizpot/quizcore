import { MultipleChoiceQuestion } from "./questions/multiple-choice";
import { ShortAnswerQuestion } from "./questions/short-answer";
import { TrueFalseQuestion } from "./questions/true-false";
import { QuizStep, Question, SlideLayout } from "./quizfile";
export declare const isQuestion: (step: QuizStep) => step is {
    type: "question";
    data: Question;
};
export declare const isSlide: (step: QuizStep) => step is {
    type: "slide";
    data: SlideLayout;
};
export declare const isMultipleChoice: (data: Question) => data is MultipleChoiceQuestion;
export declare const isTrueFalse: (data: Question) => data is TrueFalseQuestion;
export declare const isShortAnswer: (data: Question) => data is ShortAnswerQuestion;
//# sourceMappingURL=guards.d.ts.map