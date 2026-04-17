import z from "zod";
import { QuestionPointsSchema } from "./points";

export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;

export const BaseQuestionSchema = z.object({
  question: z.string().min(1),
  imageHash: z.hash("sha256", { error: "Invalid image hash" }).optional(),
  displayTime: z.number().min(1).max(60),
  timeLimit: z.number().min(1).max(180),
  points: QuestionPointsSchema,
});