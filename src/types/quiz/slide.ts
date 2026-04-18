import z from "zod";
import { TitleSlideLayoutSchema } from "../slides/titleSlide";
import { TitleImageTextSlideLayoutSchema } from "../slides/titleImageTextSlide";

export type SlideLayout = z.infer<typeof SlideLayoutSchema>;

export const SlideLayoutSchema = z.discriminatedUnion("slideType", [
  TitleSlideLayoutSchema,
  TitleImageTextSlideLayoutSchema
]);