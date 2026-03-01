import z from "zod";
export type TitleImageTextSlideLayout = z.infer<typeof TitleImageTextSlideLayoutSchema>;
export declare const TitleImageTextSlideLayoutSchema: z.ZodObject<{
    slideType: z.ZodLiteral<"titleImageText">;
    title: z.ZodString;
    imageHash: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
    text: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=titleImageTextSlide.d.ts.map