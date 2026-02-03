import { PlayerAnswerResult } from "../events/server/player-answer-result";
import { Lobby } from "../types/lobby";
import { SubmittedAnswer } from "../util/validator";
export declare const advanceLobby: (lobby: Lobby) => Lobby;
export type SubmissionResult = {
    nextLobby: Lobby;
    result: PlayerAnswerResult;
};
export declare const handleSubmission: (lobby: Lobby, playerId: string, submission: SubmittedAnswer) => SubmissionResult | null;
//# sourceMappingURL=lobby-manager.d.ts.map