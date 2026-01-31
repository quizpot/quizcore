import { BaseQuestion } from "../quizfile";

export interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: "multipleChoice"
  choices: Choice[]
}

export interface Choice {
  text: string
  correct: boolean
}

export interface SafeMultipleChoiceQuestion extends Omit<MultipleChoiceQuestion, "choices"> {
  choices: SafeChoice[]
}

export interface SafeChoice {
  text: string
}

export interface MultipleChoiceQuestionAnswer {
  type: "multipleChoice"
  choice: number
}