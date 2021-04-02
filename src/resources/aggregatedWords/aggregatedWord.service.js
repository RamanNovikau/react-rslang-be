const wordRepo = require('./aggregatedWord.db.repository');

const getAll = async (userId, group, page, perPage, filter, book) =>
  wordRepo.getAll(userId, group, page, perPage, filter, book);

const getPages = async (userId, group) => wordRepo.getPages(userId, group);

const get = async (wordId, userId) => wordRepo.get(wordId, userId);

module.exports = { getAll, get, getPages };
