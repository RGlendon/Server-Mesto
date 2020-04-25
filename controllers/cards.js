const Card = require('../models/card');


const getCards = (req, res) => {
    Card.find({})
        .then(cards => res.send({data: cards}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const createCard = (req, res) => {
    const {name, link} = req.body;
    const id = req.user._id;

    Card.create({name, link, owner: id})
        .then(card => res.send({data: card}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const deleteCard = (req, res) => {
    Card.findByIdAndRemove(req.params.cardId)
        .then(card => res.send({data: card}))
        .catch(err => res.status(500).send({message: err.errors}))
};


const addLike = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        {$addToSet: {likes: req.user._id}},
        {new: true}
    )
        .then(card => res.send({data: card}))
        .catch(err => res.status(500).send({message: err.errors}))
};

const removeLike = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        {$pull: {likes: req.user._id}},
        {new: true}
    )
        .then(card => res.send({data: card}))
        .catch(err => res.status(500).send({message: err.errors}))
};


module.exports = {
    getCards,
    createCard,
    deleteCard,
    addLike,
    removeLike
};
