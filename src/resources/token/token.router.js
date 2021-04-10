const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });

const tokenService = require('./token.service');

router.get('/', async (req, res) => {
  const userData = await tokenService.refresh(req.userId, req.tokenId);
  res.status(OK).send(userData);
});

module.exports = router;
