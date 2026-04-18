import z from "zod";
import { PlayerSchema } from "../../lobby/lobby";

export const PlayerJoinedSchema = z.object({
  event: z.literal("PLAYER_JOINED"),
  payload: z.object({
    player: PlayerSchema,
  }),
});

export type PlayerJoined = z.infer<typeof PlayerJoinedSchema>;

export const createPlayerJoinedEvent = (player: z.infer<typeof PlayerSchema>): PlayerJoined => {
  return PlayerJoinedSchema.parse({
    event: "PLAYER_JOINED",
    payload: { player }
  });
};