export type PlayerKicked = {
  type: "PLAYER_KICKED";
  payload: {};
};

export const createPlayerKickedEvent = (): PlayerKicked => ({
  type: "PLAYER_KICKED",
  payload: {}
});