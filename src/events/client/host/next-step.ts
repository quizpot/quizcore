export type NextStep = {
  type: "NEXT_STEP";
};

export const createNextStepEvent = (): NextStep => ({
  type: "NEXT_STEP",
});