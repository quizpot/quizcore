import { isMultipleChoice, isShortAnswer, isTrueFalse } from "./guards";
import { MultipleChoiceQuestionAnswer } from "./questions/multiple-choice";
import { ShortAnswerQuestionAnswer } from "./questions/short-answer";
import { TrueFalseQuestionAnswer } from "./questions/true-false";
import { Question } from "./quizfile";

type Answer = MultipleChoiceQuestionAnswer | TrueFalseQuestionAnswer | ShortAnswerQuestionAnswer

export const validateAnswer = (question: Question, answer: Answer): boolean => {
  if (isMultipleChoice(question) && answer.type === "multipleChoice") {
    return question.choices[answer.choice]?.correct ?? false;
  }
  
  if (isTrueFalse(question) && answer.type === "trueFalse") {
    return question.answer === answer.answer;
  }
  
  if (isShortAnswer(question) && answer.type === "shortAnswer") {
    return question.answers.some(
      ans => ans.trim().toLowerCase() === answer.answer.trim().toLowerCase()
    );
  }

  return false;
};