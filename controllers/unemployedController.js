const Unemployed = require('../models/Unemployed');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/** @module  UnemployedController */

/**
 * @name        module:UnemployedController#createNewUnemployed
 * @function    createNewUnemployed
 * @description Creates New Unemployed
 * @path        {POST} /api/v1/unemployed
 */
const createNewUnemployed = asyncHandler(async (req, res, next) => {
  const {
    firstname,
    lastname,
    birthdate,
    adt,
    fathersname,
    afm,
    amka,
    unemploymentNumber,
    unemploymentDuaDate,
  } = req.body;

  // eslint-disable-next-line
  let points = new Date(birthdate).getFullYear() + new Date(unemploymentDuaDate).getFullYear() - Date.now() * -1;
  points = (points % 100) + 50;

  if (birthdate > '1984-12-31') {
    const unemployed = await Unemployed.create({
      firstname,
      lastname,
      birthdate,
      adt,
      fathersname,
      afm,
      amka,
      unemploymentNumber,
      unemploymentDuaDate,
      points,
    });

    return res.status(201).json({
      success: true,
      data: unemployed,
    });
  }
  return res.status(400).json({
    success: false,
    message: "Your birthdate isn't valid.",
  });
});

/**
 * @name        module:UnemployedController#getAllUnemployed
 * @function    getAllUnemployed
 * @description Get all unemployeds with advanced results
 * @path        {GET} /api/v1/unemployed
 */
const getAllUnemployed = asyncHandler(async (req, res, next) => {
  const unemployeds = await Unemployed.find();
  const { query } = req;

  if (!unemployeds) {
    return next(new ErrorResponse('List of Unemployeds not found', 404));
  }

  if (Object.keys(query).length === 0 && query.constructor === Object) {
    return res.status(200).json({ unemployeds });
  }

  res.status(200).json(res.advancedResults);
});

/**
 * @name        module:UnemployedController#getUnemployedById
 * @function    getUnemployedById
 * @description Get specific unemployed
 * @path        {GET} /api/v1/unemployed/:id
 */
const getUnemployedById = asyncHandler(async (req, res, next) => {
  const unemployed = await Unemployed.findById(req.params.id);

  if (!unemployed) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: unemployed,
  });
});

/**
 * @name        module:UnemployedController#updateUnemployedById
 * @function    updateUnemployedById
 * @description Update specific unemployed details by his id
 * @path        {PUT} /api/v1/unemployed/:id
 */
const updateUnemployedById = asyncHandler(async (req, res, next) => {
  let unemployed = await Unemployed.findById(req.params.id);

  if (!unemployed) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  unemployed = await Unemployed.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: unemployed,
  });
});

/**
 * @name        module:UnemployedController#deleteUnemployedById
 * @function    deleteUnemployedById
 * @description Delete specific unemployed by his id
 * @path        {PUT} /api/v1/unemployed/:id
 */
const deleteUnemployedById = asyncHandler(async (req, res, next) => {
  const unemployed = await Unemployed.findById(req.params.id);

  if (!unemployed) {
    return next(new ErrorResponse(`Resource not found with the id of:${req.params.id}`, 404));
  }

  await Unemployed.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createNewUnemployed,
  getUnemployedById,
  getAllUnemployed,
  deleteUnemployedById,
  updateUnemployedById,
};
