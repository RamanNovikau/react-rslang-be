const { OK } = require('http-status-codes');
const router = require('express').Router();

const wordService = require('./word.service');
const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');
const extractQueryParam = require('../../utils/getQueryNumberParameter');

router.route('/').get(async (req, res) => {
  const page = extractQueryParam(req.query.page, 0);
  const group = extractQueryParam(req.query.group, 0);

  if (isNaN(page) || isNaN(group)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page numbers should be valid integers'
    );
  }

  const words = await wordService.getAll({
    page,
    group
  });
  res.status(OK).send(words.map(word => word.toResponse()));
});

router.route('/gbg').get(async (req, res) => {
  const group = extractQueryParam(req.query.group, 0);

  if (isNaN(group)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the group, page numbers should be valid integers'
    );
  }

  const words = await wordService.getAllByGroups(group);
  res.status(OK).send(words);
});

router.route('/group/:id').get(async (req, res) => {
  const count = extractQueryParam(req.query.count, 30);

  if (isNaN(count)) {
    throw new BAD_REQUEST_ERROR(
      'Wrong query parameters: the count should be valid integers'
    );
  }
  const words = await wordService.getGroup(req.params.id, count);
  res.status(OK).send(words.map(word => word.toResponse()));
});

router.route('/:id').get(async (req, res) => {
  const word = await wordService.get(req.params.id);
  res.status(OK).send(word.toResponse());
});

module.exports = router;
