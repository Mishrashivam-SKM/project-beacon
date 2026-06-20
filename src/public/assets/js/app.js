/* app.js — Main application controller */

/* ══════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════ */
const state = {
  incidents: [],
  resources: [],
  currentView: 'dashboard',
  editingIncidentId: null,
  editingResourceId: null,
};

/* ══════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════ */
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const view = document.getElementById(`view-${viewId}`);
  const link = document.getElementById(`nav-${viewId}`);
  if (view) view.classList.add('active');
  if (link) link.classList.add('active');

  state.currentView = viewId;

  const titles = {
    dashboard: ['Dashboard', 'Real-time overview'],
    incidents: ['Incident Management', 'All reported incidents'],
    resources: ['Resource Management', 'Units & personnel'],
  };
  const [title, sub] = titles[viewId] || ['', ''];
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-breadcrumb').textContent = sub;

  if (viewId === 'incidents') loadIncidents();
  if (viewId === 'resources') loadResources();
}

/* ══════════════════════════════════════════════════════
   CLOCK
   ══════════════════════════════════════════════════════ */
function startClock() {
  function tick() {
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).replace(',', ' |');
    const el = document.getElementById('banner-clock');
    if (el) el.textContent = formatted + ' IST';
  }
  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════
   SYSTEM STATUS
   ══════════════════════════════════════════════════════ */
async function checkSystemStatus() {
  const online = await API.healthCheck();
  const pill = document.getElementById('system-status-pill');
  const text = document.getElementById('system-status-text');
  if (!pill) return;

  if (online) {
    pill.className = 'system-status-pill online';
    text.textContent = 'All Systems Operational';
  } else {
    pill.className = 'system-status-pill offline';
    text.textContent = 'API Unreachable';
  }
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════ */
async function loadDashboard() {
  const [iRes, rRes] = await Promise.all([API.getIncidents(), API.getResources()]);

  const incidents = iRes.data || [];
  const resources = rRes.data || [];
  state.incidents = incidents;
  state.resources = resources;

  // Stats
  const active = incidents.filter(i => !['resolved', 'closed'].includes(i.status));
  const critical = incidents.filter(i => i.severity === 'critical');
  const availableRes = resources.filter(r => r.status === 'available');

  document.getElementById('stat-total').textContent = incidents.length;
  document.getElementById('stat-active').textContent = active.length;
  document.getElementById('stat-critical').textContent = critical.length;
  document.getElementById('stat-resources').textContent = availableRes.length;

  // Critical alert strip
  UI.setCriticalAlert(critical.length > 0);

  // Recent incidents table (last 5)
  renderIncidentTable('recent-incidents-body', incidents.slice(0, 5), true);
}

/* ══════════════════════════════════════════════════════
   INCIDENTS
   ══════════════════════════════════════════════════════ */
async function loadIncidents() {
  const filters = {
    status: document.getElementById('filter-status')?.value,
    severity: document.getElementById('filter-severity')?.value,
    type: document.getElementById('filter-type')?.value,
  };
  const res = await API.getIncidents(filters);
  state.incidents = res.data || [];
  renderIncidentTable('incidents-body', state.incidents, false);
}

function renderIncidentTable(tbodyId, incidents, compact) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!incidents.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${compact ? 7 : 8}">No incidents found</td></tr>`;
    return;
  }

  tbody.innerHTML = incidents.map(inc => `
    <tr>
      <td>
        <span style="font-size:14px;margin-right:6px">${UI.typeIcon(inc.type)}</span>
        <strong>${inc.title}</strong>
      </td>
      <td style="text-transform:capitalize">${inc.type}</td>
      <td>${UI.severityBadge(inc.severity)}</td>
      <td>${UI.statusBadge(inc.status)}</td>
      <td style="color:var(--text-secondary)">${inc.location?.address || '—'}</td>
      ${!compact ? `<td style="color:var(--text-muted);font-size:11px">${(inc.assignedAgencies || []).join(', ') || '—'}</td>` : ''}
      <td style="color:var(--text-muted);font-size:11px">${UI.formatDate(inc.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-ghost btn-sm" title="Edit" onclick="editIncident('${inc._id}')">✏</button>
          <button class="btn btn-ghost btn-sm text-danger" title="Delete" onclick="deleteIncident('${inc._id}')">✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ══════════════════════════════════════════════════════
   RESOURCES
   ══════════════════════════════════════════════════════ */
async function loadResources() {
  const filters = {
    status: document.getElementById('filter-resource-status')?.value,
    type:   document.getElementById('filter-resource-type')?.value,
  };
  const res = await API.getResources(filters);
  state.resources = res.data || [];
  renderResourceCards(state.resources);
}

function renderResourceCards(resources) {
  const grid = document.getElementById('resources-grid');
  if (!grid) return;

  if (!resources.length) {
    grid.innerHTML = `<div class="empty-state">No resources registered</div>`;
    return;
  }

  grid.innerHTML = resources.map(r => `
    <div class="resource-card">
      <div class="resource-card-header">
        <div>
          <div class="resource-name">${UI.resourceIcon(r.type)} ${r.name}</div>
          <div class="resource-agency">${r.agency || '—'}</div>
        </div>
        ${UI.resourceStatusBadge(r.status)}
      </div>
      <div class="resource-footer">
        <span style="font-size:11px;color:var(--text-muted);text-transform:capitalize">${(r.type || '').replace(/_/g, ' ')}</span>
        <div class="resource-actions">
          <button class="btn btn-ghost btn-sm" title="Edit" onclick="editResource('${r._id}')">✏</button>
          <button class="btn btn-ghost btn-sm text-danger" title="Delete" onclick="deleteResource('${r._id}')">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════
   MODALS
   ══════════════════════════════════════════════════════ */
function openModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) modal.classList.add('active');
}

function closeModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) { modal.classList.remove('active'); resetForms(type); }
}

function resetForms(type) {
  if (type === 'incident') {
    document.getElementById('incident-form')?.reset();
    document.getElementById('incident-edit-id').value = '';
    document.getElementById('incident-modal-title').textContent = 'Report New Incident';
    document.getElementById('incident-submit-btn').textContent = 'Submit Report';
    state.editingIncidentId = null;
  }
  if (type === 'resource') {
    document.getElementById('resource-form')?.reset();
    document.getElementById('resource-edit-id').value = '';
    document.getElementById('resource-modal-title').textContent = 'Register New Resource';
    document.getElementById('resource-submit-btn').textContent = 'Register Resource';
    state.editingResourceId = null;
  }
}

/* ── Incident form submit ── */
async function handleIncidentSubmit(e) {
  e.preventDefault();
  const id = state.editingIncidentId;
  const agencies = [...document.querySelectorAll('input[name="agencies"]:checked')].map(c => c.value);

  const payload = {
    title: document.getElementById('incident-title').value.trim(),
    type: document.getElementById('incident-type').value,
    severity: document.getElementById('incident-severity').value,
    location: { address: document.getElementById('incident-location').value.trim() },
    description: document.getElementById('incident-description').value.trim(),
    assignedAgencies: agencies,
  };

  const btn = document.getElementById('incident-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    const res = id
      ? await API.updateIncident(id, payload)
      : await API.createIncident(payload);

    if (res.success) {
      UI.toast(id ? 'Incident updated.' : 'Incident reported.', 'success');
      closeModal('incident');
      loadDashboard();
      if (state.currentView === 'incidents') loadIncidents();
    } else {
      UI.toast(res.message || 'An error occurred.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Save Changes' : 'Submit Report';
  }
}

/* ── Resource form submit ── */
async function handleResourceSubmit(e) {
  e.preventDefault();
  const id = state.editingResourceId;

  const payload = {
    name: document.getElementById('resource-name').value.trim(),
    type: document.getElementById('resource-type').value,
    status: document.getElementById('resource-status').value,
    agency: document.getElementById('resource-agency').value.trim(),
  };

  const btn = document.getElementById('resource-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    const res = id
      ? await API.updateResource(id, payload)
      : await API.createResource(payload);

    if (res.success) {
      UI.toast(id ? 'Resource updated.' : 'Resource registered.', 'success');
      closeModal('resource');
      loadDashboard();
      if (state.currentView === 'resources') loadResources();
    } else {
      UI.toast(res.message || 'An error occurred.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Save Changes' : 'Register Resource';
  }
}

/* ── Edit ── */
function editIncident(id) {
  const inc = state.incidents.find(i => i._id === id);
  if (!inc) return;
  state.editingIncidentId = id;
  document.getElementById('incident-edit-id').value = id;
  document.getElementById('incident-modal-title').textContent = 'Edit Incident';
  document.getElementById('incident-submit-btn').textContent = 'Save Changes';
  document.getElementById('incident-title').value = inc.title;
  document.getElementById('incident-type').value = inc.type;
  document.getElementById('incident-severity').value = inc.severity;
  document.getElementById('incident-location').value = inc.location?.address || '';
  document.getElementById('incident-description').value = inc.description || '';
  (inc.assignedAgencies || []).forEach(a => {
    const cb = document.querySelector(`input[name="agencies"][value="${a}"]`);
    if (cb) cb.checked = true;
  });
  openModal('incident');
}

function editResource(id) {
  const r = state.resources.find(r => r._id === id);
  if (!r) return;
  state.editingResourceId = id;
  document.getElementById('resource-edit-id').value = id;
  document.getElementById('resource-modal-title').textContent = 'Edit Resource';
  document.getElementById('resource-submit-btn').textContent = 'Save Changes';
  document.getElementById('resource-name').value = r.name;
  document.getElementById('resource-type').value = r.type;
  document.getElementById('resource-status').value = r.status;
  document.getElementById('resource-agency').value = r.agency || '';
  openModal('resource');
}

/* ── Delete ── */
async function deleteIncident(id) {
  if (!confirm('Delete this incident record? This action cannot be undone.')) return;
  const res = await API.deleteIncident(id);
  if (res.success) {
    UI.toast('Incident deleted.', 'info');
    loadDashboard();
    if (state.currentView === 'incidents') loadIncidents();
  } else {
    UI.toast('Delete failed.', 'error');
  }
}

async function deleteResource(id) {
  if (!confirm('Remove this resource? This action cannot be undone.')) return;
  const res = await API.deleteResource(id);
  if (res.success) {
    UI.toast('Resource removed.', 'info');
    loadDashboard();
    if (state.currentView === 'resources') loadResources();
  } else {
    UI.toast('Delete failed.', 'error');
  }
}

/* ══════════════════════════════════════════════════════
   KEYBOARD & ACCESSIBILITY
   ══════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('incident');
    closeModal('resource');
  }
});

// Close modal on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      const type = overlay.id.replace('-modal', '');
      closeModal(type);
    }
  });
});

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  checkSystemStatus();
  loadDashboard();
  setInterval(loadDashboard, 30000); // auto-refresh every 30s
  setInterval(checkSystemStatus, 15000);
});
