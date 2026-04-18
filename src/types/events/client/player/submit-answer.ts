import z from "zod";
import { SubmittedAnswerSchema } from "../../../../util/validator";

export const SubmitAnswerSchema = z.object({
  event: z.literal("SUBMIT_ANSWER"),
  payload: z.object({
    submission: SubmittedAnswerSchema,
  }),
});

export type SubmitAnswer = z.infer<typeof SubmitAnswerSchema>;

export const createSubmitAnswerEvent = (submission: z.infer<typeof SubmittedAnswerSchema>): SubmitAnswer => {
  return SubmitAnswerSchema.parse({
    event: "SUBMIT_ANSWER",
    payload: { submission }
  });
};