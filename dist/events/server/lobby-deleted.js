export const createLobbyDeletedEvent = (reason) => ({
    type: "LOBBY_DELETED",
    payload: { reason }
});
