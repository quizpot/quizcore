import { Player } from "../../types/lobby";
export type PlayerJoined = {
    type: "PLAYER_JOINED";
    payload: {
        player: Player;
    };
};
export declare const createPlayerJoinedEvent: (player: Player) => PlayerJoined;
//# sourceMappingURL=player-joined.d.ts.map