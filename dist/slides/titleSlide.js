import z from "zod";
export const TitleSlideLayoutSchema = z.object({
    slideType: z.literal("title"),
    title: z.string(),
    subtitle: z.string().optional(),
});
