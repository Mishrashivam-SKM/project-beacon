const express = require('express');
const router = express.Router();
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getResourceStats,
} = require('../controllers/resourceController');

// Stats route must come BEFORE /:id
router.get('/stats', getResourceStats);

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResource)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
