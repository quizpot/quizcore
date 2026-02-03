export const createLobbyJoinedEvent = (lobby, me, isHost) => ({
    type: "LOBBY_JOINED",
    payload: {
        lobby: {
            code: lobby.code,
            quizInfo: lobby.quizInfo,
            status: lobby.status,
            timeoutStartedAt: lobby.timeoutStartedAt,
            duration: lobby.duration,
            currentStep: lobby.currentStep,
            settings: lobby.settings,
        },
        me,
        players: isHost ? lobby.players : undefined,
        currentAnswers: isHost ? lobby.currentAnswers : undefined,
        answers: isHost ? lobby.answers : undefined,
    }
});
