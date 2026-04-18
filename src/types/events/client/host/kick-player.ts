import z from "zod";

export const KickPlayerSchema = z.object({
  type: z.literal("KICK_PLAYER"),
  payload: z.object({
    playerId: z.string(),
  }),
});

export type KickPlayer = z.infer<typeof KickPlayerSchema>;

export const createKickPlayerEvent = (playerId: string): KickPlayer => {
  return KickPlayerSchema.parse({
    type: "KICK_PLAYER",
    payload: { playerId }
  });
};