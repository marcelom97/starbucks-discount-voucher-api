const express = require('express');

const router = express.Router();

const { getDiscountVoucherPdf } = require('../controllers/voucherController');

router.route('/:id').post(getDiscountVoucherPdf);

module.exports = router;
