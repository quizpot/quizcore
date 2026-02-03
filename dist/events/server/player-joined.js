export const createPlayerJoinedEvent = (player) => ({
    type: "PLAYER_JOINED",
    payload: { player }
});
