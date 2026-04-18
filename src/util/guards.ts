import { MultipleChoiceQuestion } from "../types/questions/multiple-choice";
import { ShortAnswerQuestion } from "../types/questions/short-answer";
import { TrueFalseQuestion } from "../types/questions/true-false";
import { Question } from "../types/quiz/question";
import { SlideLayout } from "../types/quiz/slide";
import { QuizStep } from "../types/quiz/step";

export const isQuestion = (step: QuizStep): step is { type: "question"; data: Question } => {
  return step.type === "question";
};

export const isSlide = (step: QuizStep): step is { type: "slide"; data: Slide } => {
  return step.type === "slide";
};

export const isMultipleChoice = (data: Question): data is MultipleChoiceQuestion => {
  return data.type === "multiple-choice";
};

export const isTrueFalse = (data: Question): data is TrueFalseQuestion => {
  return data.type === "true-false";
};

export const isShortAnswer = (data: Question): data is ShortAnswerQuestion => {
  return data.type === "short-answer";
};