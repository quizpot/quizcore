import z from "zod";

export type QuizTheme = z.infer<typeof QuizThemeSchema>;

export const QuizThemeSchema = z.object({
  color: z.string().regex(
    /^#[0-9a-fA-F]{6}$/,
    { message: 'Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).' }
  ),
  background: z.hash("sha256", { error: "Invalid background hash" }).optional(),
});