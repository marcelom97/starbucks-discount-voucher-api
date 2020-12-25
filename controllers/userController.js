const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/** @module  UserController */

/**
 * @name        module:UserController#createNewUser
 * @function    createNewUser
 * @description Creates New User
 * @path        {POST} /api/v1/user
 */
const createNewUser = asyncHandler(async (req, res, next) => {
  /* eslint-disable-next-line */
  const { username, email, password, firstname, lastname } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    firstname,
    lastname,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @name        module:RoomController#getAllUsers
 * @function    getAllUsers
 * @description Get all users with advanced results
 * @path        {GET} /api/v1/user
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  const { query } = req;

  if (!users) {
    return next(new ErrorResponse('List of Users not found', 404));
  }

  if (Object.keys(query).length === 0 && query.constructor === Object) {
    return res.status(200).json({ users });
  }

  res.status(200).json(res.advancedResults);
});

/**
 * @name        module:UserController#getUserById
 * @function    getUserById
 * @description Get specific user
 * @path        {GET} /api/v1/user/:id
 */
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @name        module:UserController#updateUserById
 * @function    updateUserById
 * @description Update specific user details by his id
 * @path        {PUT} /api/v1/user/:id
 */
const updateUserById = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @name        module:UserController#deleteUserById
 * @function    deleteUserById
 * @description Delete specific user by his id
 * @path        {PUT} /api/v1/user/:id
 */
const deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createNewUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
};
