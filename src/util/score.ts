import { QuizFile } from "../types/quiz/quiz";
import { Question } from "../types/quiz/question";
import { Answer } from "./validator";

const BASE_SCORE = 500;
const TIME_BONUS_MAX = 500;

export const calculateScore = (
  player: { score: number; streak: number },
  question: Question,
  answer: Answer,
  quiz: QuizFile
): { newScore: number; pointsAwarded: number } => {
  if (!answer.isCorrect) return { newScore: player.score, pointsAwarded: 0 };

  const multipliers: Record<string, number> = {
    noPoints: 0,
    normalPoints: 1,
    doublePoints: 2,
  };
  const pointMultiplier = multipliers[question.points] ?? 1;
  if (pointMultiplier === 0) return { newScore: player.score, pointsAwarded: 0 };

  let timeBonus = 0;
  if (question.timeLimit > 0) {
    const timeLimitMs = question.timeLimit * 1000;
    const timeTaken = Math.max(0, Math.min(answer.timeTaken, timeLimitMs));
    const timeRemainingRatio = 1 - (timeTaken / timeLimitMs);
    timeBonus = TIME_BONUS_MAX * timeRemainingRatio;
  }

  let questionScore = (BASE_SCORE + timeBonus) * pointMultiplier;

  if (player.streak >= 2) {
    const totalQuestions = quiz.steps.filter(s => s.type === "question").length;
    
    const dynamicCap = Math.min(1.2 + Math.max(0, totalQuestions - 5) * 0.02, 1.5);
    const streakMultiplier = Math.min(1 + (player.streak - 1) * 0.05, dynamicCap);
    
    questionScore *= streakMultiplier;
  }

  const finalPoints = Math.trunc(questionScore);
  return {
    newScore: player.score + finalPoints,
    pointsAwarded: finalPoints
  };
};