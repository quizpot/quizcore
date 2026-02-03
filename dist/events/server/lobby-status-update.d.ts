import { LobbyStatus, Player } from "../../types/lobby";
import { SafeQuestion, SlideLayout } from "../../types/quizfile";
import { Answer } from "../../util/validator";
export type LobbyStatusUpdate = {
    type: "LOBBY_STATUS_UPDATE";
    payload: {
        status: LobbyStatus.waiting;
    } | {
        status: LobbyStatus.slide;
        slide: SlideLayout;
    } | {
        status: LobbyStatus.question;
        question: SafeQuestion;
        timeoutStartedAt: number;
        duration: number;
    } | {
        status: LobbyStatus.answer;
        timeoutStartedAt: number;
        duration: number;
    } | {
        status: LobbyStatus.answers;
        answers: Answer[];
    } | {
        status: LobbyStatus.score;
        leaderboard: Player[];
    } | {
        status: LobbyStatus.end;
    };
};
export declare const createLobbyStatusUpdateEvent: (payload: LobbyStatusUpdate["payload"]) => LobbyStatusUpdate;
//# sourceMappingURL=lobby-status-update.d.ts.map