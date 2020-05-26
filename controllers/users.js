const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;


const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => User
  .findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  })
  .catch(next);


const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const { email, password } = req.body;

  const regExp = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*/;
  if (!regExp.test(password)) {
    res.status(400)
      .send({ message: 'Пароль должен содержать как минимун одну прописную и заглавную буквы, цифру. Минимальная длина 8 символов' });
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    // если не провести поиск, почему-то поле password возвращается
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      return err;
    })
    .catch(next);
};


const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: 'Вы залогинены!' }) // для проверки
        .end();
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};


const updateProfile = (req, res, next) => {
  const updateProps = {};

  Object.keys(req.body)
    .forEach((key) => {
      if (key === 'name' || key === 'about') {
        updateProps[key] = req.body[key];
      }
    });

  User.findByIdAndUpdate(req.user._id, updateProps, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      return err;
    })
    .catch(next);
};


const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      return err;
    })
    .catch(next);
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
