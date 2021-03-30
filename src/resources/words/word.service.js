const wordRepo = require('./word.db.repository');

const getAll = async conditions => wordRepo.getAll(conditions);

const getGroup = async (conditions, count) => {
  const words = await wordRepo.getGroup(conditions);
  words.sort(() => Math.random() - 0.5);
  return words.slice(0, count);
};

const get = async wordId => {
  const word = await wordRepo.get(wordId);

  return word;
};

module.exports = { getAll, get, getGroup };
