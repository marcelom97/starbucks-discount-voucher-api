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

const { protectRoute, authorizedUser } = require('../middlewares/authHandler');

const router = express.Router();

router
  .route('/')
  .get(protectRoute, authorizedUser('admin'), advancedResults(Unemployed), getAllUnemployed)
  .post(protectRoute, createNewUnemployed);
router
  .route('/:id')
  .get(getUnemployedById)
  .put(protectRoute, authorizedUser('admin'), updateUnemployedById)
  .delete(protectRoute, authorizedUser('admin'), deleteUnemployedById);

module.exports = router;
