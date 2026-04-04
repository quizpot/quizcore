import { LobbyStatus, Player } from "../../types/lobby";
import { SafeQuestion } from "../../types/question";
import { Slide } from "../../types/slide";
import { Answer } from "../../util/validator";

export type LobbyStatusUpdate = {
  type: "LOBBY_STATUS_UPDATE";
  payload: 
    | { status: LobbyStatus.waiting }
    | { status: LobbyStatus.slide; slide: Slide }
    | { status: LobbyStatus.question; question: SafeQuestion; timeoutStartedAt: number; duration: number }
    | { status: LobbyStatus.answer; timeoutStartedAt: number; duration: number }
    | { status: LobbyStatus.answers; answers: Answer[] }
    | { status: LobbyStatus.score; leaderboard: Player[] }
    | { status: LobbyStatus.end };
};

export const createLobbyStatusUpdateEvent = (
  payload: LobbyStatusUpdate["payload"]
): LobbyStatusUpdate => ({
  type: "LOBBY_STATUS_UPDATE",
  payload,
});