const wordRepo = require('./aggregatedWord.db.repository');

const getAll = async (userId, group, page, perPage, filter, book) =>
  wordRepo.getAll(userId, group, page, perPage, filter, book);

const getGameWords = async (userId, group, page, filter, count, book) => {
  console.log(count);
  const words = await wordRepo.getGameWords(
    userId,
    group,
    page,
    600,
    filter,
    count,
    book
  );
  console.log(words);
  return words;
};

const fillGameWords = async (
  userId,
  group,
  page,
  perPage,
  filter,
  count,
  book
) => {
  const words = await wordRepo.getAll(
    userId,
    group,
    page,
    perPage,
    filter,
    book
  );
  words[0].paginatedResults = words[0].paginatedResults.sort(
    () => Math.random() - 0.5
  );
  words[0].paginatedResults = words[0].paginatedResults.slice(0, count);
  return words;
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
  getGameWords,
  fillGameWords
};
