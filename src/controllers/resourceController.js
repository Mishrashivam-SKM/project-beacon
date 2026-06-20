const resourceService = require('../services/resourceService');

/**
 * @desc    Get all resources
 * @route   GET /api/resources
 */
const getResources = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
      agency: req.query.agency,
    };
    const resources = await resourceService.getAllResources(filters);
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single resource
 * @route   GET /api/resources/:id
 */
const getResource = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new resource
 * @route   POST /api/resources
 */
const createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update resource
 * @route   PUT /api/resources/:id
 */
const updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete resource
 * @route   DELETE /api/resources/:id
 */
const deleteResource = async (req, res, next) => {
  try {
    const result = await resourceService.deleteResource(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get resource statistics
 * @route   GET /api/resources/stats
 */
const getResourceStats = async (req, res, next) => {
  try {
    const stats = await resourceService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getResourceStats,
};
