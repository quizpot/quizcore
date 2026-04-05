import { Lobby, LobbySettings, LobbyStatus, Player } from "../types/lobby";
import { QuizFile } from "../types/quizfile";

export const LobbyActions = {
  generateCode(): string {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
  },

  create(code: string, host: string, quiz: QuizFile, settings: LobbySettings): Lobby {
    return {
      code,
      host,
      quiz,
      quizInfo: {
        title: quiz.title,
        stepCount: quiz.steps.length,
        theme: quiz.theme,
      },
      players: [],
      status: LobbyStatus.waiting,
      timeoutStartedAt: null,
      duration: null,
      currentStep: 0,
      currentAnswers: [],
      answers: [],
      settings,
    };
  },

  playerConnected: (lobby: Lobby, player: Player): Lobby => {
    const isAlreadyIn: boolean = lobby.players.some((p: Player) => p.id === player.id);
    if (isAlreadyIn) {
      return {
        ...lobby,
        players: lobby.players.map((p: Player) => p.id === player.id ? { ...p, isConnected: true } : p)
      };
    }

    return {
      ...lobby,
      players: [...lobby.players, player]
    };
  },

  playerDisconnected: (lobby: Lobby, player: Player): Lobby => {
    const isAlreadyIn: boolean = lobby.players.some((p: Player) => p.id === player.id);
    if (!isAlreadyIn) return lobby;

    if (lobby.status === 'waiting') {
      return {
        ...lobby,
        players: lobby.players.filter((p: Player) => p.id !== player.id)
      };
    }

    return {
      ...lobby,
      players: lobby.players.map((p: Player) => p.id === player.id ? { ...p, isConnected: false } : p)
    };
  },
  
};