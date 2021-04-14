const Statistics = require('./statistic.model');
const Score = require('./score.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async userId => {
  const statistic = await Statistics.findOne({ userId });
  if (!statistic) {
    throw new NOT_FOUND_ERROR('statistic', `userId: ${userId}`);
  }

  return statistic;
};

const upsert = async (
  userId,
  statistic,
  learnedWords = 0,
  todayLearnedWords = 0
) => {
  const stat = await Statistics.findOneAndUpdate(
    { userId },
    {
      $set: statistic
    },
    { upsert: true, new: true }
  );
  let t;
  if (stat && (todayLearnedWords || learnedWords)) {
    t = await Statistics.findOneAndUpdate(
      { userId },
      {
        $inc: {
          learnedWords,
          'optional.today.learnedWordsToday': todayLearnedWords
        }
      },
      { new: true }
    );
  }
  return t || stat;
};

const remove = async userId => Statistics.deleteOne({ userId });

const upsertScore = async (userId, score) => {
  const scoreData = await Score.findOneAndUpdate(
    { userId },
    {
      $inc: { score: score.score }
    },
    { upsert: true, new: true }
  );
  if (!scoreData) {
    throw new NOT_FOUND_ERROR('score', `userId: ${userId}`);
  }
  return scoreData;
};

const getScore = async userId => {
  const scoreData = await Score.findOne({ userId });
  if (!scoreData) {
    throw new NOT_FOUND_ERROR('score', `userId: ${userId}`);
  }

  return scoreData;
};

module.exports = { get, upsert, remove, upsertScore, getScore };
