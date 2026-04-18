import z from "zod";

export const PlayerLeftSchema = z.object({
  event: z.literal("PLAYER_LEFT"),
  payload: z.object({
    playerId: z.string(),
  }),
});

export type PlayerLeft = z.infer<typeof PlayerLeftSchema>;

export const createPlayerLeftEvent = (playerId: string): PlayerLeft => {
  return PlayerLeftSchema.parse({
    event: "PLAYER_LEFT",
    payload: { playerId }
  });
};