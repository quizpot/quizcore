import { AllServerEvents } from "../types/events/events";
import { LobbySettings, LobbyState, LobbyStatus, Player } from "../types/lobby";
import { PlayerLobbyState } from "../types/lobby/player-lobby-state";
import { Quiz } from "../types/quiz";
import { isQuestion } from "../util/guards";
import { sanitizeQuestion } from "../util/sanitizer";
import { calculateScore } from "../util/score";
import { Answer, isCorrect } from "../util/validator";

export type Recipient = "all" | "host" | { playerId: string };
export type EventTarget = Recipient | Recipient[];

export interface TargetedEvent {
  target: EventTarget;
  event: AllServerEvents;
}

export type JoinResult = 
  | { type: "SUCCESS"; nextState: LobbyState; player: Player; events: TargetedEvent[] }
  | { type: "RECONNECT"; nextState: LobbyState; player: Player; events: TargetedEvent[] }
  | { type: "ERROR"; message: string };

export type ManagerUpdate = {
  state: LobbyState;
  events: TargetedEvent[];
};

export const LobbyManager = {
  /**
   * Creates a new initial lobby state.
   * @param code - The unique lobby access code.
   * @param hostId - The identifier of the host.
   * @param quiz - The quiz definition.
   * @param settings - Configuration settings for the lobby.
   * @returns An initial LobbyState object.
   */
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

  /**
   * Processes a join request, handling both new connections and reconnections.
   * @param state - The current lobby state.
   * @param playerId - The unique identifier for the joining player.
   * @param name - The name provided by the player (if applicable).
   * @returns A result indicating success, reconnection, or an error.
   */
  join: (state: LobbyState, playerId: string, name: string | null): JoinResult => {
    const existingPlayer = state.players.find(p => p.id === playerId);

    if (existingPlayer) {
      const nextState = {
        ...state,
        players: state.players.map(p =>
          p.id === playerId ? { ...p, isConnected: true } : p
        ),
      };
      
      const me = { ...existingPlayer, isConnected: true };

      return {
        type: "RECONNECT",
        nextState,
        player: me,
        events: [
          { target: "host", event: { event: "PLAYER_UPDATE", payload: { player: me } } },
          { 
            target: { playerId }, 
            event: { 
              event: "LOBBY_JOINED", 
              payload: { role: "player", me, state: LobbyManager.getPlayerState(nextState, playerId) } 
            } 
          }
        ]
      };
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

    const nextState = {
      ...state,
      players: [...state.players, newPlayer]
    };

    return {
      type: "SUCCESS",
      nextState,
      player: newPlayer,
      events: [
        { target: "host", event: { event: "PLAYER_JOINED", payload: { player: newPlayer } } },
        { 
          target: { playerId }, 
          event: { 
            event: "LOBBY_JOINED", 
            payload: { role: "player", me: newPlayer, state: LobbyManager.getPlayerState(nextState, playerId) } 
          } 
        }
      ]
    };
  },

  /**
   * Handles a player disconnection, removing them if waiting or marking them offline if mid quiz.
   * @param state - The current lobby state.
   * @param playerId - The identifier of the player who disconnected.
   * @returns An updated state and associated events.
   */
  disconnect: (state: LobbyState, playerId: string): ManagerUpdate => {
    if (state.status === LobbyStatus.waiting) {
      const nextState = {
        ...state,
        players: state.players.filter((p) => p.id !== playerId),
      };
      
      return {
        state: nextState,
        events: [{ target: "host", event: { event: "PLAYER_LEFT", payload: { playerId } } }]
      };
    }

    const nextState = {
      ...state,
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, isConnected: false } : p
      ),
    };
    const player = nextState.players.find(p => p.id === playerId);

    return {
      state: nextState,
      events: player ? [{ target: "host", event: { event: "PLAYER_UPDATE", payload: { player } } }] : []
    };
  },

  /**
   * Forcefully removes a player from a lobby while it is in the waiting state.
   * @param state - The current lobby state.
   * @param playerId - The identifier of the player to kick.
   * @returns An updated state and associated events, or an Error if not allowed.
   */
  kick: (state: LobbyState, playerId: string): ManagerUpdate | Error => {
    if (state.status !== LobbyStatus.waiting) {
      return new Error("Players can only be kicked while the lobby is waiting");
    }

    const playerExists = state.players.some(p => p.id === playerId);
    if (!playerExists) return new Error("Player not found");

    const nextState = {
      ...state,
      players: state.players.filter((p) => p.id !== playerId),
    };

    return {
      state: nextState,
      events: [
        { target: { playerId }, event: { event: "PLAYER_KICKED", payload: {} } },
        { target: "host", event: { event: "PLAYER_LEFT", payload: { playerId } } }
      ]
    };
  },

  /**
   * Prepares the state and events for deleting a lobby.
   * @param state - The current lobby state.
   * @param reason - The reason for deletion.
   * @returns An updated state (status: end) and a broadcast event.
   */
  delete: (state: LobbyState, reason: string = "Lobby closed"): ManagerUpdate => {
    return {
      state: { ...state, status: LobbyStatus.end },
      events: [{ target: "all", event: { event: "LOBBY_DELETED", payload: { reason } } }]
    };
  },

  /**
   * Starts the quiz from the waiting state.
   * @param state - The current lobby state.
   * @returns An updated state for the first step and associated events, or an Error.
   */
  start: (state: LobbyState): ManagerUpdate | Error => {
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

    return LobbyManager.transitionToStep(state, 0);
  },

  /**
   * Records a player's answer, calculates points, and updates their score/streak.
   * @param state - The current lobby state.
   * @param playerId - The identifier of the player submitting the answer.
   * @param providedAnswer - The data containing the player's choice.
   * @returns An updated state and events for the host, or an Error.
   */
  submitAnswer: (state: LobbyState, playerId: string, providedAnswer: any): ManagerUpdate | Error => {
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

    const now = Date.now();
    const timeTaken = now - (state.timeoutStartedAt || now);
    const correct = isCorrect(currentStep.data, providedAnswer);

    const tempAnswer: Answer = {
      playerId,
      submission: providedAnswer,
      timeTaken,
      isCorrect: correct,
      pointsAwarded: 0,
    };

    const { pointsAwarded } = calculateScore(state.players[playerIndex], currentStep.data, tempAnswer, state.quiz);
    const newStreak = correct ? state.players[playerIndex].streak + 1 : 0;

    const updatedPlayers = state.players.map((p) =>
      p.id === playerId
        ? { ...p, score: p.score + pointsAwarded, streak: newStreak }
        : p
    );

    const answerRecord: Answer = { ...tempAnswer, pointsAwarded };

    const nextState = {
      ...state,
      players: updatedPlayers,
      currentAnswers: [...state.currentAnswers, answerRecord],
      answers: [...state.answers, answerRecord],
    };

    return {
      state: nextState,
      events: [{ target: "host", event: { event: "UPDATE_LOBBY_ANSWERS", payload: { count: nextState.currentAnswers.length } } }]
    };
  },

  /**
   * Advances the lobby to the next logical step (slide or question) or ends the game.
   * @param state - The current lobby state.
   * @returns An updated state and broadcast events.
   */
  nextStep: (state: LobbyState): ManagerUpdate => {
    const nextIndex = state.currentStep + 1;
    const totalSteps = state.quiz.steps.length;

    if (nextIndex >= totalSteps) {
      return {
        state: { ...state, status: LobbyStatus.end },
        events: [{ 
          target: "all", 
          event: { event: "LOBBY_STATUS_UPDATE", stepNumber: state.currentStep + 1, payload: { status: LobbyStatus.end } } 
        }]
      };
    }

    return LobbyManager.transitionToStep(state, nextIndex);
  },

  /**
   * Internal helper to transition the lobby state to a specific step index.
   * Handles question sanitization and timer initialization.
   * @param state - The current lobby state.
   * @param index - The 0-based index of the step in the quiz.
   * @returns An updated state and broadcast events.
   */
  transitionToStep: (state: LobbyState, index: number): ManagerUpdate => {
    const step = state.quiz.steps[index];
    const isSlide = step.type === "slide";
    const status = isSlide ? LobbyStatus.slide : LobbyStatus.question;
    const now = Date.now();
    const duration = (status === LobbyStatus.question && isQuestion(step)) ? step.data.timeLimit : null;

    const nextState = {
      ...state,
      currentStep: index,
      status: status,
      currentAnswers: [],
      timeoutStartedAt: isSlide ? null : now,
      duration
    };

    let payload: any = { status };

    if (status === LobbyStatus.slide && step.type === "slide") {
      payload.slide = step.data;
    } else if (status === LobbyStatus.question && isQuestion(step)) {
      payload = {
        ...payload,
        question: sanitizeQuestion(step.data),
        timeoutStartedAt: now,
        duration: duration || 0
      };
    }

    return {
      state: nextState,
      events: [{ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: index + 1, payload } }]
    };
  },

  /**
   * Manually sets the status of the lobby (e.g., revealing answers or showing scores).
   * Handles sensitive data stripping and individual player result notification.
   * @param state - The current lobby state.
   * @param status - The target LobbyStatus.
   * @param duration - Optional time limit for the new status.
   * @returns An updated state and targeted events.
   */
  setStatus: (state: LobbyState, status: LobbyStatus, duration?: number): ManagerUpdate => {
    const now = Date.now();
    const startTime = (status === LobbyStatus.question || status === LobbyStatus.answer) ? now : null;

    const nextState = {
      ...state,
      status,
      timeoutStartedAt: startTime,
      duration: duration ?? null
    };

    const currentStepNumber = state.currentStep + 1;
    let payload: any = { status };

    const events: TargetedEvent[] = [];

    if (status === LobbyStatus.question) {
      payload.timeoutStartedAt = now;
      payload.duration = duration ?? 0;

      events.push({ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload } });
    } else if (status === LobbyStatus.answer) {
      payload.timeoutStartedAt = now;
      payload.duration = duration ?? 0;

      events.push({ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload } });
    } else if (status === LobbyStatus.score) {
      const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
      payload.leaderboard = sortedPlayers;
      nextState.players = sortedPlayers;

      events.push({ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload } });
    } else if (status === LobbyStatus.answers) {
      events.push({ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload: { status } } });
      
      events.push({ 
        target: "host", 
        event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload: { status, answers: state.currentAnswers } } 
      });

      state.players.forEach(p => {
        const answer = state.currentAnswers.find(a => a.playerId === p.id);
        events.push({
          target: { playerId: p.id },
          event: {
            event: "PLAYER_ANSWER_RESULT",
            payload: { isCorrect: answer?.isCorrect ?? false, player: p }
          }
        });
      });
    } else {
      events.push({ target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload } });
    }

    return {
      state: nextState,
      events
    };
  },

  /**
   * Generates a sanitized version of the lobby state suitable for a specific player client.
   * @param state - The current lobby state.
   * @param playerId - The ID of the player the state is for.
   * @returns A PlayerLobbyState object.
   */
  getPlayerState: (state: LobbyState, playerId: string): PlayerLobbyState => {
    return {
      code: state.code,
      status: state.status,
      me: state.players.find((p) => p.id === playerId)!,
      stepNumber: state.currentStep + 1,
      quizInfo: {
        title: state.quiz.title,
        theme: state.quiz.theme,
        stepCount: state.quiz.steps.length
      },
    };
  },
};