import { Player } from "../../types/lobby";

export type PlayerUpdate = {
  type: "PLAYER_UPDATE";
  payload: { player: Player };
};

export const createPlayerUpdateEvent = (player: Player): PlayerUpdate => ({
  type: "PLAYER_UPDATE",
  payload: { player }
});