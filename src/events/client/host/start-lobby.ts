export type StartLobby = {
  type: "START_LOBBY";
  payload: {};
};

export const createStartLobbyEvent = (): StartLobby => ({
  type: "START_LOBBY",
  payload: {}
});