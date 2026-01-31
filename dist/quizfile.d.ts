export type QuizFile = {
    id: string;
    version: number;
    title: string;
    description?: string;
    theme: QuizTheme;
    language: string;
    steps: QuizStep[];
    images: Record<string, string>;
    updatedAt: Date;
    createdAt: Date;
};
export type QuizStep = {
    type: "question" | "slide";
    data: Question | SlideLayout;
};
export type QuizTheme = {
    color: string;
    background?: string;
};
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion | SlideQuestion;
export type QuestionType = Question['questionType'];
export type QuestionPoints = "normalPoints" | "doublePoints" | "noPoints";
export type MultipleChoiceQuestion = {
    questionType: "multipleChoice";
    question: string;
    image?: string;
    choices: Choice[];
    questionDisplayTime: number;
    timeLimit: number;
    points: QuestionPoints;
};
export type Choice = {
    text: string;
    correct: boolean;
};
export type MultipleChoiceAnswer = {
    answerType: "multipleChoice";
    choiceIndex: number;
};
export type TrueFalseQuestion = {
    questionType: "trueFalse";
    question: string;
    image?: string;
    answer: boolean;
    questionDisplayTime: number;
    timeLimit: number;
    points: QuestionPoints;
};
export type TrueFalseAnswer = {
    answerType: "trueFalse";
    answer: boolean;
};
export type ShortAnswerQuestion = {
    questionType: "shortAnswer";
    question: string;
    image?: string;
    answers: string[];
    questionDisplayTime: number;
    timeLimit: number;
    points: QuestionPoints;
};
export type ShortAnswerAnswer = {
    answerType: "shortAnswer";
    answer: string;
};
export type SlideQuestion = {
    questionType: "slide";
    layout: SlideLayout;
};
export type SlideLayout = TitleSlideLayout | TitleAndTextSlideLayout | TitleAndTextWithImageSlideLayout | ComparisonSlideLayout | TitleImageTextSlideLayout;
export type SlideType = SlideLayout['slideType'];
export type TitleSlideLayout = {
    slideType: "title";
    title: string;
    subtitle?: string;
};
export type TitleImageTextSlideLayout = {
    slideType: "titleImageText";
    title: string;
    image?: string;
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
    image: string;
};
export type ComparisonSlideLayout = {
    slideType: "comparison";
    title: string;
    left: string;
    right: string;
};
//# sourceMappingURL=quizfile.d.ts.map