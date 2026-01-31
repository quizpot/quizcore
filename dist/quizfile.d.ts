import { MultipleChoiceQuestion, SafeMultipleChoiceQuestion } from "./questions/multiple-choice";
import { SafeShortAnswerQuestion, ShortAnswerQuestion } from "./questions/short-answer";
import { SafeTrueFalseQuestion, TrueFalseQuestion } from "./questions/true-false";
export type QuizFile = {
    id: string;
    version: 2;
    title: string;
    description?: string;
    theme: QuizTheme;
    language: string;
    steps: QuizStep[];
    images: Record<string, string>;
    updatedAt: string;
    createdAt: string;
};
export type QuizTheme = {
    color: string;
    background?: string;
};
export type QuizStep = {
    type: "question";
    data: Question;
} | {
    type: "slide";
    data: SlideLayout;
};
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;
export type SafeQuestion = SafeMultipleChoiceQuestion | SafeTrueFalseQuestion | SafeShortAnswerQuestion;
export type QuestionPoints = "normalPoints" | "doublePoints" | "noPoints";
export interface BaseQuestion {
    question: string;
    imageHash?: string;
    displayTime: number;
    timeLimit: number;
    points: QuestionPoints;
}
export type SlideLayout = TitleSlideLayout | TitleAndTextSlideLayout | TitleAndTextWithImageSlideLayout | ComparisonSlideLayout | TitleImageTextSlideLayout;
export type TitleSlideLayout = {
    slideType: "title";
    title: string;
    subtitle?: string;
};
export type TitleImageTextSlideLayout = {
    slideType: "titleImageText";
    title: string;
    imageHash?: string;
    text: string;
};
export type TitleAndTextSlideLayout = {
    slideType: "titleAndText";
    title: string;
    text: string;
};
export type TitleAndTextWithImageSlideLayout = {
    slideType: "titleAndTextWithImage";
    title: string;
    text: string;
    imageHash?: string;
};
export type ComparisonSlideLayout = {
    slideType: "comparison";
    title: string;
    left: string;
    right: string;
};
//# sourceMappingURL=quizfile.d.ts.map