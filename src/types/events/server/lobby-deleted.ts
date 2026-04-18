import z from "zod";

export const LobbyDeletedSchema = z.object({
  type: z.literal("LOBBY_DELETED"),
  payload: z.object({
    reason: z.string(),
  }),
});

export type LobbyDeleted = z.infer<typeof LobbyDeletedSchema>;

export const createLobbyDeletedEvent = (reason: string): LobbyDeleted => {
  return LobbyDeletedSchema.parse({
    type: "LOBBY_DELETED",
    payload: { reason },
  });
};