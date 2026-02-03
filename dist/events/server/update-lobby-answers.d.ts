export type UpdateLobbyAnswers = {
    type: "UPDATE_LOBBY_ANSWERS";
    payload: {
        count: number;
    };
};
export declare const createUpdateLobbyAnswersEvent: (count: number) => UpdateLobbyAnswers;
//# sourceMappingURL=update-lobby-answers.d.ts.map