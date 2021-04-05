const wordRepo = require('./aggregatedWord.db.repository');

const getAll = async (userId, group, page, perPage, filter, book) =>
  wordRepo.getAll(userId, group, page, perPage, filter, book);

const getPages = async (userId, group) => wordRepo.getPages(userId, group);

const get = async (wordId, userId) => wordRepo.get(wordId, userId);

const getAggregatedWordsStat = async (userId, group) =>
  wordRepo.getAggregatedWordsStat(userId, group);

module.exports = { getAll, get, getPages, getAggregatedWordsStat };
