const validator = require('validator');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.errors }));
};


const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => res.status(500).send({ message: err.errors }));
};


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.errors }));
};


const updateProfile = (req, res) => {
  // можно ли как-то прокинуть переменную updateProps в next()?
  // тогда можно было бы вынести проверку в отдельный middleware
  const updateProps = {};
  // ругается на цикл почему-то
  // for (const key of Object.keys(req.body)) {
  //   if (key === 'name' || key === 'about') {
  //     updateProps[key] = req.body[key];
  //   }
  // }
  Object.keys(req.body).forEach((key) => {
    if (key === 'name' || key === 'about') {
      updateProps[key] = req.body[key];
    }
  });

  User.findByIdAndUpdate(req.user._id, updateProps, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.errors }));
};


const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // const regExp = /^https?:\/\/(www\.)?\w+(-\w+)*(\.\w+(-\w+)*)*(\/.+)*/;

  if (!(avatar && validator.isURL(avatar))) {
    res.status(400).send({message: 'введите URL в формате: http://my-site.ru/...'});
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.errors }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
