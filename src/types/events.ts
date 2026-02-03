import { LobbyJoined } from "../events/server/lobby-joined";
import { PlayerJoined } from "../events/server/player-joined";
import { PlayerLeft } from "../events/server/player-left";
import { PlayerUpdate } from "../events/server/player-update";
import { LobbyStatusUpdate } from "../events/server/lobby-status-update";
import { UpdateLobbyAnswers } from "../events/server/update-lobby-answers";
import { PlayerAnswerResult } from "../events/server/player-answer-result";
import { PlayerKicked } from "../events/server/player-kicked";
import { LobbyDeleted } from "../events/server/lobby-deleted";
import { KickPlayer } from "../events/client/host/kick-player";
import { StartLobby } from "../events/client/host/start-lobby";
import { NextStep } from "../events/client/host/next-step";
import { SubmitAnswer } from "../events/client/player/submit-answer";

// Events sent FROM the Client TO the Server
export type AllClientEvents = 
| KickPlayer
| StartLobby
| NextStep
| SubmitAnswer;

// Events sent FROM the Server TO the Client
export type AllServerEvents = 
| PlayerJoined
| PlayerLeft
| PlayerUpdate
| LobbyStatusUpdate
| UpdateLobbyAnswers
| PlayerAnswerResult
| PlayerKicked
| LobbyDeleted
| LobbyJoined;