const wordRepo = require('./word.db.repository');

const getAll = async conditions => wordRepo.getAll(conditions);

const getGroup = async conditions => wordRepo.getGroup(conditions);

const get = async (wordId, count) => {
  const word = await wordRepo.get(wordId);
  word.sort(() => Math.random() - 0.5);
  return word.slice(0, count);
};

module.exports = { getAll, get, getGroup };
