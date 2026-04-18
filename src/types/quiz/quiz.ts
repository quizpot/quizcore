import { z } from "zod";
import { QuizThemeSchema } from "./theme";
import { QuizStepSchema } from "./step";

const QuizBase = {
  id: z.uuid(),
  version: z.literal(2),
  title: z.string()
    .min(1, "Title must be at least 1 character long")
    .max(64, "Title can't be longer than 64 characters"),
  theme: QuizThemeSchema,
  language: z.string()
    .length(2, "Language must be a 2-letter ISO 639-1 code"),
  steps: z.array(QuizStepSchema)
    .min(1, "Quiz must have at least 1 step"),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
};

const ImageHash = z.string().regex(/^[a-f0-9]{64}$/i, "Invalid SHA-256 hash");

export const QuizInfoSchema = z.object({
  theme: QuizThemeSchema,
  stepCount: z.number(),
  title: z.string()
});

export type QuizInfo = z.infer<typeof QuizInfoSchema>;

export const QuizSchema = z.object({
  ...QuizBase,
  images: z.record(
    ImageHash,
    z.url("Image must be an URL")
  ),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const QuizFileSchema = z.object({
  ...QuizBase,
  images: z.record(
    ImageHash,
    z.string().refine(
      (val) => val.startsWith("http") || val.startsWith("data:image/"),
      "Image must be a valid URL or Base64 data string"
    )
  ),
});

export type QuizFile = z.infer<typeof QuizFileSchema>;