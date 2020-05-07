const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');


const validateId = (req, res, next) => {
  if (req.params.userId.length !== 24) {
    res.status(400).send({ message: 'некорректное Id пользовтеля' });
    return;
  }

  next();
};


router.get('/', getUsers);
router.get('/:userId', validateId);
router.get('/:userId', getUser);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
