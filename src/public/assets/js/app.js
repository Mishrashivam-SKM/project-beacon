/* ═══════════════════════════════════════════════════════
   GOVERNMENT PORTAL UI - JAVASCRIPT LOGIC
   Connects the strict UI to the Project Beacon Backend
   ═══════════════════════════════════════════════════════ */

/* ── System Status & Clock ── */
async function checkSystemStatus() {
  const online = await API.healthCheck();
  const pill = document.getElementById('system-status');
  if (pill) {
    if (online) {
      pill.className = 'system-pill system-online';
      pill.textContent = 'API Operational';
    } else {
      pill.className = 'system-pill system-offline';
      pill.textContent = 'API Unreachable';
    }
  }
}

function startClock() {
  function tick() {
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const el = document.getElementById('banner-clock');
    if (el) el.textContent = formatted + ' IST';
  }
  tick();
  setInterval(tick, 1000);
}

/* ── Load Incidents (Grid) ── */
async function loadIncidents() {
  const res = await API.getIncidents();
  const incidents = res.data || [];
  const grid = document.getElementById('incidents-grid');
  
  if (!grid) return;
  
  if (incidents.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1;">No active incidents reported.</p>';
    UI.setCriticalAlert(false);
    return;
  }
  
  // Check for critical incidents
  const hasCritical = incidents.some(i => i.severity === 'critical');
  UI.setCriticalAlert(hasCritical);
  
  grid.innerHTML = incidents.map(inc => `
    <article class="news-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
        <time class="news-date">${UI.formatDate(inc.createdAt)}</time>
        ${UI.severityBadge(inc.severity)}
      </div>
      <h3 class="news-title">${UI.typeIcon(inc.type)} ${inc.title}</h3>
      <div style="margin-bottom: 16px; font-size: 14px; font-weight: bold;">
        <span class="status-${inc.status}">${inc.status}</span>
      </div>
      <p class="news-excerpt" style="font-size: 14px;"><strong>Location:</strong> ${inc.location?.address || 'N/A'}<br/>${inc.description || ''}</p>
      <div style="font-size: 12px; color: var(--color-secondary); margin-top: auto; padding-top: 16px; border-top: 1px solid var(--color-tertiary);">
        <strong>Assigned:</strong> ${(inc.assignedAgencies || []).join(', ') || 'Pending Assignment'}
      </div>
    </article>
  `).join('');
}

/* ── Load Resources (Directory) ── */
async function loadResources() {
  const res = await API.getResources();
  const resources = res.data || [];
  const directory = document.getElementById('resources-directory');
  
  if (!directory) return;
  
  if (resources.length === 0) {
    directory.innerHTML = '<p>No resources registered.</p>';
    return;
  }
  
  // Group resources by type
  const grouped = resources.reduce((acc, r) => {
    acc[r.type] = acc[r.type] || [];
    acc[r.type].push(r);
    return acc;
  }, {});
  
  // Create columns based on type
  directory.innerHTML = Object.keys(grouped).sort().map(type => {
    const list = grouped[type].sort((a, b) => a.name.localeCompare(b.name)).map(r => `
      <li>
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 6px 0; border-bottom: 1px solid var(--color-tertiary);">
          <span>${r.name} <br/><small style="color: var(--color-secondary);">${r.agency || 'Unknown'}</small></span>
          ${UI.resourceStatusBadge(r.status)}
        </div>
      </li>
    `).join('');
    
    return `
      <div class="service-group">
        <h3 style="text-transform: capitalize;">${UI.resourceIcon(type)} ${type.replace(/_/g, ' ')}</h3>
        <ul class="service-list" style="margin-top: 12px;">
          ${list}
        </ul>
      </div>
    `;
  }).join('');
}

/* ── Multi-step Form Logic ── */
let currentStep = 1;
const totalSteps = 4;

function updateProgressUI() {
  for (let i = 1; i <= totalSteps; i++) {
    const indicator = document.getElementById(`step${i}-indicator`);
    if (indicator) {
      if (i < currentStep) {
        indicator.className = 'step completed';
      } else if (i === currentStep) {
        indicator.className = 'step active';
      } else {
        indicator.className = 'step';
      }
    }

    const content = document.getElementById(`step${i}-content`);
    if (content) {
      content.style.display = (i === currentStep) ? 'block' : 'none';
    }
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgressUI();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateProgressUI();
  }
}

async function submitApplication() {
  const btn = document.querySelector('#step4-content .btn-primary');
  btn.disabled = true;
  btn.textContent = 'Submitting...';
  
  const agencies = [...document.querySelectorAll('input[name="agencies"]:checked')].map(c => c.value);
  
  const payload = {
    title: document.getElementById('incident-title').value,
    type: document.getElementById('incident-type').value,
    severity: document.getElementById('incident-severity').value,
    location: { address: document.getElementById('incident-location').value },
    description: document.getElementById('incident-desc').value,
    assignedAgencies: agencies
  };
  
  try {
    const res = await API.createIncident(payload);
    if (res.success) {
      // Hide all steps
      for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`step${i}-content`).style.display = 'none';
        document.getElementById(`step${i}-indicator`).className = 'step completed';
      }
      // Show success
      document.getElementById('step-success').style.display = 'block';
      // Reload incidents grid
      loadIncidents();
    } else {
      alert('Error: ' + res.message);
      btn.disabled = false;
      btn.textContent = 'Submit Emergency Report';
    }
  } catch (err) {
    alert('Network error submitting incident.');
    btn.disabled = false;
    btn.textContent = 'Submit Emergency Report';
  }
}

/* ── Initialization ── */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  checkSystemStatus();
  loadIncidents();
  loadResources();
  updateProgressUI();
  
  // Auto refresh data every 30 seconds
  setInterval(() => {
    checkSystemStatus();
    loadIncidents();
    loadResources();
  }, 30000);
});
