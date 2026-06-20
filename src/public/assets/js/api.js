/* api.js — All HTTP calls to the backend REST API */

const API = {
  /* ── Incidents ── */
  async getIncidents(filters = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    const res = await fetch(`/api/incidents?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async createIncident(data) {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateIncident(id, data) {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteIncident(id) {
    const res = await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
    return res.json();
  },

  /* ── Resources ── */
  async getResources(filters = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    const res = await fetch(`/api/resources?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async createResource(data) {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateResource(id, data) {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteResource(id) {
    const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    return res.json();
  },

  /* ── Health ── */
  async health() {
    try {
      const res = await fetch('/api/health');
      return res.ok;
    } catch {
      return false;
    }
  },
};
