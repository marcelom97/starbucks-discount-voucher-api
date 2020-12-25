const express = require('express');

const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
  forgotPassword,
  updatePassword,
  refreshAccessToken,
} = require('../controllers/authController');

const { protectRoute } = require('../middlewares/authHandler');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(protectRoute, logoutUser);
router.route('/currentuser').get(protectRoute, getCurrentUser);
router.route('/updatepassword').put(protectRoute, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
router.route('/refresh').post(refreshAccessToken);

module.exports = router;
