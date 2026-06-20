const Incident = require('../models/Incident');

class IncidentService {
  /**
   * Get all incidents with optional filters
   */
  async getAllIncidents(filters = {}) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;
    if (filters.type) query.type = filters.type;

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedResources');

    return incidents;
  }

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id) {
    const incident = await Incident.findById(id).populate('assignedResources');
    if (!incident) {
      const error = new Error('Incident not found');
      error.statusCode = 404;
      throw error;
    }
    return incident;
  }

  /**
   * Create a new incident
   */
  async createIncident(data) {
    const incident = new Incident(data);
    await incident.save();
    return incident;
  }

  /**
   * Update an existing incident
   */
  async updateIncident(id, data) {
    // If status is being set to 'resolved', record the timestamp
    if (data.status === 'resolved') {
      data.resolvedAt = new Date();
    }

    const incident = await Incident.findByIdAndUpdate(id, data, {
      new: true, // Return the updated document
      runValidators: true, // Validate against schema
    });

    if (!incident) {
      const error = new Error('Incident not found');
      error.statusCode = 404;
      throw error;
    }

    return incident;
  }

  /**
   * Delete an incident
   */
  async deleteIncident(id) {
    const incident = await Incident.findByIdAndDelete(id);
    if (!incident) {
      const error = new Error('Incident not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Incident deleted successfully' };
  }

  /**
   * Get incident statistics for the dashboard
   */
  async getStats() {
    const total = await Incident.countDocuments();
    const byStatus = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const bySeverity = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);
    const byType = await Incident.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    return { total, byStatus, bySeverity, byType };
  }
}

module.exports = new IncidentService();
