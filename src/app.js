const express = require('express');
const cors = require('cors');
const path = require('path');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const incidentRoutes = require('./routes/incidentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();

// ────────────────────────────────────────────
// Core Middleware
// ────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests

// ────────────────────────────────────────────
// Serve Frontend (Static Files)
// ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────
app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);

// Health Check Endpoint (used by Kubernetes, Prometheus, Load Balancers)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Project Beacon API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ────────────────────────────────────────────
// Catch-all: Serve frontend for any non-API route
// ────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ────────────────────────────────────────────
// Error Handling (must be LAST middleware)
// ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
