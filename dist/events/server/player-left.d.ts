import { Player } from "../../types/lobby";
export type PlayerLeft = {
    type: "PLAYER_LEFT";
    payload: {
        player: Player;
    };
};
export declare const createPlayerLeftEvent: (player: Player) => PlayerLeft;
//# sourceMappingURL=player-left.d.ts.map