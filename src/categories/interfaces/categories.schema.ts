import * as mongoose from 'mongoose';
import { IEvent } from './categories.interface';
import { Player } from 'src/jogadores/interfaces/player.interface';

export const CategoriesSchema = new mongoose.Schema(
  {
    categorie: { type: String, unique: true },
    description: String,
    events: Array<IEvent>,
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  { timestamps: true, collection: 'categories' },
);
