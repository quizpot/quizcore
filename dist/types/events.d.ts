import { LobbyStatus, Player, LobbySettings } from "./lobby";
import { SubmittedAnswer } from "../util/validator";
/**
 * Events sent FROM the Client TO the Server
 */
export declare namespace ClientEvents {
    type JoinRoom = {
        type: "JOIN_ROOM";
        payload: {
            code: string;
            name: string;
        };
    };
    type SubmitAnswer = {
        type: "SUBMIT_ANSWER";
        payload: {
            submission: SubmittedAnswer;
        };
    };
    type NextStep = {
        type: "NEXT_STEP";
    };
    type All = JoinRoom | SubmitAnswer | NextStep;
}
/**
 * Events sent FROM the Server TO the Client
 */
export declare namespace ServerEvents {
    type LobbyUpdate = {
        type: "LOBBY_UPDATE";
        payload: {
            status: LobbyStatus;
            players: Player[];
            currentStepIndex: number;
            stepStartedAt: number | null;
            settings: LobbySettings;
        };
    };
    type GameError = {
        type: "ERROR";
        payload: {
            message: string;
            code: number;
        };
    };
    type All = LobbyUpdate | GameError;
}
//# sourceMappingURL=events.d.ts.map