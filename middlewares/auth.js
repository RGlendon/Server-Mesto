const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  let payload;

  if (!jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  // eslint ругался, пришлось next вернуть,
  // хотя в /routes/cards есть аналогичная функция validateId и линтер молчит
  return next();
};
