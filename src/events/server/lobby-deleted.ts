export type LobbyDeleted = {
  type: "LOBBY_DELETED";
  payload: { reason: string };
};

export const createLobbyDeletedEvent = (reason: string): LobbyDeleted => ({
  type: "LOBBY_DELETED",
  payload: { reason }
});