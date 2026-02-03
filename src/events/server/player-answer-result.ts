export type PlayerAnswerResult = {
  type: "PLAYER_ANSWER_RESULT";
  payload: {
    isCorrect: boolean;
    pointsAwarded: number;
    score: number;
    streak: number;
  };
};

export const createPlayerAnswerResultEvent = (
  isCorrect: boolean, 
  pointsAwarded: number, 
  score: number, 
  streak: number
): PlayerAnswerResult => ({
  type: "PLAYER_ANSWER_RESULT",
  payload: { isCorrect, pointsAwarded, score, streak }
});