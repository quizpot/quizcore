import z from "zod";

export type QuestionPoints = z.infer<typeof QuestionPointsSchema>;

export const QuestionPointsSchema = z.enum(["normalPoints", "doublePoints", "noPoints"]);