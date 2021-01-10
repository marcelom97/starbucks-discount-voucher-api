const express = require('express');

const {
  createNewUnemployed,
  getAllUnemployed,
  deleteUnemployedById,
  getUnemployedById,
  updateUnemployedById,
} = require('../controllers/unemployedController');

const { protectRoute, authorizedUser } = require('../middlewares/authHandler');

const Unemployed = require('../models/Unemployed');

const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

router.route('/').get(advancedResults(Unemployed), getAllUnemployed).post(createNewUnemployed);

router
  .route('/:id')
  .get(protectRoute, authorizedUser('admin'), getUnemployedById)
  .put(protectRoute, authorizedUser('admin'), updateUnemployedById)
  .delete(protectRoute, authorizedUser('admin'), deleteUnemployedById);

module.exports = router;
