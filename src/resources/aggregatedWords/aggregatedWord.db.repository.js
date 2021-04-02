const mongoose = require('mongoose');

const Word = require('../words/word.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');
const ENTITY_NAME = 'user word';

const lookup = {
  $lookup: {
    from: 'userWords',
    let: { word_id: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$userId', null] },
              { $eq: ['$wordId', '$$word_id'] }
            ]
          }
        }
      }
    ],
    as: 'userWord'
  }
};

const pipeline = [
  {
    $unwind: {
      path: '$userWord',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unset: [
      '__v',
      'userWord._id',
      'userWord.wordId',
      'userWord.userId',
      'userWord.__v'
    ]
  }
];

const getPages = async (userId, group) => {
  lookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = mongoose.Types.ObjectId(
    userId
  );

  const matches = [];

  if (group || group === 0) {
    matches.push({
      $match: {
        group
      }
    });
  }

  const pagesFilter = {
    $or: [{ 'userWord.status': { $ne: 'deleted' } }, { userWord: null }]
  };

  matches.push({
    $match: {
      ...pagesFilter
    }
  });

  const groupPage = {
    $group: {
      _id: '$page',
      count: {
        $sum: 1
      }
    }
  };

  return await Word.aggregate([lookup, ...pipeline, ...matches, groupPage]);
};

const getAll = async (userId, group, page, perPage, filter, book) => {
  lookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = mongoose.Types.ObjectId(
    userId
  );

  const matches = [];
  let facet = {};

  if (book) {
    if ((group || group === 0) && (page || page === 0)) {
      matches.push({
        $match: {
          group,
          page
        }
      });
    }
    facet = {
      $facet: {
        paginatedResults: [{ $limit: perPage }],
        totalCount: [
          {
            $count: 'count'
          }
        ]
      }
    };
  } else {
    if (group || group === 0) {
      matches.push({
        $match: {
          group
        }
      });
    }
    facet = {
      $facet: {
        paginatedResults: [{ $skip: page * perPage }, { $limit: perPage }],
        totalCount: [
          {
            $count: 'count'
          }
        ]
      }
    };
  }

  if (filter) {
    matches.push({
      $match: {
        ...filter
      }
    });
  }
  return await Word.aggregate([lookup, ...pipeline, ...matches, facet]);
};

const get = async (wordId, userId) => {
  lookup.$lookup.pipeline[0].$match.$expr.$and[0].$eq[1] = mongoose.Types.ObjectId(
    userId
  );

  const match = {
    $match: {
      _id: mongoose.Types.ObjectId(wordId)
    }
  };

  const userWord = await Word.aggregate([match, lookup, ...pipeline]);
  if (!userWord) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { wordId, userId });
  }

  return userWord;
};

module.exports = { getAll, get, getPages };

// [
//   {
//     '$lookup': {
//       'from': 'userWords',
//       'let': {
//         'word_id': '$_id'
//       },
//       'pipeline': [
//         {
//           '$match': {
//             '$expr': {
//               '$and': [
//                 {
//                   '$eq': [
//                     '$userId', new ObjectId('605d826946051229947e4eb3')
//                   ]
//                 }, {
//                   '$eq': [
//                     '$wordId', '$$word_id'
//                   ]
//                 }
//               ]
//             }
//           }
//         }
//       ],
//       'as': 'userWord'
//     }
//   }, {
//     '$unwind': {
//       'path': '$userWord',
//       'preserveNullAndEmptyArrays': true
//     }
//   }, {
//     '$unset': [
//       '__v', 'userWord._id', 'userWord.wordId', 'userWord.userId', 'userWord.__v'
//     ]
//   }, {
//     '$match': {
//       '$or': [
//         {
//           'userWord.status': 'hard'
//         }, {
//           'userWord': null
//         }
//       ]
//     }
//   }, {
//     '$match': {
//       'group': 0
//     }
//   }, {
//     '$group': {
//       '_id': '$page',
//       'count': {
//         '$sum': 1
//       }
//     }
//   }
// ]
