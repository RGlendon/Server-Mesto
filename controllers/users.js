const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500)
      .send({ message: err.errors }));
};


const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(404)
        .send({ message: 'Пользователь не найден' });
    })
    .catch((err) => res.status(500)
      .send({ message: err.errors }));
};


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const { email, password } = req.body;

  const regExp = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*/;
  if (!regExp.test(password)) {
    res.status(400)
      .send({ message: 'Пароль должен содержать как минимун одну прописную и заглавную буквы, цифру. Минимальная длина 8 символов' });
    return;
  }

  // решил использовать модуль mongoose-unique-validator
  // User.findOne({ email })
  //   .then((user) => {
  //     if (user) {
  //       return Promise.reject(new Error('Такая почта уже существует'));
  //     }
  //   })
  //   .catch((err) => {
  //     return res.status(400).send({ message: err.message });
  //   });

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: err.message });
      } else {
        res.status(500)
          .send({ message: err.errors });
      }
    });
};


const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // токен действителен неделю как и куки, какой вариант оставить?
      const token = jwt.sign({ _id: user._id }, 'some-key', { expiresIn: '7d' });
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: 'Вы залогинены!' }) // для проверки
        .end();
    })
    .catch((err) => {
      res.status(401)
        .send({ message: err.message });
    });
};


const updateProfile = (req, res) => {
  // можно ли как-то прокинуть переменную updateProps в next()?
  // тогда можно было бы вынести проверку в отдельный middleware
  const updateProps = {};

  Object.keys(req.body)
    .forEach((key) => {
      if (key === 'name' || key === 'about') {
        updateProps[key] = req.body[key];
      }
    });
  // не очень понятен 8-ой пункт домашнего задания, как именно проконтролировать,
  // чтобы пользователь не мог редактировать чужие профили, у меня же здесь
  // req.user._id передается через куки и соответсвенно поиск профиля осуществляется только не
  // его _id. Никакие req.params по данному API не передаются
  User.findByIdAndUpdate(req.user._id, updateProps, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500)
      .send({ message: err.errors }));
};


const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!(avatar && validator.isURL(avatar))) {
    res.status(400)
      .send({ message: 'введите URL в формате: http://my-site.ru/...' });
    return;
  }
  // здесь аналогичная ситуация
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500)
      .send({ message: err.errors }));
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
