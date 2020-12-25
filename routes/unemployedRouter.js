const express = require('express');

const {
  createNewUnemployed,
  getAllUnemployed,
  deleteUnemployedById,
  getUnemployedById,
  updateUnemployedById,
} = require('../controllers/unemployedController');

const Unemployed = require('../models/Unemployed');

const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

router.route('/').get(advancedResults(Unemployed), getAllUnemployed).post(createNewUnemployed);
router.route('/:id').get(getUnemployedById).put(updateUnemployedById).delete(deleteUnemployedById);

module.exports = router;
