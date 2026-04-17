import z from "zod";
import { PlayerSchema } from "../../lobby";

export const PlayerLeftSchema = z.object({
  type: z.literal("PLAYER_LEFT"),
  payload: z.object({
    player: PlayerSchema,
  }),
});

export type PlayerLeft = z.infer<typeof PlayerLeftSchema>;

export const createPlayerLeftEvent = (player: z.infer<typeof PlayerSchema>): PlayerLeft => {
  return PlayerLeftSchema.parse({
    type: "PLAYER_LEFT",
    payload: { player }
  });
};