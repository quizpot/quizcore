export type UpdateLobbyAnswers = {
  type: "UPDATE_LOBBY_ANSWERS";
  payload: { count: number };
};

export const createUpdateLobbyAnswersEvent = (count: number): UpdateLobbyAnswers => ({
  type: "UPDATE_LOBBY_ANSWERS",
  payload: { count }
});