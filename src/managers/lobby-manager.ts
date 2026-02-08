import { PlayerAnswerResult } from "../events/server/player-answer-result";
import { Lobby, LobbyStatus } from "../types/lobby";
import { QuizFile } from "../types/quizfile";
import { isQuestion } from "../util/guards";
import { calculateScore } from "../util/score";
import { Answer, isCorrect, SubmittedAnswer } from "../util/validator";

export const createLobby = (
  code: string, 
  hostId: string, 
  quiz: QuizFile
): Lobby => ({
  code,
  host: hostId,
  quiz,
  quizInfo: {
    title: quiz.title,
    stepCount: quiz.steps.length,
    theme: quiz.theme
  },
  players: [],
  status: LobbyStatus.waiting,
  currentStep: 0,
  timeoutStartedAt: null,
  duration: null,
  currentAnswers: [],
  answers: [],
  settings: { customNames: true, displayOnDevice: true }
});

export const advanceLobby = (lobby: Lobby): Lobby => {
  const isLastStep = lobby.currentStep >= lobby.quiz.steps.length - 1;

  switch (lobby.status) {
    case LobbyStatus.waiting:
      return prepareStep(lobby, 0);

    case LobbyStatus.slide:
    case LobbyStatus.score:
      return isLastStep 
        ? { ...lobby, status: LobbyStatus.end } 
        : prepareStep(lobby, lobby.currentStep + 1);

    case LobbyStatus.question: {
      const step = lobby.quiz.steps[lobby.currentStep];
      if (step.type !== 'question') return lobby;

      return { 
        ...lobby, 
        status: LobbyStatus.answer, 
        timeoutStartedAt: Date.now(), 
        duration: step.data.timeLimit * 1000,
        currentAnswers: [] 
      };
    }

    case LobbyStatus.answer:
      return { ...lobby, status: LobbyStatus.answers };

    case LobbyStatus.answers:
      return { ...lobby, status: LobbyStatus.score };

    default:
      return lobby;
  }
};

// Prepares the lobby for the next step
const prepareStep = (lobby: Lobby, index: number): Lobby => {
  const step = lobby.quiz.steps[index];
  
  if (!step) return lobby;

  if (step.type === "slide") {
    return { 
      ...lobby, 
      status: LobbyStatus.slide, 
      currentStep: index 
    };
  }

  return { 
    ...lobby, 
    status: LobbyStatus.question, 
    currentStep: index,
    timeoutStartedAt: null,
    duration: null,
    currentAnswers: []
  };
};

export type SubmissionResult = {
  nextLobby: Lobby;
  result: PlayerAnswerResult;
};

export const handleSubmission = (
  lobby: Lobby, 
  playerId: string, 
  submission: SubmittedAnswer
): SubmissionResult | null => {
  if (lobby.status !== LobbyStatus.answer) return null;

  const step = lobby.quiz.steps[lobby.currentStep];
  if (!isQuestion(step)) return null;

  const player = lobby.players.find(p => p.id === playerId);
  if (!player) return null;

  if (lobby.currentAnswers.some(a => a.playerId === playerId)) return null;

  const correct = isCorrect(step.data, submission);
  const timeTaken = Date.now() - (lobby.timeoutStartedAt ?? 0);

  const answerObj: Answer = {
    playerId,
    submission,
    timeTaken,
    isCorrect: correct,
    pointsAwarded: 0
  };

  const { newScore, pointsAwarded } = calculateScore(player, step.data, answerObj, lobby.quiz);
  answerObj.pointsAwarded = pointsAwarded;

  const nextLobby: Lobby = {
    ...lobby,
    players: lobby.players.map(p => p.id === playerId ? {
      ...p,
      score: newScore,
      streak: correct ? p.streak + 1 : 0
    } : p),
    currentAnswers: [...lobby.currentAnswers, answerObj]
  };

  return {
    nextLobby,
    result: {
      type: "PLAYER_ANSWER_RESULT",
      payload: { isCorrect: correct, pointsAwarded, score: newScore, streak: correct ? player.streak + 1 : 0 }
    }
  };
};