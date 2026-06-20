const incidentService = require('../services/incidentService');

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 */
const getIncidents = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      severity: req.query.severity,
      type: req.query.type,
    };
    const incidents = await incidentService.getAllIncidents(filters);
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single incident
 * @route   GET /api/incidents/:id
 */
const getIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.getIncidentById(req.params.id);
    res.json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new incident
 * @route   POST /api/incidents
 */
const createIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.createIncident(req.body);
    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update incident
 * @route   PUT /api/incidents/:id
 */
const updateIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.updateIncident(req.params.id, req.body);
    res.json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete incident
 * @route   DELETE /api/incidents/:id
 */
const deleteIncident = async (req, res, next) => {
  try {
    const result = await incidentService.deleteIncident(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get incident statistics
 * @route   GET /api/incidents/stats
 */
const getIncidentStats = async (req, res, next) => {
  try {
    const stats = await incidentService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats,
};
