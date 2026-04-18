import { LobbySettings, LobbyState, LobbyStatus, Player } from "../types/lobby";
import { Quiz } from "../types/quiz";
import { isCorrect } from "../util/validator";

export type JoinResult = 
  | { type: "SUCCESS"; nextState: LobbyState; player: Player }
  | { type: "RECONNECT"; nextState: LobbyState; player: Player }
  | { type: "ERROR"; message: string };

export const LobbyManager = {
  create: (code: string, hostId: string, quiz: Quiz, settings: LobbySettings): LobbyState => ({
    code,
    host: hostId,
    quiz: quiz,
    status: LobbyStatus.waiting,
    players: [],
    currentStep: 0,
    answers: [],
    currentAnswers: [],
    duration: null,
    timeoutStartedAt: null,
    settings
  }),

  join: (state: LobbyState, playerId: string, name: string | null): JoinResult => {
    const existingPlayer = state.players.find(p => p.id === playerId);

    if (existingPlayer) {
      const nextState = {
        ...state,
        players: state.players.map(p => 
          p.id === playerId ? { ...p, isConnected: true } : p
        )
      };

      return { type: "RECONNECT", nextState, player: { ...existingPlayer, isConnected: true } };
    }

    let finalName = name;
    if (!state.settings.customNames || !finalName) {
      finalName = `Player ${state.players.length + 1}`;
    }

    const nameExists = state.players.some(p => p.name === finalName);
    if (nameExists) return { type: "ERROR", message: "Name already taken" };

    const newPlayer: Player = {
      id: playerId,
      name: finalName,
      score: 0,
      streak: 0,
      isConnected: true
    };

    return {
      type: "SUCCESS",
      nextState: {
        ...state,
        players: [...state.players, newPlayer]
      },
      player: newPlayer
    };
  },

  disconnect: (state: LobbyState, playerId: string): LobbyState => {
    if (state.status === LobbyStatus.waiting) {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== playerId),
      };
    }

    return {
      ...state,
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, isConnected: false } : p
      ),
    };
  },

  start: (state: LobbyState): LobbyState | Error => {
    if (state.status !== LobbyStatus.waiting) {
      return new Error("Lobby has already started");
    }

    if (state.players.length < 1) {
      return new Error("Lobby must have at least one player to start");
    }

    const firstStep = state.quiz.steps[0];
    
    if (!firstStep) {
      return new Error("Quiz has no steps");
    }

    const initialStatus = firstStep.type === "slide" 
      ? LobbyStatus.slide 
      : LobbyStatus.question;

    return {
      ...state,
      status: initialStatus,
      currentStep: 0,
      timeoutStartedAt: initialStatus === LobbyStatus.question ? Date.now() : null,
      duration: initialStatus === LobbyStatus.question ? (firstStep as any).duration || 30 : null,
    };
  },

  submitAnswer: (state: LobbyState, playerId: string, providedAnswer: any): LobbyState | Error => {
    if (state.status !== LobbyStatus.question) {
      return new Error("Answers are not being accepted at this time");
    }

    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return new Error("Player not found");

    if (state.currentAnswers.some((a) => a.playerId === playerId)) {
      return new Error("You have already answered this question");
    }

    const currentStep = state.quiz.steps[state.currentStep];

    if (!currentStep || currentStep.type !== "question") {
      return new Error("Current step is not a question");
    }

    const correct = isCorrect(currentStep as any, providedAnswer);

    let pointsEarned = 0;
    let newStreak = 0;

    if (correct) {
      const now = Date.now();
      const timeTaken = now - (state.timeoutStartedAt || now);
      const maxDuration = (state.duration || 30) * 1000;

      const speedFactor = Math.max(0, 1 - timeTaken / maxDuration);
      pointsEarned = Math.floor(500 + 500 * speedFactor);
      newStreak = state.players[playerIndex].streak + 1;
    } else {
      newStreak = 0;
    }

    const updatedPlayers = state.players.map((p) =>
      p.id === playerId
        ? { ...p, score: p.score + pointsEarned, streak: newStreak }
        : p
    );

    const answerRecord = {
      playerId,
      submission: providedAnswer,
      timeTaken: Date.now() - (state.timeoutStartedAt || Date.now()),
      isCorrect: correct,
      pointsAwarded: pointsEarned
    };

    return {
      ...state,
      players: updatedPlayers,
      currentAnswers: [...state.currentAnswers, answerRecord],
      answers: [...state.answers, answerRecord],
    };
  },

  nextStep: (state: LobbyState): LobbyState => {
    const nextIndex = state.currentStep + 1;
    const totalSteps = state.quiz.steps.length;

    if (nextIndex >= totalSteps) {
      return {
        ...state,
        status: LobbyStatus.end,
        currentAnswers: [],
        timeoutStartedAt: null,
        duration: null,
      };
    }

    const nextStepData = state.quiz.steps[nextIndex];
    
    const isSlide = nextStepData.type === "slide";
    const status = isSlide ? LobbyStatus.slide : LobbyStatus.question;

    return {
      ...state,
      currentStep: nextIndex,
      status: status,
      currentAnswers: [],
      timeoutStartedAt: isSlide ? null : Date.now(),
      duration: isSlide ? null : (nextStepData as any).duration || 30,
    };
  },

  setStatus: (state: LobbyState, status: LobbyStatus, duration?: number): LobbyState => {
    const startTime = (status === LobbyStatus.question || status === LobbyStatus.answer) 
      ? Date.now() 
      : null;

    return {
      ...state,
      status,
      timeoutStartedAt: startTime,
      duration: duration ?? null,
    };
  },

  calculateLeaderboard: (state: LobbyState): LobbyState => {
    return {
      ...state,
      players: [...state.players].sort((a, b) => b.score - a.score),
    };
  },

  // create the public state object type
  getPublicState: (state: LobbyState): any => {
    return {
      code: state.code,
      status: state.status,
      currentStep: state.currentStep,
      timeoutStartedAt: state.timeoutStartedAt,
      duration: state.duration,
      settings: state.settings,
      currentAnswers: (state.status === LobbyStatus.answer || state.status === LobbyStatus.score) 
        ? state.currentAnswers 
        : [],
    };
  },
};