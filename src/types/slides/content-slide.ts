import z from "zod";

export const ContentSlideSchema = z.object({
  slideType: z.literal("content"),
  title: z.string(),
  imageHash: z.hash("sha256", { error: "Invalid image hash" }).optional(),
  text: z.string(),
});

export type ContentSlideLayout = z.infer<typeof ContentSlideSchema>;
