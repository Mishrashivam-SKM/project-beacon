/* ui.js — Pure rendering helpers. No fetch calls, no business logic. */

const UI = {

  /* ── Toast ── */
  toast(msg, type = 'info') {
    const wrap = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.setAttribute('role', 'alert');

    const icon = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }[type] || 'ℹ';
    el.innerHTML = `<strong style="flex-shrink:0">${icon}</strong><span>${msg}</span>`;
    wrap.appendChild(el);

    setTimeout(() => {
      el.style.transition = 'opacity .3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 320);
    }, 3800);
  },

  /* ── Severity badge — matches Incident.severity enum ── */
  severity(s) {
    const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
    return `<span class="badge badge-${s}" aria-label="Severity: ${s}">${map[s] || s}</span>`;
  },

  /* ── Status badge — matches Incident.status enum ── */
  status(s) {
    const map = {
      reported: 'Reported', acknowledged: 'Acknowledged',
      responding: 'Responding', resolved: 'Resolved', closed: 'Closed',
    };
    return `<span class="badge badge-${s}" aria-label="Status: ${s}">${map[s] || s}</span>`;
  },

  /* ── Resource status badge — matches Resource.status enum ── */
  resourceStatus(s) {
    const map = {
      available: 'Available', deployed: 'Deployed',
      maintenance: 'Maintenance', out_of_service: 'Out of Service',
    };
    return `<span class="badge badge-${s}">${map[s] || s}</span>`;
  },

  /* ── Type icon — maps to Incident.type enum ── */
  typeIcon(t) {
    const icons = {
      fire: '🔥', flood: '🌊', earthquake: '🏚',
      accident: '💥', medical: '🏥', hazmat: '☣',
      rescue: '🆘', other: '📌',
    };
    return icons[t] || '📌';
  },

  /* ── Resource type icon — maps to Resource.type enum ── */
  resourceIcon(t) {
    const icons = {
      ambulance: '🚑', fire_truck: '🚒', police_vehicle: '🚔',
      helicopter: '🚁', rescue_boat: '🚤',
      medical_team: '👨‍⚕️', rescue_team: '🦺', other: '📌',
    };
    return icons[t] || '📌';
  },

  /* ── Date formatting ── */
  date(str) {
    if (!str) return '—';
    return new Date(str).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  },

  /* ── Readable type label ── */
  typeLabel(t) {
    return (t || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  },
};
