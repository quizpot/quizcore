import { LobbyStatus, Player, LobbySettings } from "./lobby";
import { SubmittedAnswer } from "../util/validator";

/**
 * Events sent FROM the Client TO the Server
 */
export namespace ClientEvents {
  export type JoinRoom = {
    type: "JOIN_ROOM";
    payload: { code: string; name: string };
  };

  export type SubmitAnswer = {
    type: "SUBMIT_ANSWER";
    payload: { submission: SubmittedAnswer };
  };

  export type NextStep = {
    type: "NEXT_STEP";
  };

  export type All = JoinRoom | SubmitAnswer | NextStep;
}

/**
 * Events sent FROM the Server TO the Client
 */
export namespace ServerEvents {
  export type LobbyUpdate = {
    type: "LOBBY_UPDATE";
    payload: {
      status: LobbyStatus;
      players: Player[];
      currentStepIndex: number;
      stepStartedAt: number | null;
      settings: LobbySettings;
    };
  };

  export type GameError = {
    type: "ERROR";
    payload: { message: string; code: number };
  };

  export type All = LobbyUpdate | GameError;
}