import { Document } from 'mongoose';
import { Player } from 'src/jogadores/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface IChallenge extends Document {
  challengeDate: Date;
  status: ChallengeStatus;
  requestDate: Date;
  responseDate: Date;
  requesting: Player;
  category: string;
  players: Array<Player>;
  match: IMatch;
}

export interface IMatch extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
