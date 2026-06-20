const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats,
} = require('../controllers/incidentController');

// Stats route must come BEFORE /:id to avoid "stats" being treated as an ID
router.get('/stats', getIncidentStats);

router.route('/')
  .get(getIncidents)
  .post(createIncident);

router.route('/:id')
  .get(getIncident)
  .put(updateIncident)
  .delete(deleteIncident);

module.exports = router;
