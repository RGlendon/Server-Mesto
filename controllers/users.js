const User = require('../models/user');


const getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({data: users}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const getUser = (req, res) => {
    User.findById(req.params.userId)
        .then(user => res.send({data: user}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({name, about, avatar})
        .then(user => res.send({data: user}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const updateProfile = (req, res) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, {name, about}, { new: true })
        .then(user => res.send({data: user}))
        .catch(err => res.status(500).send({message: err.errors}))
};

const updateAvatar = (req, res) => {
    const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, {avatar}, { new: true })
        .then(user => res.send({data: user}))
        .catch(err => res.status(500).send({message: err.errors}))
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateProfile,
    updateAvatar
};
