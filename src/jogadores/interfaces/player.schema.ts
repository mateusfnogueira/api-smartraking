import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    telephone: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhotoPlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
