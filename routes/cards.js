const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { addLike, removeLike } = require('../controllers/cards');

// ругается, что необходимо return добавить, прописывать в исключениях?
const validateId = (req, res, next) => {
  if (req.params.cardId.length !== 24) return res.status(400).send({ message: 'некорректное Id карточки' });

  next();
};

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', validateId);
router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
