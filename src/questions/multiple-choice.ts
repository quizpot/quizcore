import { BaseQuestion } from "../types/quizfile";

export interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: "multipleChoice";
  choices: Choice[];
  matchAll: boolean;
}

export interface Choice {
  text: string;
  correct: boolean;
}

export interface SafeMultipleChoiceQuestion extends Omit<MultipleChoiceQuestion, "choices"> {
  choices: SafeChoice[];
  matchAll: boolean;
}

export interface SafeChoice {
  text: string;
}

export interface MultipleChoiceQuestionAnswer {
  type: "multipleChoice";
  choices: number[];
}