const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../services/sendConfirmationEmail');
const sendTokenResponse = require('../services/sendTokenResponse');

/** @module  AuthController */

/**
 * @name        module:AuthController#registerUser
 * @function    registerUser
 * @description Register new User
 * @path        {POST} /api/v1/auth/register
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  const usernameCheck = await User.find({ username });
  const emailCheck = await User.find({ email });

  const errors = [];

  if (usernameCheck !== 0) {
    errors.push({ username: true });
  }

  if (emailCheck !== 0) {
    errors.push({ email: true });
  }

  const user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
});

/**
 * @name        module:AuthController#loginUser
 * @function    loginUser
 * @description Login User
 * @path        {POST} /api/v1/auth/login
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and a password', 400));
  }

  // Check for User
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @name        module:AuthController#logoutUser
 * @function    logoutUser
 * @description Logout User / Clear cookie
 * @path        {GET} /api/v1/auth/logout
 * @auth
 */
const logoutUser = asyncHandler(async (req, res, next) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @name        module:AuthController#getCurrentUser
 * @function    getCurrentUser
 * @description Get current logged in User
 * @path        {GET} /api/v1/auth/currentuser
 * @auth
 */
const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @name        module:AuthController#forgotPassword
 * @function    forgotPassword
 * @description Forgot User Password
 * @path        {POST} /api/v1/auth/forgotpassword
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \nPlease follow the link to change your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent', resetToken });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @name        module:AuthController#resetPassword
 * @function    resetPassword
 * @description Reset User password
 * @route       {PUT} /api/v1/auth/resetpassword/:resettoken
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @name        module:AuthController#updatePassword
 * @function    updatePassword
 * @description Update User password
 * @path        {PUT} /api/v1/auth/updatepassword
 * @auth
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @name        module:AuthController#refreshAccessToken
 * @function    refreshAccessToken
 * @description Refresh Access and Refresh Token
 * @path        {POST} /api/v1/auth/refresh
 * @auth
 */
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(refreshDecoded.id);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  refreshAccessToken,
};
