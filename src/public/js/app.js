/* ═══════════════════════════════════════════════════════
   PROJECT BEACON — Frontend Application Logic
   Handles API communication, UI updates, and user interactions
   ═══════════════════════════════════════════════════════ */

const API_BASE = '/api';

// ── Navigation ──
function switchView(viewName) {
  // Update views
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`view-${viewName}`).classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

  // Update page title
  const titles = {
    dashboard: ['Dashboard', 'Real-time emergency overview'],
    incidents: ['Incidents', 'Manage emergency incidents'],
    resources: ['Resources', 'Track emergency resources'],
  };

  document.getElementById('page-title').textContent = titles[viewName][0];
  document.getElementById('page-subtitle').textContent = titles[viewName][1];

  // Reload data for the view
  if (viewName === 'dashboard') loadDashboard();
  if (viewName === 'incidents') loadIncidents();
  if (viewName === 'resources') loadResources();
}

// Set up nav click handlers
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    switchView(item.dataset.view);
  });
});

// ── Clock ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
setInterval(updateClock, 1000);
updateClock();

// ═══════════════════════════════════════════
// API HELPER
// ═══════════════════════════════════════════
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'API request failed');
    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    showToast(error.message, 'error');
    throw error;
  }
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
async function loadDashboard() {
  try {
    const [incidentRes, resourceRes, incidentStats, resourceStats] = await Promise.all([
      apiRequest('/incidents'),
      apiRequest('/resources'),
      apiRequest('/incidents/stats'),
      apiRequest('/resources/stats'),
    ]);

    const incidents = incidentRes.data;
    const resources = resourceRes.data;
    const iStats = incidentStats.data;
    const rStats = resourceStats.data;

    // Update stat cards
    document.getElementById('total-incidents').textContent = iStats.total;

    const activeCount = iStats.byStatus
      .filter((s) => ['reported', 'acknowledged', 'responding'].includes(s._id))
      .reduce((sum, s) => sum + s.count, 0);
    document.getElementById('active-incidents').textContent = activeCount;

    const criticalCount = iStats.bySeverity.find((s) => s._id === 'critical');
    document.getElementById('critical-incidents').textContent = criticalCount ? criticalCount.count : 0;

    const availableCount = rStats.byStatus.find((s) => s._id === 'available');
    document.getElementById('available-resources').textContent = availableCount ? availableCount.count : 0;

    // Populate recent incidents table (last 5)
    const recentBody = document.getElementById('recent-incidents-body');
    if (incidents.length === 0) {
      recentBody.innerHTML = '<tr class="empty-row"><td colspan="7">No incidents reported yet</td></tr>';
    } else {
      recentBody.innerHTML = incidents.slice(0, 5).map((inc) => createIncidentRow(inc)).join('');
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

// ═══════════════════════════════════════════
// INCIDENTS
// ═══════════════════════════════════════════
async function loadIncidents() {
  try {
    const status = document.getElementById('filter-status').value;
    const severity = document.getElementById('filter-severity').value;
    const type = document.getElementById('filter-type').value;

    let query = '/incidents?';
    if (status) query += `status=${status}&`;
    if (severity) query += `severity=${severity}&`;
    if (type) query += `type=${type}&`;

    const res = await apiRequest(query);
    const tbody = document.getElementById('incidents-body');

    if (res.data.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No incidents found</td></tr>';
    } else {
      tbody.innerHTML = res.data.map((inc) => createIncidentRow(inc, true)).join('');
    }
  } catch (error) {
    console.error('Failed to load incidents:', error);
  }
}

function createIncidentRow(inc, showAgencies = false) {
  const typeIcons = {
    fire: '🔥', flood: '🌊', earthquake: '🏚️', accident: '💥',
    medical: '🏥', hazmat: '☣️', rescue: '🆘', other: '📌',
  };

  const timeAgo = getTimeAgo(new Date(inc.createdAt));
  const agenciesCol = showAgencies
    ? `<td>${(inc.assignedAgencies || []).map((a) => `<span class="badge badge-${a}">${a.replace('_', ' ')}</span>`).join(' ') || '—'}</td>`
    : '';

  return `
    <tr>
      <td><strong>${escapeHtml(inc.title)}</strong></td>
      <td>${typeIcons[inc.type] || '📌'} ${inc.type}</td>
      <td><span class="badge badge-${inc.severity}">${inc.severity}</span></td>
      <td><span class="badge badge-${inc.status}">${inc.status}</span></td>
      <td>${escapeHtml(inc.location?.address || '—')}</td>
      ${agenciesCol}
      <td>${timeAgo}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" onclick="editIncident('${inc._id}')" title="Edit">✏️</button>
          <button class="btn-icon danger" onclick="deleteIncident('${inc._id}')" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>
  `;
}

async function editIncident(id) {
  try {
    const res = await apiRequest(`/incidents/${id}`);
    const inc = res.data;

    document.getElementById('incident-modal-title').textContent = 'Edit Incident';
    document.getElementById('incident-submit-btn').textContent = 'Update Incident';
    document.getElementById('incident-edit-id').value = id;

    document.getElementById('incident-title').value = inc.title;
    document.getElementById('incident-type').value = inc.type;
    document.getElementById('incident-severity').value = inc.severity;
    document.getElementById('incident-location').value = inc.location?.address || '';
    document.getElementById('incident-description').value = inc.description;

    // Check assigned agencies
    document.querySelectorAll('#incident-form input[name="agencies"]').forEach((cb) => {
      cb.checked = (inc.assignedAgencies || []).includes(cb.value);
    });

    openModal('incident');
  } catch (error) {
    console.error('Failed to load incident for editing:', error);
  }
}

async function deleteIncident(id) {
  if (!confirm('Are you sure you want to delete this incident?')) return;

  try {
    await apiRequest(`/incidents/${id}`, 'DELETE');
    showToast('Incident deleted successfully', 'success');
    loadDashboard();
    loadIncidents();
  } catch (error) {
    console.error('Failed to delete incident:', error);
  }
}

async function handleIncidentSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('incident-edit-id').value;
  const agencies = [];
  document.querySelectorAll('#incident-form input[name="agencies"]:checked').forEach((cb) => {
    agencies.push(cb.value);
  });

  const body = {
    title: document.getElementById('incident-title').value,
    type: document.getElementById('incident-type').value,
    severity: document.getElementById('incident-severity').value,
    location: { address: document.getElementById('incident-location').value },
    description: document.getElementById('incident-description').value,
    assignedAgencies: agencies,
  };

  try {
    if (editId) {
      await apiRequest(`/incidents/${editId}`, 'PUT', body);
      showToast('Incident updated successfully', 'success');
    } else {
      await apiRequest('/incidents', 'POST', body);
      showToast('Incident reported successfully', 'success');
    }

    closeModal('incident');
    loadDashboard();
    loadIncidents();
  } catch (error) {
    console.error('Failed to save incident:', error);
  }
}

// ═══════════════════════════════════════════
// RESOURCES
// ═══════════════════════════════════════════
async function loadResources() {
  try {
    const status = document.getElementById('filter-resource-status').value;
    const type = document.getElementById('filter-resource-type').value;

    let query = '/resources?';
    if (status) query += `status=${status}&`;
    if (type) query += `type=${type}&`;

    const res = await apiRequest(query);
    const grid = document.getElementById('resources-grid');

    if (res.data.length === 0) {
      grid.innerHTML = '<div class="empty-state"><span class="empty-icon">🚑</span><p>No resources registered yet</p></div>';
    } else {
      grid.innerHTML = res.data.map(createResourceCard).join('');
    }
  } catch (error) {
    console.error('Failed to load resources:', error);
  }
}

function createResourceCard(resource) {
  const typeIcons = {
    ambulance: '🚑', fire_truck: '🚒', police_vehicle: '🚔', helicopter: '🚁',
    rescue_boat: '🚤', medical_team: '👨‍⚕️', rescue_team: '🦺', other: '📌',
  };

  return `
    <div class="resource-card">
      <div class="resource-card-header">
        <div class="resource-type-icon">${typeIcons[resource.type] || '📌'}</div>
        <span class="badge badge-${resource.status}">${resource.status.replace('_', ' ')}</span>
      </div>
      <div class="resource-name">${escapeHtml(resource.name)}</div>
      <div class="resource-agency">${escapeHtml(resource.agency)}</div>
      <div class="resource-meta">
        <span style="font-size:11px;color:var(--text-muted)">${resource.type.replace('_', ' ')}</span>
        <div class="resource-actions">
          <button class="btn-icon" onclick="editResource('${resource._id}')" title="Edit">✏️</button>
          <button class="btn-icon danger" onclick="deleteResource('${resource._id}')" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

async function editResource(id) {
  try {
    const res = await apiRequest(`/resources/${id}`);
    const r = res.data;

    document.getElementById('resource-modal-title').textContent = 'Edit Resource';
    document.getElementById('resource-submit-btn').textContent = 'Update Resource';
    document.getElementById('resource-edit-id').value = id;

    document.getElementById('resource-name').value = r.name;
    document.getElementById('resource-type').value = r.type;
    document.getElementById('resource-status').value = r.status;
    document.getElementById('resource-agency').value = r.agency;

    openModal('resource');
  } catch (error) {
    console.error('Failed to load resource for editing:', error);
  }
}

async function deleteResource(id) {
  if (!confirm('Are you sure you want to delete this resource?')) return;

  try {
    await apiRequest(`/resources/${id}`, 'DELETE');
    showToast('Resource deleted successfully', 'success');
    loadResources();
    loadDashboard();
  } catch (error) {
    console.error('Failed to delete resource:', error);
  }
}

async function handleResourceSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('resource-edit-id').value;
  const body = {
    name: document.getElementById('resource-name').value,
    type: document.getElementById('resource-type').value,
    status: document.getElementById('resource-status').value,
    agency: document.getElementById('resource-agency').value,
  };

  try {
    if (editId) {
      await apiRequest(`/resources/${editId}`, 'PUT', body);
      showToast('Resource updated successfully', 'success');
    } else {
      await apiRequest('/resources', 'POST', body);
      showToast('Resource added successfully', 'success');
    }

    closeModal('resource');
    loadResources();
    loadDashboard();
  } catch (error) {
    console.error('Failed to save resource:', error);
  }
}

// ═══════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════
function openModal(type) {
  document.getElementById(`${type}-modal`).classList.add('active');
}

function closeModal(type) {
  document.getElementById(`${type}-modal`).classList.remove('active');

  // Reset form
  document.getElementById(`${type}-form`).reset();
  document.getElementById(`${type}-edit-id`).value = '';

  // Reset modal title
  if (type === 'incident') {
    document.getElementById('incident-modal-title').textContent = 'Report New Incident';
    document.getElementById('incident-submit-btn').textContent = 'Report Incident';
  } else {
    document.getElementById('resource-modal-title').textContent = 'Register New Resource';
    document.getElementById('resource-submit-btn').textContent = 'Add Resource';
  }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      const type = overlay.id.replace('-modal', '');
      closeModal(type);
    }
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach((m) => {
      const type = m.id.replace('-modal', '');
      closeModal(type);
    });
  }
});

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ═══════════════════════════════════════════
// SYSTEM STATUS CHECK
// ═══════════════════════════════════════════
async function checkSystemStatus() {
  try {
    await apiRequest('/health');
    document.getElementById('status-dot').classList.remove('offline');
    document.getElementById('status-dot').classList.add('online');
    document.getElementById('status-text').textContent = 'System Online';
  } catch {
    document.getElementById('status-dot').classList.remove('online');
    document.getElementById('status-dot').classList.add('offline');
    document.getElementById('status-text').textContent = 'System Offline';
  }
}

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  checkSystemStatus();

  // Auto-refresh every 30 seconds
  setInterval(() => {
    const activeView = document.querySelector('.view.active');
    if (activeView.id === 'view-dashboard') loadDashboard();
    if (activeView.id === 'view-incidents') loadIncidents();
    if (activeView.id === 'view-resources') loadResources();
    checkSystemStatus();
  }, 30000);
});
