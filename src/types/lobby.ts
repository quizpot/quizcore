import { Answer } from "../util/validator";
import { QuizFile } from "./quizfile";
import { QuizTheme } from "./quiztheme";

export type Lobby = {
  code: string;
  host: string; // Id of the WebSocket connection
  quiz: QuizFile;
  quizInfo: {
    title: string;
    stepCount: number;
    theme: QuizTheme;
  };
  players: Player[];
  status: LobbyStatus;
  timeoutStartedAt: number | null;
  duration: number | null;
  currentStep: number;
  currentAnswers: Answer[];
  answers: Answer[];
  settings: LobbySettings;
}

export type LobbySettings = {
  customNames: boolean;
  displayOnDevice: boolean;
}

export enum LobbyStatus {
  waiting = 'waiting',
  slide = 'slide',
  question = 'question',
  answer = 'answer',
  answers = 'answers',
  score = 'score',
  end = 'end',
}

export type Player = {
  id: string;
  name: string;
  score: number;
  streak: number;
  isConnected: boolean;
}