const bcrypt = require('bcryptjs');
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
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.errors });
      }
    });
};


const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
  const updateProps = {};

  Object.keys(req.body)
    .forEach((key) => {
      if (key === 'name' || key === 'about') {
        updateProps[key] = req.body[key];
      }
    });

  User.findByIdAndUpdate(req.user._id, updateProps, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500)
      .send({ message: err.errors }));
};


const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  // if (!(avatar && validator.isURL(avatar))) {
  //   res.status(400)
  //     .send({ message: 'введите URL в формате: http://my-site.ru/...' });
  //   return;
  // }

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
