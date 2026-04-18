import z from "zod";

export const NextStepSchema = z.object({
  event: z.literal("NEXT_STEP"),
});

export type NextStep = z.infer<typeof NextStepSchema>;

export const createNextStepEvent = (): NextStep => {
  return NextStepSchema.parse({
    event: "NEXT_STEP",
  });
};