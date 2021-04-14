const statisticRepo = require('./statistic.db.repository');

const get = async userId => statisticRepo.get(userId);

const upsert = async (userId, statistic, learnedWords, todaylLearnedWords) =>
  statisticRepo.upsert(
    userId,
    { ...statistic, userId },
    learnedWords,
    todaylLearnedWords
  );

const upsertScore = async (userId, score) =>
  statisticRepo.upsertScore(userId, score);

const getScore = async userId => statisticRepo.getScore(userId);

const remove = async userId => statisticRepo.remove(userId);

module.exports = { get, upsert, remove, upsertScore, getScore };
