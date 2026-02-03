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

export const createLobbyJoinedEvent = (
  lobby: Lobby, 
  me: Player, 
  isHost: boolean
): LobbyJoined => ({
  type: "LOBBY_JOINED",
  payload: {
    lobby: {
      code: lobby.code,
      quizInfo: lobby.quizInfo,
      status: lobby.status,
      timeoutStartedAt: lobby.timeoutStartedAt,
      duration: lobby.duration,
      currentStep: lobby.currentStep,
      settings: lobby.settings,
    },
    me,
    players: isHost ? lobby.players : undefined,
    currentAnswers: isHost ? lobby.currentAnswers : undefined,
    answers: isHost ? lobby.answers : undefined,
  }
});