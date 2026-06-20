/* api.js — All HTTP calls to the backend API */

const BASE_URL = '';

const API = {
  /* ── Incidents ── */
  async getIncidents(filters = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    const res = await fetch(`${BASE_URL}/api/incidents?${params}`);
    return res.json();
  },

  async createIncident(data) {
    const res = await fetch(`${BASE_URL}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateIncident(id, data) {
    const res = await fetch(`${BASE_URL}/api/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteIncident(id) {
    const res = await fetch(`${BASE_URL}/api/incidents/${id}`, { method: 'DELETE' });
    return res.json();
  },

  /* ── Resources ── */
  async getResources(filters = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    const res = await fetch(`${BASE_URL}/api/resources?${params}`);
    return res.json();
  },

  async createResource(data) {
    const res = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateResource(id, data) {
    const res = await fetch(`${BASE_URL}/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteResource(id) {
    const res = await fetch(`${BASE_URL}/api/resources/${id}`, { method: 'DELETE' });
    return res.json();
  },

  /* ── Health ── */
  async healthCheck() {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};
