const Statistics = require('./statistic.model');
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

module.exports = { get, upsert, remove };
