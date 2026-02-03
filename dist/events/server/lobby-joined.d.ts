import { Lobby, Player } from "../../types/lobby";
import { Answer } from "../../util/validator";
export type LobbyJoined = {
    type: "LOBBY_JOINED";
    payload: {
        lobby: Omit<Lobby, "host" | "quiz" | "players" | "currentAnswers" | "answers">;
        me?: Player;
        players?: Player[];
        currentAnswers?: Answer[];
        answers?: Answer[];
    };
};
export declare const createLobbyJoinedEvent: (lobby: Lobby, me: Player, isHost: boolean) => LobbyJoined;
//# sourceMappingURL=lobby-joined.d.ts.map