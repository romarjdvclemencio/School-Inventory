/**
 * Shared utility functions
 * School Inventory Management System
 */

// ─── Toast Notifications ─────────────────────────────────────────────────────

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'false');
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

const TOAST_ICONS = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17.5"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8.5"/></svg>'
};

export function showToast(message, type = 'success', title = '', duration = 4000) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');

  const defaultTitles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };
  const toastTitle = title || defaultTitles[type] || '';

  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <div class="toast-content">
      ${toastTitle ? `<div class="toast-title">${toastTitle}</div>` : ''}
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss notification">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="toast-bar"></div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  const timer = setTimeout(() => removeToast(toast), duration);
  toast._timer = timer;

  return toast;
}

function removeToast(toast) {
  if (toast._timer) clearTimeout(toast._timer);
  toast.classList.add('removing');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

// ─── Modal Management ─────────────────────────────────────────────────────────

export function openModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus first focusable element
  setTimeout(() => {
    const focusable = backdrop.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }, 100);
}

export function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const open = document.querySelector('.modal-backdrop.open');
    if (open) {
      open.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// ─── Confirmation Dialog ──────────────────────────────────────────────────────

export function showConfirm({
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
} = {}) {
  return new Promise((resolve) => {
    let backdrop = document.getElementById('globalConfirmModal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'globalConfirmModal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal modal-sm confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
          <div class="modal-body">
            <div class="confirm-icon ${type}" id="confirmIcon">
              <svg id="confirmIconSvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
            <div class="confirm-title" id="confirmTitle"></div>
            <div class="confirm-message" id="confirmMessage"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="confirmCancel"></button>
            <button class="btn" id="confirmOk"></button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    const ICONS = {
      danger:  '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17.5"/>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17.5"/>'
    };

    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmOk').textContent = confirmText;
    document.getElementById('confirmOk').className = `btn btn-${type}`;
    document.getElementById('confirmCancel').textContent = cancelText;
    document.getElementById('confirmIcon').className = `confirm-icon ${type}`;
    document.getElementById('confirmIconSvg').innerHTML = ICONS[type] || ICONS.danger;

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    const okBtn = document.getElementById('confirmOk');
    const cancelBtn = document.getElementById('confirmCancel');

    function cleanup(result) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      okBtn.replaceWith(okBtn.cloneNode(true));
      cancelBtn.replaceWith(cancelBtn.cloneNode(true));
      resolve(result);
    }

    document.getElementById('confirmOk').addEventListener('click', () => cleanup(true), { once: true });
    document.getElementById('confirmCancel').addEventListener('click', () => cleanup(false), { once: true });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) cleanup(false); }, { once: true });
  });
}

// ─── Date & Time Helpers ──────────────────────────────────────────────────────

export function formatDate(date) {
  if (!date) return '—';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateTime(date) {
  if (!date) return '—';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function formatDateShort(date) {
  if (!date) return '—';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  return formatDateShort(d);
}

export function isOverdue(date) {
  if (!date) return false;
  const d = date.toDate ? date.toDate() : new Date(date);
  return d < new Date();
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount, currency = '₱') {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return `${currency}${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Status Badge HTML ─────────────────────────────────────────────────────────

export function statusBadge(status) {
  if (!status) return '';
  const cls = `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  return `<span class="badge ${cls}">${status}</span>`;
}

export function conditionBadge(condition) {
  if (!condition) return '';
  const cls = `condition-${condition.toLowerCase()}`;
  return `<span class="badge ${cls}">${condition}</span>`;
}

// ─── String / ID Helpers ──────────────────────────────────────────────────────

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── DOM Helpers ───────────────────────────────────────────────────────────────

export function $(selector, parent = document) { return parent.querySelector(selector); }
export function $$(selector, parent = document) { return [...parent.querySelectorAll(selector)]; }

export function show(el) {
  const e = typeof el === 'string' ? document.getElementById(el) : el;
  if (e) e.style.display = '';
}
export function hide(el) {
  const e = typeof el === 'string' ? document.getElementById(el) : el;
  if (e) e.style.display = 'none';
}
export function toggle(el, condition) {
  const e = typeof el === 'string' ? document.getElementById(el) : el;
  if (e) e.style.display = condition ? '' : 'none';
}

export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ─── Pagination Helper ─────────────────────────────────────────────────────────

export function buildPaginationHTML(currentPage, totalPages, totalItems, itemsPerPage) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const info = `Showing ${start}–${end} of ${totalItems} items`;

  let btnHTML = `
    <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>`;

  const range = getPaginationRange(currentPage, totalPages);
  for (const p of range) {
    if (p === '...') {
      btnHTML += `<span class="page-btn" style="border:none;background:none;">…</span>`;
    } else {
      btnHTML += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="changePage(${p})">${p}</button>`;
    }
  }

  btnHTML += `
    <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`;

  return { info, btnHTML };
}

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', current-1, current, current+1, '...', total];
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportCSV(filename, headers, rows) {
  const escape = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csvContent = [
    headers.map(escape).join(','),
    ...rows.map(row => row.map(escape).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Print ───────────────────────────────────────────────────────────────────

export function printSection(elementId, title = '') {
  const content = document.getElementById(elementId);
  if (!content) return;
  const w = window.open('', '_blank');
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title || 'Print'}</title>
      <style>
        body { font-family: sans-serif; font-size: 12px; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #f0f0f0; font-weight: 700; }
        .badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; }
        h1 { font-size: 18px; margin-bottom: 8px; }
        .no-print { display: none; }
      </style>
    </head>
    <body>
      ${title ? `<h1>${title}</h1>` : ''}
      ${content.innerHTML}
    </body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
}

// ─── Form Helpers ─────────────────────────────────────────────────────────────

export function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  const data = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.name) return;
    if (input.type === 'checkbox') {
      data[input.name] = input.checked;
    } else if (input.type === 'number') {
      data[input.name] = input.value !== '' ? Number(input.value) : null;
    } else {
      data[input.name] = input.value;
    }
  });
  return data;
}

export function setFormData(formId, data) {
  const form = document.getElementById(formId);
  if (!form || !data) return;
  Object.entries(data).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (!input) return;
    if (input.type === 'checkbox') {
      input.checked = Boolean(value);
    } else {
      input.value = value ?? '';
    }
  });
}

export function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
  // Clear validation states
  form?.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  form?.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
}

export function validateRequired(fields) {
  let valid = true;
  fields.forEach(({ id, errorId, message }) => {
    const el = document.getElementById(id);
    const errEl = errorId ? document.getElementById(errorId) : null;
    const group = el?.closest('.form-group');

    if (!el || !el.value.trim()) {
      if (errEl) {
        errEl.textContent = message || 'This field is required.';
        errEl.style.display = 'block';
      }
      if (group) group.classList.add('has-error');
      valid = false;
    } else {
      if (errEl) errEl.style.display = 'none';
      if (group) group.classList.remove('has-error');
    }
  });
  return valid;
}

// ─── Firebase Error Messages ──────────────────────────────────────────────────

export function getFirestoreError(err) {
  const map = {
    'permission-denied':    'You do not have permission to perform this action.',
    'not-found':            'The requested record was not found.',
    'unavailable':          'Service is temporarily unavailable. Please check your internet connection and try again.',
    'deadline-exceeded':    'The request timed out. Please try again.',
    'cancelled':            'The operation was cancelled.',
    'already-exists':       'A record with this ID already exists.',
    'resource-exhausted':   'Too many requests. Please wait a moment and try again.',
    'unauthenticated':      'Your session has expired. Please sign in again.',
    'invalid-argument':     'Invalid data was provided. Please check your input.',
    'failed-precondition':  'The operation could not be completed due to a system constraint.',
    'aborted':              'The operation was aborted. Please try again.',
    'out-of-range':         'A value is outside the allowed range.',
    'unimplemented':        'This feature is not yet available.',
    'internal':             'An internal error occurred. Please try again.',
    'data-loss':            'Data could not be retrieved. Please try again.',
  };
  // For network errors
  if (err.message && (err.message.includes('network') || err.message.includes('offline'))) {
    return 'Unable to connect to the database. Please check your internet connection and try again.';
  }
  return map[err.code] || 'An unexpected error occurred. Please try again.';
}

// ─── Number Formatting ─────────────────────────────────────────────────────────

export function formatNumber(n) {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-PH');
}
