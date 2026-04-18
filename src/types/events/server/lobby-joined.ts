import z from "zod";
import { PlayerSchema } from "../../lobby/lobby";
import { PlayerLobbyStateSchema } from "../../lobby/player-lobby-state";
import { HostLobbyStateSchema } from "../../lobby/host-lobby-state";

export const LobbyJoinedSchema = z.object({
  event: z.literal("LOBBY_JOINED"),
  payload: z.discriminatedUnion("role", [
    z.object({
      role: z.literal("host"),
      state: HostLobbyStateSchema,
    }),
    z.object({
      role: z.literal("player"),
      me: PlayerSchema,
      state: PlayerLobbyStateSchema,
    }),
  ]),
});

export type LobbyJoined = z.infer<typeof LobbyJoinedSchema>;

export const createLobbyJoinedEvent = (
  payload: LobbyJoined["payload"]
): LobbyJoined => {
  return LobbyJoinedSchema.parse({
    event: "LOBBY_JOINED",
    payload,
  });
};