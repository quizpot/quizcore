import { MultipleChoiceQuestion } from "../questions/multiple-choice";
import { ShortAnswerQuestion } from "../questions/short-answer";
import { TrueFalseQuestion } from "../questions/true-false";
import { 
  QuizStep, 
  Question, 
  SlideLayout
} from "../types/quizfile";

export const isQuestion = (step: QuizStep): step is { type: "question"; data: Question } => {
  return step.type === "question";
};

export const isSlide = (step: QuizStep): step is { type: "slide"; data: SlideLayout } => {
  return step.type === "slide";
};

export const isMultipleChoice = (data: Question): data is MultipleChoiceQuestion => {
  return data.questionType === "multipleChoice";
};

export const isTrueFalse = (data: Question): data is TrueFalseQuestion => {
  return data.questionType === "trueFalse";
};

export const isShortAnswer = (data: Question): data is ShortAnswerQuestion => {
  return data.questionType === "shortAnswer";
};