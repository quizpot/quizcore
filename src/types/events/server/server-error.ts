import z from "zod";

export const ServerErrorSchema = z.object({
  event: z.literal("SERVER_ERROR"),
  payload: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
});

export type ServerError = z.infer<typeof ServerErrorSchema>;

export const createServerErrorEvent = (message: string, code?: string): ServerError => {
  return ServerErrorSchema.parse({
    event: "SERVER_ERROR",
    payload: { message, code },
  });
};
