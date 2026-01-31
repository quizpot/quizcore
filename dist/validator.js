import { isMultipleChoice, isShortAnswer, isTrueFalse } from "./guards";
export const validateAnswer = (question, answer) => {
    if (isMultipleChoice(question) && answer.type === "multipleChoice") {
        return question.choices[answer.choice]?.correct ?? false;
    }
    if (isTrueFalse(question) && answer.type === "trueFalse") {
        return question.answer === answer.answer;
    }
    if (isShortAnswer(question) && answer.type === "shortAnswer") {
        return question.answers.some((ans) => ans.trim().toLowerCase() === answer.answer.trim().toLowerCase());
    }
    return false;
};
