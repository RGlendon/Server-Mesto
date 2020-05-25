const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { addLike, removeLike } = require('../controllers/cards');


const validateId = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    res.status(400).send({ message: 'некорректное Id карточки' });
    return;
  }

  next();
};

router.get('/', getCards);
router.post('/', createCard);
// router.delete('/:cardId', validateId);
router.delete('/:cardId', deleteCard);

// router.put('/:cardId/likes', validateId);
router.put('/:cardId/likes', addLike);
// router.delete('/:cardId/likes', validateId);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
