import z from "zod";
import { Question, QuestionSchema, SlideLayout, SlideLayoutSchema } from "./quizfile";

export type QuizStep =
  | {
      type: "question";
      data: Question;
    }
  | {
      type: "slide";
      data: SlideLayout;
    };

export const QuizStepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("question"), data: QuestionSchema }),
  z.object({ type: z.literal("slide"), data: SlideLayoutSchema }),
]);