const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');
const { NODE_ENV, JWT_SECRET } = process.env;


module.exports.auth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  let payload;

  if (!jwt) {
    throw new Unauthorized('Необходима авторизация');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
