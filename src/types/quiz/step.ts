import z from "zod";
import { Question, QuestionSchema } from "./question";
import { SlideLayout, SlideLayoutSchema } from "./slide";
import { SafeQuestion, SafeQuestionSchema } from "./safe-question";

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

export const SafeQuizStepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("question"), data: SafeQuestionSchema }),
  z.object({ type: z.literal("slide"), data: SlideLayoutSchema }),
]);

export type SafeQuizStep =
  | {
      type: "question";
      data: SafeQuestion;
    }
  | {
      type: "slide";
      data: SlideLayout;
    };