import z from "zod";
import { TitleSlideLayoutSchema } from "./slides/titleSlide";
import { TitleImageTextSlideLayoutSchema } from "./slides/titleImageTextSlide";
import { ComparisonSlideLayoutSchema } from "./slides/comparison";

export type Slide = z.infer<typeof SlideSchema>;

export const SlideSchema = z.discriminatedUnion("slideType", [
  TitleSlideLayoutSchema,
  TitleImageTextSlideLayoutSchema,
  ComparisonSlideLayoutSchema
]);
