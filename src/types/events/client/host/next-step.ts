import z from "zod";

export const NextStepSchema = z.object({
  type: z.literal("NEXT_STEP"),
});

export type NextStep = z.infer<typeof NextStepSchema>;

export const createNextStepEvent = (): NextStep => {
  return NextStepSchema.parse({
    type: "NEXT_STEP",
  });
};