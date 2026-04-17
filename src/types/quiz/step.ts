import z from "zod";
import { Question, QuestionSchema } from "./question";
import { SlideLayout, SlideLayoutSchema } from "./slide";

export const QuizStepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("question"), data: QuestionSchema }),
  z.object({ type: z.literal("slide"), data: SlideLayoutSchema }),
]);

export type QuizStep =
  | {
      type: "question";
      data: Question;
    }
  | {
      type: "slide";
      data: SlideLayout;
    };