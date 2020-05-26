const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const Unauthorized = require('../errors/unauthorized');


const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};


const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({
    name,
    link,
    owner: id,
  })
    .then((card) => res.send({ data: card }))
    .catch(next);
};


const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      // если не привести к строке то card.owner это набор чисел в буфере
      if (card.owner.toString() !== req.user._id) {
        throw new Unauthorized('Вы можете удалять только свои карточки');
      }
      res.send({ data: card });
      card.remove();
    })
    .catch(next);
};


const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};


const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};


module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
