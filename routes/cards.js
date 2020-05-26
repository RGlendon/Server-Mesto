const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { addLike, removeLike } = require('../controllers/cards');


router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);


router.use('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}));

router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
