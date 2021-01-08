const express = require('express');

const {
  createNewUnemployed,
  getAllUnemployed,
  deleteUnemployedById,
  getUnemployedById,
  updateUnemployedById,
} = require('../controllers/unemployedController');

const { protectRoute, authorizedUser } = require('../middlewares/authHandler');

const router = express.Router();

router.route('/').get(getAllUnemployed).post(createNewUnemployed);

router
  .route('/:id')
  .get(protectRoute, authorizedUser('admin'), getUnemployedById)
  .put(protectRoute, authorizedUser('admin'), updateUnemployedById)
  .delete(protectRoute, authorizedUser('admin'), deleteUnemployedById);

module.exports = router;
