import z from "zod";
export type TitleSlideLayout = z.infer<typeof TitleSlideLayoutSchema>;
export declare const TitleSlideLayoutSchema: z.ZodObject<{
    slideType: z.ZodLiteral<"title">;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=titleSlide.d.ts.map