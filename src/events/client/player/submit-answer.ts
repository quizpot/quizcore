import { SubmittedAnswer } from "../../../util/validator";

export type SubmitAnswer = {
  type: "SUBMIT_ANSWER";
  payload: { submission: SubmittedAnswer };
};

export const createSubmitAnswerEvent = (submission: SubmittedAnswer): SubmitAnswer => ({
  type: "SUBMIT_ANSWER",
  payload: { submission }
});