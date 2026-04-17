import z from "zod";
import { LobbySchema, PlayerSchema } from "../../lobby";
import { AnswerSchema } from "../../../util/validator";

const StrippedLobbySchema = LobbySchema.omit({
  host: true,
  quiz: true,
  players: true,
  currentAnswers: true,
  answers: true,
});

export const LobbyJoinedSchema = z.object({
  type: z.literal("LOBBY_JOINED"),
  payload: z.object({
    lobby: StrippedLobbySchema,
    me: PlayerSchema.optional(),
    players: z.array(PlayerSchema).optional(),
    currentAnswers: z.array(AnswerSchema).optional(),
    answers: z.array(AnswerSchema).optional(),
  }),
});

export type LobbyJoined = z.infer<typeof LobbyJoinedSchema>;

export const createLobbyJoinedEvent = (
  lobby: z.infer<typeof LobbySchema>, 
  me: z.infer<typeof PlayerSchema>, 
  isHost: boolean
): LobbyJoined => {
  return LobbyJoinedSchema.parse({
    type: "LOBBY_JOINED",
    payload: {
      lobby,
      me,
      players: isHost ? lobby.players : undefined,
      currentAnswers: isHost ? lobby.currentAnswers : undefined,
      answers: isHost ? lobby.answers : undefined,
    }
  });
};