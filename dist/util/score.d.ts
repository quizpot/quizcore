import { Answer } from "./validator";
import { Question, QuizFile } from "../types/quizfile";
export declare const calculateScore: (player: {
    score: number;
    streak: number;
}, question: Question, answer: Answer, quiz: QuizFile) => {
    newScore: number;
    pointsAwarded: number;
};
//# sourceMappingURL=score.d.ts.map