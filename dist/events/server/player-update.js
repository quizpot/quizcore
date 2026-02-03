export const createPlayerUpdateEvent = (player) => ({
    type: "PLAYER_UPDATE",
    payload: { player }
});
