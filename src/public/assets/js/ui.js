/* ui.js — Pure rendering helpers, no business logic */

const UI = {
  /* ── Toast Notifications ── */
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    el.innerHTML = `<span style="flex-shrink:0;font-weight:700">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 3500);
  },

  /* ── Severity Badge ── */
  severityBadge(severity) {
    const labels = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
    return `<span class="badge badge-${severity}">${labels[severity] || severity}</span>`;
  },

  /* ── Status Badge ── */
  statusBadge(status) {
    const labels = {
      reported: 'Reported', acknowledged: 'Acknowledged',
      responding: 'Responding', resolved: 'Resolved', closed: 'Closed',
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  },

  /* ── Resource Status Badge ── */
  resourceStatusBadge(status) {
    const labels = {
      available: 'Available', deployed: 'Deployed',
      maintenance: 'Maintenance', out_of_service: 'Out of Service',
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  },

  /* ── Type Label ── */
  typeIcon(type) {
    const icons = {
      fire: '🔥', flood: '🌊', earthquake: '🏚', accident: '💥',
      medical: '🏥', hazmat: '☣', rescue: '🆘', other: '📌',
    };
    return icons[type] || '📌';
  },

  /* ── Resource Type Icon ── */
  resourceIcon(type) {
    const icons = {
      ambulance: '🚑', fire_truck: '🚒', police_vehicle: '🚔',
      helicopter: '🚁', rescue_boat: '🚤',
      medical_team: '👨‍⚕️', rescue_team: '🦺', other: '📌',
    };
    return icons[type] || '📌';
  },

  /* ── Format Date ── */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  },

  /* ── Critical Alert Strip ── */
  setCriticalAlert(hasCritical) {
    const strip = document.getElementById('critical-alert-strip');
    if (!strip) return;
    if (hasCritical) {
      strip.classList.add('active');
    } else {
      strip.classList.remove('active');
    }
  },
};
