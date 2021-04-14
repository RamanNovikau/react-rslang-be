const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const userScoreSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  },
  { collection: 'user-scores' }
);

addMethods(userScoreSchema);

module.exports = mongoose.model('UserScores', userScoreSchema);
