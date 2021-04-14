const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const statisticService = require('./statistic.service');
const { statistics, score } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');
const extractQueryParam = require('../../utils/getQueryNumberParameter');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');

router.get('/', async (req, res) => {
  const statistic = await statisticService.get(req.userId);
  res.status(OK).send(statistic.toResponse());
});

router.put('/', validator(statistics, 'body'), async (req, res) => {
  const learnedWords = extractQueryParam(req.query.lw, 0);
  const todaylLearnedWords = extractQueryParam(req.query.tlw, 0);

  if (isNaN(learnedWords) || isNaN(todaylLearnedWords)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the learnedWords, todaylLearnedWords numbers should be valid integers'
    );
  }

  const statistic = await statisticService.upsert(
    req.userId,
    req.body,
    learnedWords,
    todaylLearnedWords
  );
  res.status(OK).send(statistic.toResponse());
});

router.put('/score', validator(score, 'body'), async (req, res) => {
  console.log(req.body);
  const scoreData = await statisticService.upsertScore(req.userId, req.body);
  res.status(OK).send(scoreData);
});

router.get('/score', async (req, res) => {
  const scoreData = await statisticService.getScore(req.userId);
  res.status(OK).send(scoreData);
});

module.exports = router;
