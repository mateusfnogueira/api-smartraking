import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema({
  challengeDate: { type: Date },
  status: { type: String },
  requestDate: { type: Date },
  responseDate: { type: Date },
  requesting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  category: { type: String },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  },
});
