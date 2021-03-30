const Word = require('./word.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');
const ENTITY_NAME = 'word';

const getAll = async conditions => {
  const { group, page } = conditions;

  return Word.find({ group, page });
};

const getGroup = async groupId => {
  return Word.find({ group: groupId });
};

const get = async id => {
  const word = await Word.findOne({ _id: id });
  if (!word) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }
  return word;
};

// {
//   from: 'userWords',
//   let:{ "wI": '$_id',"usI":{"$toObjectId": "605d826946051229947e4eb3"} },
//   pipeline: [{$match: {$expr: {$eq: ["$wordId", "$$wI"]}}},{$match:{$expr: {$eq: ["$userId", "$$usI"]}}}],
//   as: 'string'
// }

module.exports = { getAll, getGroup, get };
