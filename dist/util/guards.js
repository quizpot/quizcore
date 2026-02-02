export const isQuestion = (step) => {
    return step.type === "question";
};
export const isSlide = (step) => {
    return step.type === "slide";
};
export const isMultipleChoice = (data) => {
    return data.questionType === "multipleChoice";
};
export const isTrueFalse = (data) => {
    return data.questionType === "trueFalse";
};
export const isShortAnswer = (data) => {
    return data.questionType === "shortAnswer";
};
