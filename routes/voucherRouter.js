const express = require('express');

const router = express.Router();

const {
  getDiscountVoucherPdf,
  activateVoucherPointsCalculation,
  rejectVoucherPointsCalculation,
} = require('../controllers/voucherController');

router.route('/activate').post(activateVoucherPointsCalculation);
router.route('/reject').post(rejectVoucherPointsCalculation);
router.route('/:id').post(getDiscountVoucherPdf);
module.exports = router;
