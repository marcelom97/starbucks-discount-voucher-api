const express = require('express');
const cleanCache = require('../middlewares/cleanCache');

const router = express.Router();

const {
  createNewUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
} = require('../controllers/userController');

const User = require('../models/User');

const advancedResults = require('../middlewares/advancedResults');

router.route('/').post(cleanCache, createNewUser).get(advancedResults(User), getAllUsers);

router.route('/:id').get(getUserById).delete(cleanCache, deleteUserById).put(cleanCache, updateUserById);

module.exports = router;
