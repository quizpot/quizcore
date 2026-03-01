import z from "zod";

export const ComparisonSlideLayoutSchema = z.object({
  slideType: z.literal("comparison"),
  title: z.string(),
  left: z.string(),
  right: z.string(),
});

export type ComparisonSlideLayout = z.infer<typeof ComparisonSlideLayoutSchema>;
