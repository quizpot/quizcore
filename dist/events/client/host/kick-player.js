export const createKickPlayerEvent = (playerId) => ({
    type: "KICK_PLAYER",
    payload: { playerId }
});
