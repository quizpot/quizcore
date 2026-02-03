import { Player } from "../../types/lobby";
export type PlayerUpdate = {
    type: "PLAYER_UPDATE";
    payload: {
        player: Player;
    };
};
export declare const createPlayerUpdateEvent: (player: Player) => PlayerUpdate;
//# sourceMappingURL=player-update.d.ts.map