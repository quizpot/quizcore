import z from "zod";
import { Question, QuestionSchema } from "./question";
import { Slide, SlideSchema } from "./slide";

export type QuizStep =
  | {
      type: "question";
      data: Question;
    }
  | {
      type: "slide";
      data: Slide;
    };

export const QuizStepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("question"), data: QuestionSchema }),
  z.object({ type: z.literal("slide"), data: SlideSchema }),
]);