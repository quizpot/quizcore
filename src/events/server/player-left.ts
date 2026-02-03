import { Player } from "../../types/lobby";

export type PlayerLeft = {
  type: "PLAYER_LEFT";
  payload: { player: Player };
};

export const createPlayerLeftEvent = (player: Player): PlayerLeft => ({
  type: "PLAYER_LEFT",
  payload: { player }
});