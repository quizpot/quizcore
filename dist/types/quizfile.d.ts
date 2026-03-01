import z from "zod";
import { MultipleChoiceQuestion, SafeMultipleChoiceQuestion } from "../questions/multiple-choice";
import { SafeShortAnswerQuestion, ShortAnswerQuestion } from "../questions/short-answer";
import { SafeTrueFalseQuestion, TrueFalseQuestion } from "../questions/true-false";
export type QuizFile = z.infer<typeof QuizFileSchema>;
export declare const QuizFileSchema: z.ZodObject<{
    id: z.ZodUUID;
    version: z.ZodLiteral<2>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    theme: z.ZodObject<{
        color: z.ZodString;
        background: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
    }, z.core.$strip>;
    language: z.ZodString;
    steps: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"question">;
        data: z.ZodDiscriminatedUnion<[any, any, any], "type">;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"slide">;
        data: z.ZodDiscriminatedUnion<[z.ZodObject<{
            slideType: z.ZodLiteral<"title">;
            title: z.ZodString;
            subtitle: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"titleImageText">;
            title: z.ZodString;
            imageHash: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            slideType: z.ZodLiteral<"comparison">;
            title: z.ZodString;
            left: z.ZodString;
            right: z.ZodString;
        }, z.core.$strip>], "slideType">;
    }, z.core.$strip>], "type">>;
    images: z.ZodRecord<z.ZodCustomStringFormat<"sha256_hex">, z.ZodString>;
    updatedAt: z.ZodISODateTime;
    createdAt: z.ZodISODateTime;
}, z.core.$strip>;
export type QuizTheme = z.infer<typeof QuizThemeSchema>;
export declare const QuizThemeSchema: z.ZodObject<{
    color: z.ZodString;
    background: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
}, z.core.$strip>;
export type QuizStep = {
    type: "question";
    data: Question;
} | {
    type: "slide";
    data: SlideLayout;
};
export declare const QuizStepSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"question">;
    data: z.ZodDiscriminatedUnion<[any, any, any], "type">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"slide">;
    data: z.ZodDiscriminatedUnion<[z.ZodObject<{
        slideType: z.ZodLiteral<"title">;
        title: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        slideType: z.ZodLiteral<"titleImageText">;
        title: z.ZodString;
        imageHash: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        slideType: z.ZodLiteral<"comparison">;
        title: z.ZodString;
        left: z.ZodString;
        right: z.ZodString;
    }, z.core.$strip>], "slideType">;
}, z.core.$strip>], "type">;
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;
export declare const QuestionSchema: z.ZodDiscriminatedUnion<[any, any, any], "type">;
export type SafeQuestion = SafeMultipleChoiceQuestion | SafeTrueFalseQuestion | SafeShortAnswerQuestion;
export declare const SafeQuestionSchema: z.ZodDiscriminatedUnion<[any, any, any], "type">;
export type QuestionPoints = z.infer<typeof QuestionPointsSchema>;
export declare const QuestionPointsSchema: z.ZodEnum<{
    normalPoints: "normalPoints";
    doublePoints: "doublePoints";
    noPoints: "noPoints";
}>;
export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;
export declare const BaseQuestionSchema: z.ZodObject<{
    question: z.ZodString;
    imageHash: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
    displayTime: z.ZodNumber;
    timeLimit: z.ZodNumber;
    points: z.ZodEnum<{
        normalPoints: "normalPoints";
        doublePoints: "doublePoints";
        noPoints: "noPoints";
    }>;
}, z.core.$strip>;
export type SlideLayout = z.infer<typeof SlideLayoutSchema>;
export declare const SlideLayoutSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    slideType: z.ZodLiteral<"title">;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    slideType: z.ZodLiteral<"titleImageText">;
    title: z.ZodString;
    imageHash: z.ZodOptional<z.ZodCustomStringFormat<"sha256_hex">>;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    slideType: z.ZodLiteral<"comparison">;
    title: z.ZodString;
    left: z.ZodString;
    right: z.ZodString;
}, z.core.$strip>], "slideType">;
//# sourceMappingURL=quizfile.d.ts.map