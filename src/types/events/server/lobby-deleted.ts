import z from "zod";

export const LobbyDeletedSchema = z.object({
  event: z.literal("LOBBY_DELETED"),
  payload: z.object({
    reason: z.string(),
  }),
});

export type LobbyDeleted = z.infer<typeof LobbyDeletedSchema>;

export const createLobbyDeletedEvent = (reason: string): LobbyDeleted => {
  return LobbyDeletedSchema.parse({
    event: "LOBBY_DELETED",
    payload: { reason },
  });
};