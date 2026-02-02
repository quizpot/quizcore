import { Answer } from "../util/validator";
import { QuizFile } from "./quizfile";
export type Lobby = {
    code: string;
    host: string;
    quiz: QuizFile;
    players: Player[];
    status: LobbyStatus;
    stepStartedAt: number | null;
    duration: number | null;
    currentStep: number;
    currentAnswers: Answer[];
    answers: Answer[];
    settings: LobbySettings;
};
export type LobbySettings = {
    customNames: boolean;
    displayOnDevice: boolean;
};
export declare enum LobbyStatus {
    waiting = "waiting",
    slide = "slide",
    question = "question",
    answer = "answer",
    answers = "answers",
    score = "score",
    end = "end"
}
export type Player = {
    id: string;
    name: string;
    score: number;
    streak: number;
    isConnected: boolean;
};
//# sourceMappingURL=lobby.d.ts.map