const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { AUTHENTICATION_ERROR } = require('../../errors/appErrors');

const tokenRepo = require('./token.db.repository');

const userRepo = require('../users/user.db.repository');
const {
  JWT_SECRET_KEY,
  JWT_EXPIRE_TIME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRE_TIME
} = require('../../common/config');

const refresh = async (userId, tokenId) => {
  const tokenData = await tokenRepo.get(userId, tokenId);
  if (Date.now() > tokenData.expire) {
    throw new AUTHENTICATION_ERROR('Token is expired');
  }
  const user = await userRepo.get(userId);
  console.log(user);
  const { token, refreshToken } = await getTokens(userId);
  return {
    token,
    refreshToken,
    userId: user._id,
    name: user.name,
    userImage: user.userImage,
    nickname: user.nickname
  };
};

const getTokens = async userId => {
  const token = jwt.sign({ id: userId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE_TIME
  });

  const tokenId = uuid();
  const refreshToken = jwt.sign(
    { id: userId, tokenId },
    JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: JWT_REFRESH_EXPIRE_TIME
    }
  );

  await tokenRepo.upsert({
    userId,
    tokenId,
    expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000
  });

  return { token, refreshToken };
};

const upsert = token => tokenRepo.upsert(token);

module.exports = { refresh, getTokens, upsert };
