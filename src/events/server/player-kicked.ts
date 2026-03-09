import z from "zod";

export const PlayerKickedSchema = z.object({
  type: z.literal("PLAYER_KICKED"),
  payload: z.object({}),
});

export type PlayerKicked = z.infer<typeof PlayerKickedSchema>;

export const createPlayerKickedEvent = (): PlayerKicked => {
  return PlayerKickedSchema.parse({
    type: "PLAYER_KICKED",
    payload: {},
  });
};