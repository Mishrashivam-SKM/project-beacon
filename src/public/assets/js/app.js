/* app.js — Main application controller
   Wires together API calls, UI rendering, and DOM interaction.
   Fully aligned to backend REST API and Mongoose schema enums.
*/

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
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active');
    l.removeAttribute('aria-current');
  });

  document.getElementById(`view-${viewId}`)?.classList.add('active');

  const navLink = document.getElementById(`nav-${viewId}`);
  navLink?.classList.add('active');
  navLink?.setAttribute('aria-current', 'page');

  state.currentView = viewId;

  const meta = {
    dashboard: ['Dashboard', 'Real-time emergency overview'],
    incidents: ['Incident Management', 'All active and historical incidents'],
    resources: ['Resource Management', 'Units, personnel & equipment'],
  };

  const [title, sub] = meta[viewId] || ['', ''];
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-sub').textContent = sub;

  if (viewId === 'incidents') loadIncidents();
  if (viewId === 'resources') loadResources();
}

/* ══════════════════════════════════════════════════════
   LIVE CLOCK (IST)
   ══════════════════════════════════════════════════════ */
function startClock() {
  function tick() {
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Asia/Kolkata',
    }).replace(',', ' |') + ' IST';
    const el = document.getElementById('live-clock');
    if (el) el.textContent = formatted;
  }
  tick();
  setInterval(tick, 1000);
}

/* ══════════════════════════════════════════════════════
   API HEALTH CHECK
   ══════════════════════════════════════════════════════ */
async function checkHealth() {
  const online = await API.health();
  const pill = document.getElementById('api-status');
  const text = document.getElementById('api-status-text');
  if (!pill) return;
  if (online) {
    pill.className = 'api-status online';
    text.textContent = 'All Systems Operational';
  } else {
    pill.className = 'api-status offline';
    text.textContent = 'API Unreachable';
  }
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════ */
async function loadDashboard() {
  try {
    const [iRes, rRes] = await Promise.all([API.getIncidents(), API.getResources()]);

    state.incidents = iRes.data || [];
    state.resources = rRes.data || [];

    // Compute stats matching backend's status/severity enums
    const active   = state.incidents.filter(i => !['resolved', 'closed'].includes(i.status));
    const critical = state.incidents.filter(i => i.severity === 'critical');
    const avail    = state.resources.filter(r => r.status === 'available');

    document.getElementById('stat-total').textContent    = state.incidents.length;
    document.getElementById('stat-active').textContent   = active.length;
    document.getElementById('stat-critical').textContent = critical.length;
    document.getElementById('stat-resources').textContent = avail.length;

    // Critical alert strip
    const strip = document.getElementById('critical-strip');
    if (strip) strip.classList.toggle('visible', critical.length > 0);

    // Critical badge on nav
    const badge = document.getElementById('critical-badge');
    if (badge) {
      badge.style.display = critical.length > 0 ? 'inline' : 'none';
      badge.textContent = critical.length;
    }

    // Recent incidents table (latest 5)
    renderIncidentRows('recent-tbody', state.incidents.slice(0, 5), true);

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

/* ══════════════════════════════════════════════════════
   INCIDENTS
   ══════════════════════════════════════════════════════ */
async function loadIncidents() {
  try {
    const filters = {
      status:   document.getElementById('f-status')?.value,
      severity: document.getElementById('f-severity')?.value,
      type:     document.getElementById('f-type')?.value,
    };
    const res = await API.getIncidents(filters);
    state.incidents = res.data || [];
    renderIncidentRows('incidents-tbody', state.incidents, false);
  } catch (err) {
    console.error('Load incidents error:', err);
    UI.toast('Failed to load incidents.', 'error');
  }
}

function renderIncidentRows(tbodyId, incidents, compact) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!incidents.length) {
    const cols = compact ? 7 : 8;
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${cols}">No incidents found</td></tr>`;
    return;
  }

  tbody.innerHTML = incidents.map(inc => `
    <tr>
      <td>
        <span aria-hidden="true" style="margin-right:6px">${UI.typeIcon(inc.type)}</span>
        <strong>${inc.title}</strong>
      </td>
      <td>${UI.typeLabel(inc.type)}</td>
      <td>${UI.severity(inc.severity)}</td>
      <td>${UI.status(inc.status)}</td>
      <td style="color:var(--navy-mid)">${inc.location?.address || '—'}</td>
      ${!compact ? `<td style="font-size:11px;color:var(--silver-dark)">${(inc.assignedAgencies || []).map(a => UI.typeLabel(a)).join(', ') || '—'}</td>` : ''}
      <td style="font-size:11px;color:var(--silver-dark);white-space:nowrap">${UI.date(inc.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-ghost btn-sm" title="Update status"
                  onclick="openStatusModal('${inc._id}', '${inc.status}')">↻ Status</button>
          <button class="btn btn-ghost btn-sm" title="Edit incident"
                  onclick="editIncident('${inc._id}')">✏</button>
          <button class="btn btn-ghost btn-sm danger" title="Delete incident"
                  onclick="deleteIncident('${inc._id}')">✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ══════════════════════════════════════════════════════
   RESOURCES
   ══════════════════════════════════════════════════════ */
async function loadResources() {
  try {
    const filters = {
      status: document.getElementById('f-res-status')?.value,
      type:   document.getElementById('f-res-type')?.value,
    };
    const res = await API.getResources(filters);
    state.resources = res.data || [];
    renderResourceCards(state.resources);
  } catch (err) {
    console.error('Load resources error:', err);
    UI.toast('Failed to load resources.', 'error');
  }
}

function renderResourceCards(resources) {
  const grid = document.getElementById('resources-grid');
  if (!grid) return;

  if (!resources.length) {
    grid.innerHTML = `<div class="empty-state">No resources registered yet</div>`;
    return;
  }

  grid.innerHTML = resources.map(r => `
    <div class="resource-card" role="listitem">
      <div class="resource-card-header">
        <div>
          <div class="resource-name">
            <span aria-hidden="true">${UI.resourceIcon(r.type)}</span>
            ${r.name}
          </div>
          <div class="resource-agency">${r.agency || '—'}</div>
        </div>
        ${UI.resourceStatus(r.status)}
      </div>
      <div class="resource-footer">
        <span class="resource-type-label">${UI.typeLabel(r.type)}</span>
        <div class="resource-actions">
          <button class="btn btn-ghost btn-sm" title="Edit resource"
                  onclick="editResource('${r._id}')">✏</button>
          <button class="btn btn-ghost btn-sm danger" title="Remove resource"
                  onclick="deleteResource('${r._id}')">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════
   MODAL MANAGEMENT
   ══════════════════════════════════════════════════════ */
function openModal(type) {
  document.getElementById(`${type}-modal`)?.classList.add('active');
}

function closeModal(type) {
  document.getElementById(`${type}-modal`)?.classList.remove('active');
  resetForm(type);
}

function resetForm(type) {
  if (type === 'incident') {
    document.getElementById('incident-form')?.reset();
    document.getElementById('i-edit-id').value = '';
    document.getElementById('incident-modal-title').textContent = 'Report New Incident';
    document.getElementById('i-submit-btn').textContent = 'Submit Report';
    state.editingIncidentId = null;
  }
  if (type === 'resource') {
    document.getElementById('resource-form')?.reset();
    document.getElementById('r-edit-id').value = '';
    document.getElementById('resource-modal-title').textContent = 'Register New Resource';
    document.getElementById('r-submit-btn').textContent = 'Register Resource';
    state.editingResourceId = null;
  }
}

/* ══════════════════════════════════════════════════════
   STATUS UPDATE MODAL
   ══════════════════════════════════════════════════════ */
function openStatusModal(incidentId, currentStatus) {
  document.getElementById('s-incident-id').value = incidentId;
  document.getElementById('s-status').value = currentStatus;
  openModal('status');
}

async function submitStatusUpdate() {
  const id     = document.getElementById('s-incident-id').value;
  const status = document.getElementById('s-status').value;

  try {
    const res = await API.updateIncident(id, { status });
    if (res.success) {
      UI.toast(`Status updated to "${UI.typeLabel(status)}".`, 'success');
      closeModal('status');
      loadDashboard();
      if (state.currentView === 'incidents') loadIncidents();
    } else {
      UI.toast(res.message || 'Update failed.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  }
}

/* ══════════════════════════════════════════════════════
   INCIDENT FORM SUBMIT (Create / Update)
   ══════════════════════════════════════════════════════ */
async function handleIncidentSubmit(e) {
  e.preventDefault();

  const id      = state.editingIncidentId;
  const btn     = document.getElementById('i-submit-btn');
  const agencies = [...document.querySelectorAll('input[name="agencies"]:checked')]
                    .map(c => c.value);

  // Build payload matching the Incident schema exactly
  const payload = {
    title:            document.getElementById('i-title').value.trim(),
    type:             document.getElementById('i-type').value,
    severity:         document.getElementById('i-severity').value,
    location:         { address: document.getElementById('i-location').value.trim() },
    description:      document.getElementById('i-desc').value.trim(),
    assignedAgencies: agencies,
  };

  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    const res = id
      ? await API.updateIncident(id, payload)
      : await API.createIncident(payload);

    if (res.success) {
      UI.toast(id ? 'Incident updated.' : 'Incident reported successfully.', 'success');
      closeModal('incident');
      loadDashboard();
      if (state.currentView === 'incidents') loadIncidents();
    } else {
      UI.toast(res.message || 'Submission failed.', 'error');
    }
  } catch {
    UI.toast('Network error — check your connection.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Save Changes' : 'Submit Report';
  }
}

/* ══════════════════════════════════════════════════════
   RESOURCE FORM SUBMIT (Create / Update)
   ══════════════════════════════════════════════════════ */
async function handleResourceSubmit(e) {
  e.preventDefault();

  const id  = state.editingResourceId;
  const btn = document.getElementById('r-submit-btn');

  // Build payload matching the Resource schema exactly
  const payload = {
    name:   document.getElementById('r-name').value.trim(),
    type:   document.getElementById('r-type').value,
    status: document.getElementById('r-status').value,
    agency: document.getElementById('r-agency').value.trim(),
  };

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
      UI.toast(res.message || 'Save failed.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = id ? 'Save Changes' : 'Register Resource';
  }
}

/* ══════════════════════════════════════════════════════
   EDIT — Populate form from current state
   ══════════════════════════════════════════════════════ */
function editIncident(id) {
  const inc = state.incidents.find(i => i._id === id);
  if (!inc) { UI.toast('Incident not found.', 'error'); return; }

  state.editingIncidentId = id;
  document.getElementById('i-edit-id').value = id;
  document.getElementById('incident-modal-title').textContent = 'Edit Incident';
  document.getElementById('i-submit-btn').textContent = 'Save Changes';

  document.getElementById('i-title').value    = inc.title;
  document.getElementById('i-type').value     = inc.type;
  document.getElementById('i-severity').value = inc.severity;
  document.getElementById('i-location').value = inc.location?.address || '';
  document.getElementById('i-desc').value     = inc.description || '';

  // Restore agency checkboxes
  document.querySelectorAll('input[name="agencies"]').forEach(cb => {
    cb.checked = (inc.assignedAgencies || []).includes(cb.value);
  });

  openModal('incident');
}

function editResource(id) {
  const r = state.resources.find(r => r._id === id);
  if (!r) { UI.toast('Resource not found.', 'error'); return; }

  state.editingResourceId = id;
  document.getElementById('r-edit-id').value = id;
  document.getElementById('resource-modal-title').textContent = 'Edit Resource';
  document.getElementById('r-submit-btn').textContent = 'Save Changes';

  document.getElementById('r-name').value   = r.name;
  document.getElementById('r-type').value   = r.type;
  document.getElementById('r-status').value = r.status;
  document.getElementById('r-agency').value = r.agency || '';

  openModal('resource');
}

/* ══════════════════════════════════════════════════════
   DELETE
   ══════════════════════════════════════════════════════ */
async function deleteIncident(id) {
  if (!confirm('Permanently delete this incident record? This cannot be undone.')) return;
  try {
    const res = await API.deleteIncident(id);
    if (res.success) {
      UI.toast('Incident deleted.', 'info');
      loadDashboard();
      if (state.currentView === 'incidents') loadIncidents();
    } else {
      UI.toast('Delete failed.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  }
}

async function deleteResource(id) {
  if (!confirm('Remove this resource from the registry? This cannot be undone.')) return;
  try {
    const res = await API.deleteResource(id);
    if (res.success) {
      UI.toast('Resource removed.', 'info');
      loadDashboard();
      if (state.currentView === 'resources') loadResources();
    } else {
      UI.toast('Delete failed.', 'error');
    }
  } catch {
    UI.toast('Network error.', 'error');
  }
}

/* ══════════════════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
   ══════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal('incident');
    closeModal('resource');
    closeModal('status');
  }
});

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      const type = overlay.id.replace('-modal', '');
      closeModal(type);
    }
  });
});

/* ══════════════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  checkHealth();
  loadDashboard();

  // Auto-refresh every 30 seconds
  setInterval(loadDashboard, 30_000);
  setInterval(checkHealth, 15_000);
});
