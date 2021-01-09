const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');
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
    return res.status(404).json({
      success: false,
      message: `Unemployed applications with id ${id} not fount`,
    });
  }

  QRCode.toDataURL(JSON.stringify(unemployed), (err, url) => {
    if (err) {
      return res.status(404).json({
        success: false,
        message: `unable to create voucher with id ${req.params.id}`,
      });
    }
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(`./public/pdfs/${req.params.id}.pdf`));
    pdfDoc.image(url, {
      fit: [250, 300],
      align: 'center',
      valign: 'center',
    });
    pdfDoc.end();
  });

  return res.status(200).json({
    success: true,
    path: `${process.env.HOST}/public/pdfs/${req.params.id}.pdf`,
  });
});

module.exports = { getDiscountVoucherPdf };
