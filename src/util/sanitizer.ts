import { Question, SafeQuestion } from "../types/question";
import { isMultipleChoice, isShortAnswer, isTrueFalse } from "./guards";

export const sanitizeQuestion = (question: Question): SafeQuestion => {
  if (isMultipleChoice(question)) {
    return {
      ...question,
      choices: question.choices.map(({ text }) => ({ text })),
    };
  }

  if (isTrueFalse(question)) {
    const { answer, ...sanitized } = question;
    return sanitized;
  }

  if (isShortAnswer(question)) {
    const { answers, ...sanitized } = question;
    return sanitized;
  }

  throw new Error("Invalid question type");
};