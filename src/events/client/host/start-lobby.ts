import z from "zod";

export const StartLobbySchema = z.object({
  type: z.literal("START_LOBBY"),
  payload: z.object({}),
});

export type StartLobby = z.infer<typeof StartLobbySchema>;

export const createStartLobbyEvent = (): StartLobby => {
  return StartLobbySchema.parse({
    type: "START_LOBBY",
    payload: {},
  });
};