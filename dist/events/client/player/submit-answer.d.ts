import { SubmittedAnswer } from "../../../util/validator";
export type SubmitAnswer = {
    type: "SUBMIT_ANSWER";
    payload: {
        submission: SubmittedAnswer;
    };
};
export declare const createSubmitAnswerEvent: (submission: SubmittedAnswer) => SubmitAnswer;
//# sourceMappingURL=submit-answer.d.ts.map