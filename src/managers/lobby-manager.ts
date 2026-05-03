import { AllServerEvents } from "../types/events/events";
import { LobbyStatusUpdate } from "../types/events/server/lobby-status-update";
import { LobbySettings, Lobby, LobbyStatus, Player } from "../types/lobby/lobby";
import { PlayerLobbyState } from "../types/lobby/player-lobby-state";
import { HostLobbyState } from "../types/lobby/host-lobby-state";
import { Quiz } from "../types/quiz/quiz";
import { isQuestion } from "../util/guards";
import { sanitizeQuestion } from "../util/sanitizer";
import { calculateScore } from "../util/score";
import { Answer, isCorrect, SubmittedAnswer } from "../util/validator";

export type Recipient = "all" | "host" | "players" | { clientId: string };
export type EventTarget = Recipient | Recipient[];

export interface TargetedEvent {
  target: EventTarget;
  event: AllServerEvents;
}

export type JoinResult =
  | { type: "SUCCESS"; nextState: Lobby; player?: Player; events: TargetedEvent[] }
  | { type: "RECONNECT"; nextState: Lobby; player?: Player; events: TargetedEvent[] }
  | { type: "ERROR"; message: string };

export type ManagerUpdate = {
  state: Lobby;
  events: TargetedEvent[];
};

export const LobbyManager = {
  /**
   * Creates a new initial lobby state.
   */
  create: (code: string, hostId: string, quiz: Quiz, settings: LobbySettings): Lobby => ({
    code,
    hostId,
    hostConnected: false,
    quiz,
    status: LobbyStatus.waiting,
    players: [],
    currentStep: 0,
    answers: [],
    currentAnswers: [],
    duration: null,
    timeoutStartedAt: null,
    settings,
  }),

  /**
   * Processes a join request, handling both new connections and reconnections.
   *
   * BUG FIX: the `joinMidGame` guard now only applies when the lobby has
   * already started (`status !== waiting`).  Previously it fired
   * unconditionally, so new players could *never* join even during the
   * waiting phase.
   */
  join: (state: Lobby, clientId: string, name: string | null): JoinResult => {
    const isHost = state.hostId === clientId;

    // ── Host (re)connection ──────────────────────────────────────────────
    if (isHost) {
      const nextState: Lobby = { ...state, hostConnected: true };

      return {
        type: "RECONNECT",
        nextState,
        events: [
          {
            target: { clientId },
            event: {
              event: "LOBBY_JOINED",
              payload: { role: "host", state: LobbyManager.getHostState(nextState) },
            },
          },
          {
            target: "players",
            event: { event: "HOST_STATUS", payload: { connected: true } },
          },
        ],
      };
    }

    // ── Existing player reconnection ─────────────────────────────────────
    const existingPlayer = state.players.find((p) => p.id === clientId);

    if (existingPlayer) {
      const nextState: Lobby = {
        ...state,
        players: state.players.map((p) =>
          p.id === clientId ? { ...p, isConnected: true } : p
        ),
      };

      const me: Player = { ...existingPlayer, isConnected: true };

      return {
        type: "RECONNECT",
        nextState,
        player: me,
        events: [
          { target: "host", event: { event: "PLAYER_UPDATE", payload: { player: me } } },
          {
            target: { clientId },
            event: {
              event: "LOBBY_JOINED",
              payload: {
                role: "player",
                me,
                state: LobbyManager.getPlayerState(nextState, clientId),
              },
            },
          },
        ],
      };
    }

    // ── New player joining ───────────────────────────────────────────────
    // Only block mid-game joins when the lobby has actually started.
    // During `waiting` state everyone is free to join.
    if (state.status !== LobbyStatus.waiting && state.settings.joinMidGame !== true) {
      return {
        type: "ERROR",
        message: "This lobby is already in progress and locked to new players.",
      };
    }

    const finalName = name || `Player ${state.players.length + 1}`;

    const nameExists = state.players.some((p) => p.name === finalName);
    if (nameExists) return { type: "ERROR", message: "Name already taken" };

    const newPlayer: Player = {
      id: clientId,
      name: finalName,
      position: state.players.length + 1,
      score: 0,
      streak: 0,
      isConnected: true,
    };

    const nextState: Lobby = {
      ...state,
      players: [...state.players, newPlayer],
    };

    return {
      type: "SUCCESS",
      nextState,
      player: newPlayer,
      events: [
        {
          target: "host",
          event: { event: "PLAYER_JOINED", payload: { player: newPlayer } },
        },
        {
          target: { clientId },
          event: {
            event: "LOBBY_JOINED",
            payload: {
              role: "player",
              me: newPlayer,
              state: LobbyManager.getPlayerState(nextState, clientId),
            },
          },
        },
      ],
    };
  },

  /**
   * Handles a player disconnection.
   */
  disconnect: (state: Lobby, clientId: string): ManagerUpdate => {
    if (state.hostId === clientId) {
      return {
        state: { ...state, hostConnected: false },
        events: [
          { target: "all", event: { event: "HOST_STATUS", payload: { connected: false } } },
        ],
      };
    }

    if (state.status === LobbyStatus.waiting) {
      const nextState: Lobby = {
        ...state,
        players: state.players.filter((p) => p.id !== clientId),
      };

      return {
        state: nextState,
        events: [
          { target: "host", event: { event: "PLAYER_LEFT", payload: { playerId: clientId } } },
        ],
      };
    }

    const nextState: Lobby = {
      ...state,
      players: state.players.map((p) =>
        p.id === clientId ? { ...p, isConnected: false } : p
      ),
    };
    const player = nextState.players.find((p) => p.id === clientId);

    return {
      state: nextState,
      events: player
        ? [{ target: "host", event: { event: "PLAYER_UPDATE", payload: { player } } }]
        : [],
    };
  },

  /**
   * Forcefully removes a player while the lobby is in waiting state.
   */
  kick: (state: Lobby, clientId: string, playerId: string): ManagerUpdate | Error => {
    if (state.hostId !== clientId) return new Error("Only the host can kick players");

    if (state.status !== LobbyStatus.waiting) {
      return new Error("Players can only be kicked while the lobby is waiting");
    }

    const playerExists = state.players.some((p) => p.id === playerId);
    if (!playerExists) return new Error("Player not found");

    const nextState: Lobby = {
      ...state,
      players: state.players.filter((p) => p.id !== playerId),
    };

    return {
      state: nextState,
      events: [
        { target: { clientId: playerId }, event: { event: "PLAYER_KICKED", payload: {} } },
        { target: "host", event: { event: "PLAYER_LEFT", payload: { playerId } } },
      ],
    };
  },

  /**
   * Prepares the state and events for deleting a lobby.
   */
  delete: (state: Lobby, reason: string = "Lobby closed"): ManagerUpdate => ({
    state: { ...state, status: LobbyStatus.end },
    events: [
      { target: "all", event: { event: "LOBBY_DELETED", payload: { reason } } },
    ],
  }),

  /**
   * Starts the quiz from the waiting state.
   */
  start: (state: Lobby, clientId: string): ManagerUpdate | Error => {
    if (state.hostId !== clientId) return new Error("Only the host can start the lobby");
    if (state.status !== LobbyStatus.waiting) return new Error("Lobby has already started");
    if (state.players.length < 1) return new Error("Lobby must have at least one player to start");

    const firstStep = state.quiz.steps[0];
    if (!firstStep) return new Error("Quiz has no steps");

    return LobbyManager.transitionToStep(state, 0);
  },

  /**
   * Records a player's answer, calculates points, and updates their score/streak.
   */
  submitAnswer: (
    state: Lobby,
    clientId: string,
    submittedAnswer: SubmittedAnswer
  ): ManagerUpdate | Error => {
    if (state.hostId === clientId) return new Error("Only a player can submit answers");
    if (state.status !== LobbyStatus.answer)
      return new Error("Answers are not being accepted at this time");

    const playerIndex = state.players.findIndex((p) => p.id === clientId);
    if (playerIndex === -1) return new Error("Player not found");

    if (state.currentAnswers.some((a) => a.playerId === clientId)) {
      return new Error("You have already answered this question");
    }

    const currentStep = state.quiz.steps[state.currentStep];
    if (!currentStep || currentStep.type !== "question") {
      return new Error("Current step is not a question");
    }

    const now = Date.now();
    const timeTaken = now - (state.timeoutStartedAt || now);
    const correct = isCorrect(currentStep.data, submittedAnswer);

    const tempAnswer: Answer = {
      playerId: clientId,
      submission: submittedAnswer,
      timeTaken,
      isCorrect: correct,
      pointsAwarded: 0,
    };

    const { pointsAwarded } = calculateScore(
      state.players[playerIndex],
      currentStep.data,
      tempAnswer,
      state.quiz
    );
    const newStreak = correct ? state.players[playerIndex].streak + 1 : 0;

    const updatedPlayers = state.players.map((p) =>
      p.id === clientId
        ? { ...p, score: p.score + pointsAwarded, streak: newStreak }
        : p
    );

    const answerRecord: Answer = { ...tempAnswer, pointsAwarded };

    const nextState: Lobby = {
      ...state,
      players: updatedPlayers,
      currentAnswers: [...state.currentAnswers, answerRecord],
      answers: [...state.answers, answerRecord],
    };

    return {
      state: nextState,
      events: [
        {
          target: "host",
          event: {
            event: "UPDATE_LOBBY_ANSWERS",
            payload: { count: nextState.currentAnswers.length },
          },
        },
      ],
    };
  },

  /**
   * Advances the lobby to the next logical step or ends the game.
   */
  nextStep: (state: Lobby, clientId: string): ManagerUpdate | Error => {
    if (state.hostId !== clientId) return new Error("Only the host can advance the lobby");

    const nextIndex = state.currentStep + 1;
    const totalSteps = state.quiz.steps.length;

    if (nextIndex >= totalSteps) {
      return {
        state: { ...state, status: LobbyStatus.end },
        events: [
          {
            target: "all",
            event: {
              event: "LOBBY_STATUS_UPDATE",
              stepNumber: state.currentStep + 1,
              payload: { status: LobbyStatus.end },
            },
          },
        ],
      };
    }

    return LobbyManager.transitionToStep(state, nextIndex);
  },

  /**
   * Advances the lobby to the next logical STATUS within the current step,
   * or moves to the next step once all statuses are exhausted.
   *
   * Flow for a question step: question → answer → answers → score → (next step)
   * Flow for a slide step:    slide → (next step)
   */
  advanceState: (state: Lobby, clientId: string): ManagerUpdate | Error => {
    if (state.hostId !== clientId) return new Error("Only the host can advance the lobby")

    switch (state.status) {
      case LobbyStatus.question:
        return LobbyManager.setStatus(state, LobbyStatus.answer, 
          (() => {
            const step = state.quiz.steps[state.currentStep]
            return isQuestion(step) ? step.data.timeLimit : undefined
          })()
        )

      case LobbyStatus.answer:
        return LobbyManager.setStatus(state, LobbyStatus.answers)

      case LobbyStatus.answers:
        return LobbyManager.setStatus(state, LobbyStatus.score)

      // After score (leaderboard) or a slide — move to the next step
      case LobbyStatus.score:
      case LobbyStatus.slide:
        return LobbyManager.nextStep(state, clientId)

      default:
        return new Error(`Cannot advance from status: ${state.status}`)
    }
  },

  /**
   * Internal helper to transition the lobby state to a specific step index.
   *
   * For question steps, the broadcast is split so the host receives the full
   * QuestionData (including `correct` on each choice) while players only
   * receive the sanitized version.  This ensures the host can highlight
   * correct answers during the review phase without leaking answers to
   * players.
   */
  transitionToStep: (state: Lobby, index: number): ManagerUpdate => {
    const step = state.quiz.steps[index];
    const isSlide = step.type === "slide";
    const status = isSlide ? LobbyStatus.slide : LobbyStatus.question;
    const now = Date.now();
    const duration =
      status === LobbyStatus.question && isQuestion(step) ? step.data.timeLimit : null;

    const nextState: Lobby = {
      ...state,
      currentStep: index,
      status,
      currentAnswers: [],
      timeoutStartedAt: isSlide ? null : now,
      duration,
    };

    // Question steps: split broadcast so host gets full data, players get sanitized.
    if (status === LobbyStatus.question && isQuestion(step)) {
      let sanitizedQuestion = sanitizeQuestion(step.data)

      if (sanitizedQuestion.imageHash) {
        sanitizedQuestion.imageHash = state.quiz.images[sanitizedQuestion.imageHash]
      }

      let question = step.data

      if (question.imageHash) {
        question.imageHash = state.quiz.images[question.imageHash]
      }

      return {
        state: nextState,
        events: [
          {
            target: "players",
            event: {
              event: "LOBBY_STATUS_UPDATE",
              stepNumber: index + 1,
              payload: {
                status,
                question: sanitizedQuestion,
                timeoutStartedAt: now,
                duration: duration || 0,
              },
            },
          },
          {
            target: "host",
            event: {
              event: "LOBBY_STATUS_UPDATE",
              stepNumber: index + 1,
              payload: {
                status,
                question: question,
                timeoutStartedAt: now,
                duration: duration || 0,
              },
            },
          },
        ],
      };
    }

    // Slide steps and any other non-question steps can broadcast to everyone.
    let payload: LobbyStatusUpdate["payload"];

    if (status === LobbyStatus.slide && step.type === "slide") {
      const slide = step.data
      
      if (slide.slideType === "content" && slide.imageHash) {
        slide.imageHash = state.quiz.images[slide.imageHash]
      }

      payload = { status, slide: step.data };
    } else {
      payload = { status: LobbyStatus.end };
    }

    return {
      state: nextState,
      events: [
        { target: "all", event: { event: "LOBBY_STATUS_UPDATE", stepNumber: index + 1, payload } },
      ],
    };
  },

  /**
   * Manually sets the status of the lobby.
   *
   * For the `question` branch, the broadcast is split so the host receives
   * full QuestionData while players receive the sanitized copy — same
   * reasoning as `transitionToStep`.
   */
  setStatus: (state: Lobby, status: LobbyStatus, duration?: number): ManagerUpdate => {
    const now = Date.now();
    const startTime =
      status === LobbyStatus.question || status === LobbyStatus.answer ? now : null;

    const nextState: Lobby = {
      ...state,
      status,
      timeoutStartedAt: startTime,
      duration: duration ?? null,
    };

    const currentStepNumber = state.currentStep + 1;
    const events: TargetedEvent[] = [];

    if (status === LobbyStatus.question) {
      const step = state.quiz.steps[state.currentStep];

      // Players receive sanitized question (no `correct` on choices).
      events.push({
        target: "players",
        event: {
          event: "LOBBY_STATUS_UPDATE",
          stepNumber: currentStepNumber,
          payload: {
            status,
            question: isQuestion(step) ? sanitizeQuestion(step.data) : ({} as any),
            timeoutStartedAt: now,
            duration: duration ?? 0,
          },
        },
      });

      // Host receives full question data so correct answers are available.
      events.push({
        target: "host",
        event: {
          event: "LOBBY_STATUS_UPDATE",
          stepNumber: currentStepNumber,
          payload: {
            status,
            question: isQuestion(step) ? step.data : ({} as any),
            timeoutStartedAt: now,
            duration: duration ?? 0,
          },
        },
      });
    } else if (status === LobbyStatus.answer) {
      const payload: LobbyStatusUpdate["payload"] = {
        status,
        timeoutStartedAt: now,
        duration: duration ?? 0,
      };
      events.push({
        target: "all",
        event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload },
      });
    } else if (status === LobbyStatus.score) {
      const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
      const payload: LobbyStatusUpdate["payload"] = { status, leaderboard: sortedPlayers };
      nextState.players = sortedPlayers;
      events.push({
        target: "all",
        event: { event: "LOBBY_STATUS_UPDATE", stepNumber: currentStepNumber, payload },
      });
    } else if (status === LobbyStatus.answers) {
      // Broadcast status change to everyone (no sensitive data)
      events.push({
        target: "all",
        event: {
          event: "LOBBY_STATUS_UPDATE",
          stepNumber: currentStepNumber,
          payload: { status },
        },
      });

      // Send full answer details only to the host
      events.push({
        target: "host",
        event: {
          event: "LOBBY_STATUS_UPDATE",
          stepNumber: currentStepNumber,
          payload: { status, answers: state.currentAnswers },
        },
      });

      // Notify each player of their individual result
      state.players.forEach((p) => {
        const answer = state.currentAnswers.find((a) => a.playerId === p.id);
        events.push({
          target: { clientId: p.id },
          event: {
            event: "PLAYER_ANSWER_RESULT",
            payload: { isCorrect: answer?.isCorrect ?? false, player: p },
          },
        });
      });
    } else {
      events.push({
        target: "all",
        event: {
          event: "LOBBY_STATUS_UPDATE",
          stepNumber: currentStepNumber,
          payload: { status: status as any },
        },
      });
    }

    return { state: nextState, events };
  },

  /**
   * Generates a full lobby state for the host client.
   */
  getHostState: (state: Lobby): HostLobbyState => {
    const step = state.quiz.steps[state.currentStep];

    let background = state.quiz.theme.background;

    if (background) {
      background = state.quiz.images[background];
    }

    return {
      code: state.code,
      status: state.status,
      players: state.players,
      stepNumber: state.currentStep + 1,
      quizInfo: {
        title: state.quiz.title,
        theme: {
          ...state.quiz.theme,
          background,
        },
        stepCount: state.quiz.steps.length,
      },
      lobbySettings: state.settings,
      currentStep: step,
      answers: state.currentAnswers,
      timeout: state.timeoutStartedAt
        ? new Date(state.timeoutStartedAt).toISOString()
        : undefined,
    };
  },

  /**
   * Generates a sanitized lobby state for a specific player client.
   */
  getPlayerState: (state: Lobby, clientId: string): PlayerLobbyState => {
    let background = state.quiz.theme.background;

    if (background) {
      background = state.quiz.images[background];
    }

    const step = state.quiz.steps[state.currentStep];
    
    return {
      code: state.code,
      status: state.status,
      hostConnected: state.hostConnected,
      me: state.players.find((p) => p.id === clientId)!,
      stepNumber: state.currentStep + 1,
      quizInfo: {
        title: state.quiz.title,
        theme: {
          ...state.quiz.theme,
          background,
        },
        stepCount: state.quiz.steps.length,
      },
      currentStep: step,
      timeout: state.timeoutStartedAt ? state.timeoutStartedAt.toString() : undefined,
      lobbySettings: state.settings,
      hasAnswered: false,
      wasCorrect: false,
    }
  },

  /**
   * Generates a unique 6-digit lobby code.
   */
  generateCode: (): string =>
    Math.floor(Math.random() * 900000 + 100000).toString(),
};