import { BaseQuestion } from "../types/quizfile";
export interface TrueFalseQuestion extends BaseQuestion {
    questionType: "trueFalse";
    answer: boolean;
}
export interface SafeTrueFalseQuestion extends Omit<TrueFalseQuestion, "answer"> {
}
export interface TrueFalseQuestionAnswer {
    type: "trueFalse";
    answer: boolean;
}
//# sourceMappingURL=true-false.d.ts.map