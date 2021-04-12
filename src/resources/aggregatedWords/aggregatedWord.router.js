const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });

const { wordId } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');
const aggregatedWordsService = require('./aggregatedWord.service');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.get('/', async (req, res) => {
  const perPage = extractQueryParam(req.query.wordsPerPage, 10);
  const page = extractQueryParam(req.query.page, 0);
  const group = extractQueryParam(req.query.group);
  const book = extractQueryParam(req.query.book, false);

  console.log(book);

  if ((req.query.group && isNaN(group)) || isNaN(page) || isNaN(perPage)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page and words-per-page numbers should be valid integers'
    );
  }

  const filter = req.query.filter ? JSON.parse(req.query.filter) : null;

  const words = await aggregatedWordsService.getAll(
    req.userId,
    group,
    page,
    perPage,
    filter,
    book
  );
  res.status(OK).send(words);
});

router.get('/group', async (req, res) => {
  const group = extractQueryParam(req.query.group);

  if (req.query.group && isNaN(group)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page and words-per-page numbers should be valid integers'
    );
  }

  const words = await aggregatedWordsService.getPages(req.userId, group);
  res.status(OK).send(words.sort((a, b) => a._id - b._id));
});

router.get('/stat', async (req, res) => {
  const group = extractQueryParam(req.query.group);

  if (req.query.group && isNaN(group)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page and words-per-page numbers should be valid integers'
    );
  }
  const filter = req.query.filter ? JSON.parse(req.query.filter) : null;

  const stat = await aggregatedWordsService.getAggregatedWordsStat(
    req.userId,
    group,
    filter
  );
  res.status(OK).send(stat);
});

router.get('/game', async (req, res) => {
  const count = extractQueryParam(req.query.count, 30);
  const page = extractQueryParam(req.query.page, 0);
  const group = extractQueryParam(req.query.group);
  const book = extractQueryParam(req.query.book, false);

  console.log(book);

  if ((req.query.group && isNaN(group)) || isNaN(page) || isNaN(count)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page and words-per-page numbers should be valid integers'
    );
  }

  const filter = req.query.filter ? JSON.parse(req.query.filter) : null;

  const words = await aggregatedWordsService.getGameWords(
    req.userId,
    group,
    page,
    filter,
    count,
    book
  );
  res.status(OK).send(words);
});

router.get('/:wordId', validator(wordId, 'params'), async (req, res) => {
  const word = await aggregatedWordsService.get(req.params.wordId, req.userId);

  res.status(OK).send(word);
});

module.exports = router;
