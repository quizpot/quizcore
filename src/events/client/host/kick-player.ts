export type KickPlayer = {
  type: "KICK_PLAYER";
  payload: { playerId: string };
};

export const createKickPlayerEvent = (playerId: string): KickPlayer => ({
  type: "KICK_PLAYER",
  payload: { playerId }
});