import { Document } from 'mongoose';
import { Player } from 'src/jogadores/interfaces/player.interface';

export interface Categorie extends Document {
  readonly categorie: string;
  description: string;
  events: Array<IEvent>;
  players: Array<Player>;
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
