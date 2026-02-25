import z from "zod";

export type ComparisonSlideLayout = z.infer<typeof ComparisonSlideLayoutSchema>;

export const ComparisonSlideLayoutSchema = z.object({
  slideType: z.literal("comparison"),
  title: z.string(),
  left: z.string(),
  right: z.string(),
});