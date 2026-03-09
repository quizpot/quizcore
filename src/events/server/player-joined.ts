import z from "zod";
import { PlayerSchema } from "../../types/lobby";

export const PlayerJoinedSchema = z.object({
  type: z.literal("PLAYER_JOINED"),
  payload: z.object({
    player: PlayerSchema,
  }),
});

export type PlayerJoined = z.infer<typeof PlayerJoinedSchema>;

export const createPlayerJoinedEvent = (player: z.infer<typeof PlayerSchema>): PlayerJoined => {
  return PlayerJoinedSchema.parse({
    type: "PLAYER_JOINED",
    payload: { player }
  });
};