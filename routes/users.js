const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');
const { updateProfile, updateAvatar } = require('../controllers/users');

const validateId = (req, res, next) => {
  if (req.params.userId.length !== 24) return res.status(400).send({ message: 'некорректное Id пользовтеля' });

  next();
};


router.get('/', getUsers);
router.get('/:userId', validateId);
router.get('/:userId', getUser);
router.post('/', createUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
