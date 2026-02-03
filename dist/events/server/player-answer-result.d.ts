export type PlayerAnswerResult = {
    type: "PLAYER_ANSWER_RESULT";
    payload: {
        isCorrect: boolean;
        pointsAwarded: number;
        score: number;
        streak: number;
    };
};
export declare const createPlayerAnswerResultEvent: (isCorrect: boolean, pointsAwarded: number, score: number, streak: number) => PlayerAnswerResult;
//# sourceMappingURL=player-answer-result.d.ts.map