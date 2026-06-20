const Resource = require('../models/Resource');

class ResourceService {
  /**
   * Get all resources with optional filters
   */
  async getAllResources(filters = {}) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.agency) query.agency = filters.agency;

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedIncident');

    return resources;
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(id) {
    const resource = await Resource.findById(id).populate('assignedIncident');
    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }
    return resource;
  }

  /**
   * Create a new resource
   */
  async createResource(data) {
    const resource = new Resource(data);
    await resource.save();
    return resource;
  }

  /**
   * Update an existing resource
   */
  async updateResource(id, data) {
    const resource = await Resource.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }

    return resource;
  }

  /**
   * Delete a resource
   */
  async deleteResource(id) {
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      const error = new Error('Resource not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Resource deleted successfully' };
  }

  /**
   * Get resource statistics for the dashboard
   */
  async getStats() {
    const total = await Resource.countDocuments();
    const byStatus = await Resource.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byType = await Resource.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    return { total, byStatus, byType };
  }
}

module.exports = new ResourceService();
