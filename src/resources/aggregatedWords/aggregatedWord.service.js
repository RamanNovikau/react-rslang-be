const wordRepo = require('./aggregatedWord.db.repository');

const getAll = async (userId, group, page, perPage, filter, book) =>
  wordRepo.getAll(userId, group, page, perPage, filter, book);

const getGameWords = async (userId, group, page, filter, count, book) => {
  const words = await wordRepo.getAll(userId, group, page, 600, filter, book);
  words.sort(() => Math.random() - 0.5);
  return words.slice(0, count);
};

const getPages = async (userId, group) => wordRepo.getPages(userId, group);

const get = async (wordId, userId) => wordRepo.get(wordId, userId);

const getAggregatedWordsStat = async (userId, group, filter) =>
  wordRepo.getAggregatedWordsStat(userId, group, filter);

module.exports = {
  getAll,
  get,
  getPages,
  getAggregatedWordsStat,
  getGameWords
};
