export type KickPlayer = {
    type: "KICK_PLAYER";
    payload: {
        playerId: string;
    };
};
export declare const createKickPlayerEvent: (playerId: string) => KickPlayer;
//# sourceMappingURL=kick-player.d.ts.map