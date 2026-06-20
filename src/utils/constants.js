// Incident types supported by the platform
const INCIDENT_TYPES = [
  'fire',
  'flood',
  'earthquake',
  'accident',
  'medical',
  'hazmat',
  'rescue',
  'other',
];

// Severity levels (ordered)
const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

// Incident status workflow
const INCIDENT_STATUSES = ['reported', 'acknowledged', 'responding', 'resolved', 'closed'];

// Resource types
const RESOURCE_TYPES = [
  'ambulance',
  'fire_truck',
  'police_vehicle',
  'helicopter',
  'rescue_boat',
  'medical_team',
  'rescue_team',
  'other',
];

// Resource statuses
const RESOURCE_STATUSES = ['available', 'deployed', 'maintenance', 'out_of_service'];

// Agency types
const AGENCY_TYPES = ['hospital', 'police', 'fire_service', 'rescue_team', 'government'];

module.exports = {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  INCIDENT_STATUSES,
  RESOURCE_TYPES,
  RESOURCE_STATUSES,
  AGENCY_TYPES,
};
