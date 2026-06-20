const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Incident title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: ['fire', 'flood', 'earthquake', 'accident', 'medical', 'hazmat', 'rescue', 'other'],
    },
    severity: {
      type: String,
      required: [true, 'Severity level is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'responding', 'resolved', 'closed'],
      default: 'reported',
    },
    location: {
      address: { type: String, required: [true, 'Location address is required'] },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    assignedAgencies: [
      {
        type: String,
        enum: ['hospital', 'police', 'fire_service', 'rescue_team', 'government'],
      },
    ],
    assignedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    reportedBy: {
      type: String,
      default: 'System',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Incident', incidentSchema);
