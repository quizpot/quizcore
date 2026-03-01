import { z } from "zod";
export declare const QuizFileSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodLiteral<2>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    theme: z.ZodObject<{
        color: z.ZodString;
        background: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    language: z.ZodString;
    steps: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"question">;
        data: z.ZodDiscriminatedUnion<[z.ZodObject<{
            question: z.ZodString;
            imageHash: z.ZodOptional<z.ZodString>;
            displayTime: z.ZodNumber;
            timeLimit: z.ZodNumber;
            points: z.ZodEnum<{
                normalPoints: "normalPoints";
                doublePoints: "doublePoints";
                noPoints: "noPoints";
            }>;
            type: z.ZodLiteral<"multiple-choice">;
            options: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                text: z.ZodString;
                isCorrect: z.ZodBoolean;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            question: z.ZodString;
            imageHash: z.ZodOptional<z.ZodString>;
            displayTime: z.ZodNumber;
            timeLimit: z.ZodNumber;
            points: z.ZodEnum<{
                normalPoints: "normalPoints";
                doublePoints: "doublePoints";
                noPoints: "noPoints";
            }>;
            type: z.ZodLiteral<"true-false">;
            answer: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            question: z.ZodString;
            imageHash: z.ZodOptional<z.ZodString>;
            displayTime: z.ZodNumber;
            timeLimit: z.ZodNumber;
            points: z.ZodEnum<{
                normalPoints: "normalPoints";
                doublePoints: "doublePoints";
                noPoints: "noPoints";
            }>;
            type: z.ZodLiteral<"short-answer">;
            acceptedAnswers: z.ZodArray<z.ZodString>;
        }, z.core.$strip>], "type">;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"slide">;
        data: z.ZodDiscriminatedUnion<[z.ZodObject<{
            slideType: z.ZodLiteral<"title">;
            title: z.ZodString;
            subtitle: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"titleAndText">;
            title: z.ZodString;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"titleAndTextWithImage">;
            title: z.ZodString;
            text: z.ZodString;
            imageHash: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"comparison">;
            title: z.ZodString;
            left: z.ZodString;
            right: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"titleImageText">;
            title: z.ZodString;
            imageHash: z.ZodOptional<z.ZodString>;
            text: z.ZodString;
        }, z.core.$strip>], "slideType">;
    }, z.core.$strip>], "type">>;
    images: z.ZodRecord<z.ZodString, z.ZodString>;
    updatedAt: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type QuizFile = z.infer<typeof QuizFileSchema>;
//# sourceMappingURL=quizfile.d.ts.map