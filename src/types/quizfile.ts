import z from "zod";
import { QuizThemeSchema } from "./quiztheme";
import { QuizStepSchema } from "./quizstep";

export type QuizFile = z.infer<typeof QuizFileSchema>;

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

  images: z.record(
    z.hash("sha256", { error: "Invalid image hash" }),
    z.string().refine((val) => {
      return val.startsWith("http") || val.startsWith("data:image/");
    }, "Image must be a valid URL or Base64 data string")
  ),

  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});