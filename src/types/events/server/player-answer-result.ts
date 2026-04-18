import z from "zod";
import { Player, PlayerSchema } from "../../lobby/lobby";

export const PlayerAnswerResultSchema = z.object({
  event: z.literal("PLAYER_ANSWER_RESULT"),
  payload: z.object({
    isCorrect: z.boolean(),
    player: PlayerSchema
  }),
});

export type PlayerAnswerResult = z.infer<typeof PlayerAnswerResultSchema>;

export const createPlayerAnswerResultEvent = (
  isCorrect: boolean,
  player: Player
): PlayerAnswerResult => {
  return PlayerAnswerResultSchema.parse({
    event: "PLAYER_ANSWER_RESULT",
    payload: { isCorrect, player },
  });
};