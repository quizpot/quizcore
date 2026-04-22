import z from "zod";
import { TitleSlideLayoutSchema } from "../slides/title-slide";
import { ContentSlideSchema } from "../slides/content-slide";

export type SlideLayout = z.infer<typeof SlideLayoutSchema>;

export const SlideLayoutSchema = z.discriminatedUnion("slideType", [
  TitleSlideLayoutSchema,
  ContentSlideSchema
]);