import z from "zod";

export const StartLobbySchema = z.object({
  event: z.literal("START_LOBBY"),
  payload: z.object({}),
});

export type StartLobby = z.infer<typeof StartLobbySchema>;

export const createStartLobbyEvent = (): StartLobby => {
  return StartLobbySchema.parse({
    event: "START_LOBBY",
    payload: {},
  });
};