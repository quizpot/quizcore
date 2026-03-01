import z from "zod";
export const TitleImageTextSlideLayoutSchema = z.object({
    slideType: z.literal("titleImageText"),
    title: z.string(),
    imageHash: z.hash("sha256", { error: "Invalid image hash" }).optional(),
    text: z.string(),
});
