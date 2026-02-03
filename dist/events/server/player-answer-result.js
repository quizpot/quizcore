export const createPlayerAnswerResultEvent = (isCorrect, pointsAwarded, score, streak) => ({
    type: "PLAYER_ANSWER_RESULT",
    payload: { isCorrect, pointsAwarded, score, streak }
});
