import z from "zod";

export const PlayerAnswerResultSchema = z.object({
  type: z.literal("PLAYER_ANSWER_RESULT"),
  payload: z.object({
    isCorrect: z.boolean(),
    pointsAwarded: z.number().min(0),
    score: z.number().int().min(0),
    streak: z.number().int().min(0),
  }),
});

export type PlayerAnswerResult = z.infer<typeof PlayerAnswerResultSchema>;

export const createPlayerAnswerResultEvent = (
  isCorrect: boolean,
  pointsAwarded: number,
  score: number,
  streak: number
): PlayerAnswerResult => {
  return PlayerAnswerResultSchema.parse({
    type: "PLAYER_ANSWER_RESULT",
    payload: { isCorrect, pointsAwarded, score, streak },
  });
};