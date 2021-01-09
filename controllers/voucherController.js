const asyncHandler = require('../utils/asyncHandler');
const Unemployed = require('../models/Unemployed');

/** @module  VoucherController */

/**
 * @name        module:VoucherController#getDiscountVoucherPdf
 * @function    getDiscountVoucherPdf
 * @description Generates a pdf with discount voucher and returns the public path of it.
 * @path        {POST} /api/v1/voucher
 */
const getDiscountVoucherPdf = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const unemployed = await Unemployed.findById(id);

  if (!unemployed) {
    res.status(404).json({
      success: false,
      message: `Unemployed applications with id ${id} not fount`,
    });
  }

  res.status(200).json({
    success: true,
    unemployed,
  });
});

module.exports = { getDiscountVoucherPdf };
