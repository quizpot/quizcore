export const createSubmitAnswerEvent = (submission) => ({
    type: "SUBMIT_ANSWER",
    payload: { submission }
});
