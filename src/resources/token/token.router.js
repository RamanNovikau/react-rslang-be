const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });

const tokenService = require('./token.service');

router.get('/', async (req, res) => {
  console.log(`ROUTE:${req.userId}-${req.tokenId}`);
  const userData = await tokenService.refresh(req.userId, req.tokenId);
  res.status(OK).send(userData);
});

module.exports = router;
