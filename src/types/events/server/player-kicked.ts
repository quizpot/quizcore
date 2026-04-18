import z from "zod";

export const PlayerKickedSchema = z.object({
  event: z.literal("PLAYER_KICKED"),
  payload: z.object({}),
});

export type PlayerKicked = z.infer<typeof PlayerKickedSchema>;

export const createPlayerKickedEvent = (): PlayerKicked => {
  return PlayerKickedSchema.parse({
    event: "PLAYER_KICKED",
    payload: {},
  });
};