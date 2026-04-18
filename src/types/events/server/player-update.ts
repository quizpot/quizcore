import z from "zod";
import { PlayerSchema } from "../../lobby";

export const PlayerUpdateSchema = z.object({
  event: z.literal("PLAYER_UPDATE"),
  payload: z.object({
    player: PlayerSchema,
  }),
});

export type PlayerUpdate = z.infer<typeof PlayerUpdateSchema>;

export const createPlayerUpdateEvent = (player: z.infer<typeof PlayerSchema>): PlayerUpdate => {
  return PlayerUpdateSchema.parse({
    event: "PLAYER_UPDATE",
    payload: { player }
  });
};