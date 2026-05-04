import z from "zod";
import { QuizSchema } from "./quiz";
import { AnswerSchema } from "../../util/validator";
import { PlayerSchema } from "../lobby/lobby";

export const QuizResultSchema = z.object({
  quiz: QuizSchema,
  answers: z.array(z.array(AnswerSchema)),
  players: z.array(PlayerSchema),
});

export type QuizResult = z.infer<typeof QuizResultSchema>;