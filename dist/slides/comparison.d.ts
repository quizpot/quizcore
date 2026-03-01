import z from "zod";
export type ComparisonSlideLayout = z.infer<typeof ComparisonSlideLayoutSchema>;
export declare const ComparisonSlideLayoutSchema: z.ZodObject<{
    slideType: z.ZodLiteral<"comparison">;
    title: z.ZodString;
    left: z.ZodString;
    right: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=comparison.d.ts.map