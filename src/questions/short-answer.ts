import { BaseQuestion } from "../quizfile";

export interface ShortAnswerQuestion extends BaseQuestion {
  questionType: "shortAnswer";
  answers: string[];
}

export interface SafeShortAnswerQuestion extends Omit<ShortAnswerQuestion, "answers"> {}

export interface ShortAnswerQuestionAnswer {
  type: "shortAnswer";
  answer: string;
}