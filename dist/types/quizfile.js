import z from "zod";
import { TitleSlideLayoutSchema } from "../slides/titleSlide";
import { TitleImageTextSlideLayoutSchema } from "../slides/titleImageTextSlide";
import { ComparisonSlideLayoutSchema } from "../slides/comparison";
export const QuizFileSchema = z.object({
    id: z.uuid(),
    version: z.literal(2),
    title: z.string()
        .min(1, "Title must be atleast 1 character long")
        .max(64, "Title can't be longer than 64 characters"),
    description: z.string()
        .max(255, "Description can't be longer than 256 characters")
        .optional(),
    theme: QuizThemeSchema,
    language: z.string()
        .length(2, "Language must be a 2-letter ISO 639-1 code"),
    steps: z.array(QuizStepSchema)
        .min(1, "Quiz must have at least 1 step"),
    images: z.record(z.hash("sha256", { error: "Invalid image hash" }), z.string().refine((val) => {
        return val.startsWith("http") || val.startsWith("data:image/");
    }, "Image must be a valid URL or Base64 data string")),
    updatedAt: z.iso.datetime(),
    createdAt: z.iso.datetime(),
});
export const QuizThemeSchema = z.object({
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: 'Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).' }),
    background: z.hash("sha256", { error: "Invalid background hash" }).optional(),
});
export const QuizStepSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("question"), data: QuestionSchema }),
    z.object({ type: z.literal("slide"), data: SlideLayoutSchema }),
]);
export const QuestionSchema = z.discriminatedUnion("type", [
    MultipleChoiceSchema,
    TrueFalseSchema,
    ShortAnswerSchema,
]);
export const SafeQuestionSchema = z.discriminatedUnion("type", [
    SafeMultipleChoiceSchema,
    SafeTrueFalseSchema,
    SafeShortAnswerSchema,
]);
export const QuestionPointsSchema = z.enum(["normalPoints", "doublePoints", "noPoints"]);
export const BaseQuestionSchema = z.object({
    question: z.string().min(1),
    imageHash: z.hash("sha256", { error: "Invalid image hash" }).optional(),
    displayTime: z.number().min(1).max(60),
    timeLimit: z.number().min(1).max(180),
    points: QuestionPointsSchema,
});
export const SlideLayoutSchema = z.discriminatedUnion("slideType", [
    TitleSlideLayoutSchema,
    TitleImageTextSlideLayoutSchema,
    ComparisonSlideLayoutSchema
]);
