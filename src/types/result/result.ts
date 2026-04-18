import z from "zod";

export const ResultSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  
  // TODO: create a result obejct to see how the players performed in a lobby

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});