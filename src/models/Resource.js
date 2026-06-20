const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['ambulance', 'fire_truck', 'police_vehicle', 'helicopter', 'rescue_boat', 'medical_team', 'rescue_team', 'other'],
    },
    status: {
      type: String,
      enum: ['available', 'deployed', 'maintenance', 'out_of_service'],
      default: 'available',
    },
    agency: {
      type: String,
      required: [true, 'Agency name is required'],
    },
    currentLocation: {
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    assignedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
