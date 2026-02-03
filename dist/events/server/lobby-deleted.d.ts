export type LobbyDeleted = {
    type: "LOBBY_DELETED";
    payload: {
        reason: string;
    };
};
export declare const createLobbyDeletedEvent: (reason: string) => LobbyDeleted;
//# sourceMappingURL=lobby-deleted.d.ts.map