import z from "zod";

export const UpdateLobbyAnswersSchema = z.object({
  event: z.literal("UPDATE_LOBBY_ANSWERS"),
  payload: z.object({
    count: z.number().int().nonnegative(),
  }),
});

export type UpdateLobbyAnswers = z.infer<typeof UpdateLobbyAnswersSchema>;

export const createUpdateLobbyAnswersEvent = (count: number): UpdateLobbyAnswers => {
  return UpdateLobbyAnswersSchema.parse({
    event: "UPDATE_LOBBY_ANSWERS",
    payload: { count }
  });
};