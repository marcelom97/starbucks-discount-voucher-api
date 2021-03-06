const express = require('express');

const router = express.Router();

const {
  createNewUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
} = require('../controllers/userController');

const User = require('../models/User');

const { protectRoute, authorizedUser } = require('../middlewares/authHandler');

const advancedResults = require('../middlewares/advancedResults');

router.use(protectRoute);
router.use(authorizedUser('admin'));

router.route('/').post(createNewUser).get(advancedResults(User), getAllUsers);

router.route('/:id').get(getUserById).delete(deleteUserById).put(updateUserById);

module.exports = router;
