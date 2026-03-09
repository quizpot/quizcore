import z from "zod";
import { PlayerSchema } from "../../types/lobby";

export const PlayerUpdateSchema = z.object({
  type: z.literal("PLAYER_UPDATE"),
  payload: z.object({
    player: PlayerSchema,
  }),
});

export type PlayerUpdate = z.infer<typeof PlayerUpdateSchema>;

export const createPlayerUpdateEvent = (player: z.infer<typeof PlayerSchema>): PlayerUpdate => {
  return PlayerUpdateSchema.parse({
    type: "PLAYER_UPDATE",
    payload: { player }
  });
};