import z from "zod";

export const HostStatusSchema = z.object({
  event: z.literal("HOST_STATUS"),
  payload: z.object({
    connected: z.boolean(),
  }),
});

export type HostStatus = z.infer<typeof HostStatusSchema>;

export const createHostStatusEvent = (connected: boolean): HostStatus => {
  return HostStatusSchema.parse({
    event: "HOST_STATUS",
    payload: { connected },
  });
};