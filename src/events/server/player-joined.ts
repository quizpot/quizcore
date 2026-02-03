import { Player } from "../../types/lobby";

export type PlayerJoined = {
  type: "PLAYER_JOINED";
  payload: { player: Player };
};

export const createPlayerJoinedEvent = (player: Player): PlayerJoined => ({
  type: "PLAYER_JOINED",
  payload: { player }
});