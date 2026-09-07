import { apiFetch } from './api.js';

/* ========== TOAST SYSTEM ========== */
function ensureToastContainer() {
  if (!document.getElementById('toast-container')) {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}

export function showToast(message, type = 'success') {
  ensureToastContainer();
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ========== CONFIRM DELETE ========== */
export function confirmAction(title, text) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="confirm-title">${title}</div>
        <div class="confirm-text">${text}</div>
        <div class="confirm-btns">
          <button class="btn btn-secondary" id="confirmCancel">Cancel</button>
          <button class="btn btn-danger-solid" id="confirmOk">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmCancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirmOk').onclick = () => { overlay.remove(); resolve(true); };
  });
}

/* ========== SVG ICONS ========== */
const NAV_ICONS = {
  dashboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  assets: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  assignments: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  maintenance: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  auditlogs: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  roles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`,
  departments: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
  locations: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  categories: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  types: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  manufacturers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  vendors: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  models: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  statuslabels: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
};

const CHEVRON_DOWN = `<svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

/* ========== LAYOUT ========== */
export function renderLayout(contentHtml, activeNav = 'dashboard') {
  if (!localStorage.getItem('token')) { window.location.href = '/login.html'; return; }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.email ? user.email.split('@')[0] : 'User';
  const initials = displayName.substring(0, 2).toUpperCase();
  const roleName = user.role || 'User';

  const sections = [
    {
      id: 'core',
      title: 'Core',
      items: [
        { id: 'dashboard', path: '/', icon: NAV_ICONS.dashboard, label: 'Dashboard' },
        { id: 'assets', path: '/assets.html', icon: NAV_ICONS.assets, label: 'Inventory' },
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      items: [
        { id: 'assignments', path: '/assignments.html', icon: NAV_ICONS.assignments, label: 'Assignments' },
        { id: 'maintenance', path: '/maintenance.html', icon: NAV_ICONS.maintenance, label: 'Maintenance' },
        { id: 'audit-logs', path: '/audit-logs.html', icon: NAV_ICONS.auditlogs, label: 'Audit Logs' },
      ]
    },
    {
      id: 'organization',
      title: 'Organization',
      items: [
        { id: 'users', path: '/setup/users.html', icon: NAV_ICONS.users, label: 'Users' },
        { id: 'roles', path: '/setup/roles.html', icon: NAV_ICONS.roles, label: 'Roles' },
        { id: 'departments', path: '/setup/departments.html', icon: NAV_ICONS.departments, label: 'Departments' },
        { id: 'locations', path: '/setup/locations.html', icon: NAV_ICONS.locations, label: 'Locations' },
      ]
    },
    {
      id: 'setup',
      title: 'Setup',
      items: [
        { id: 'types', path: '/setup/types.html', icon: NAV_ICONS.types, label: 'Types' },
        { id: 'categories', path: '/setup/categories.html', icon: NAV_ICONS.categories, label: 'Categories' },
        { id: 'manufacturers', path: '/setup/manufacturers.html', icon: NAV_ICONS.manufacturers, label: 'Manufacturers' },
        { id: 'vendors', path: '/setup/vendors.html', icon: NAV_ICONS.vendors, label: 'Vendors' },
        { id: 'models', path: '/setup/models.html', icon: NAV_ICONS.models, label: 'Models' }
      ]
    },
    {
      id: 'system',
      title: 'System',
      items: [
        { id: 'settings', path: '/settings.html', icon: NAV_ICONS.dashboard, label: 'Settings' }
      ]
    }
  ];

  // Determine which section the active nav belongs to
  const activeSectionId = sections.find(s => s.items.some(i => i.id === activeNav))?.id || 'core';

  const sidebarSections = sections.map(section => {
    const hasActive = section.items.some(i => i.id === activeNav);
    const stored = localStorage.getItem(`nav-group-${section.id}`);
    const isOpen = stored !== null ? stored !== 'false' : true;
    return `
    <div class="nav-group ${isOpen ? 'open' : ''}" data-group="${section.id}">
      <button class="nav-group-header" data-group="${section.id}">
        <span class="nav-group-title">${section.title}</span>
        ${CHEVRON_DOWN}
      </button>
      <div class="nav-group-items">
        <div class="nav-group-items-inner">
          ${section.items.map(nav => `
            <a href="${nav.path}" class="nav-item ${activeNav === nav.id ? 'active' : ''}">
              <span class="nav-icon">${nav.icon}</span>
              <span class="nav-label">${nav.label}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `}).join('');

  const isMinimized = localStorage.getItem('sidebar-minimized') === 'true';

  document.body.innerHTML = `
    <div class="app-container">
      <aside class="sidebar ${isMinimized ? 'minimized' : ''}" id="sidebar">
        <button id="sidebarToggle" class="sidebar-toggle-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toggle-icon"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="sidebar-logo">
          <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://haball.pk&size=128" alt="Haball" class="logo-img" />
          <span class="logo-text">Haball IT</span>
        </div>
        <nav class="sidebar-nav">
          ${sidebarSections}
        </nav>
        <div class="sidebar-user">
          <div class="sidebar-user-info">
            <div class="sidebar-user-avatar">${initials}</div>
            <div class="sidebar-user-details">
              <div class="sidebar-user-name">${displayName}</div>
              <div class="sidebar-user-role">${roleName}</div>
            </div>
          </div>
          <button id="logoutBtn" class="btn btn-logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>
      <main class="main-content fade-in">
        ${contentHtml}
      </main>
    </div>
  `;

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });

  // Sidebar toggle (collapse/expand)
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const toggleIcon = sidebarToggle.querySelector('svg');

  function updateToggleIcon() {
    if (sidebar.classList.contains('minimized')) {
      toggleIcon.innerHTML = '<path d="M9 18l6-6-6-6"/>';
    } else {
      toggleIcon.innerHTML = '<path d="M15 18l-6-6 6-6"/>';
    }
  }

  sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('minimized');
    localStorage.setItem('sidebar-minimized', sidebar.classList.contains('minimized'));
    updateToggleIcon();
  });
  updateToggleIcon();

  // Nav group accordion — clicking header toggles the group
  document.querySelectorAll('.nav-group-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const groupId = btn.dataset.group;
      const group = btn.closest('.nav-group');
      const isCurrentlyOpen = group.classList.contains('open');
      group.classList.toggle('open', !isCurrentlyOpen);
      localStorage.setItem(`nav-group-${groupId}`, String(!isCurrentlyOpen));
    });
  });

  // Preserve sidebar scroll position across page navigations
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav) {
    const savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll) {
      sidebarNav.scrollTop = parseInt(savedScroll, 10);
    }
    sidebarNav.addEventListener('scroll', () => {
      sessionStorage.setItem('sidebar-scroll', sidebarNav.scrollTop);
    });
  }
}

/* ========== REUSABLE CRUD PAGE BUILDER ========== */
export function buildCrudPage({ title, navId, columns, endpoint, formFields, buildRow, parseForm, entityName, canDelete, deleteBlockedMsg }) {
  if (!localStorage.getItem('token')) { window.location.href = '/login.html'; return; }

  let currentPage = 1;
  let editingId = null;
  let allData = [];

  const thHeaders = '<th style="width:40px"><input type="checkbox" id="selectAllCheckbox"></th>' + columns.map(c => `<th>${c}</th>`).join('') + '<th style="width:100px">Actions</th>';

  const formHtml = formFields.map(f => {
    if (f.type === 'row-start') return '<div class="form-row">';
    if (f.type === 'row-end') return '</div>';
    if (f.type === 'permissions') {
      const perms = f.permissionsList || [];
      return `<div class="form-group">
        <label class="form-label">${f.label}</label>
        <div class="permissions-matrix" id="${f.id}" style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; background: var(--bg-secondary); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color);">
          ${perms.map(p => `
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" value="${p}" class="perm-checkbox" /> <span style="font-size:0.85rem">${p}</span>
            </label>
          `).join('')}
        </div>
      </div>`;
    }
    if (f.type === 'select') {
      return `<div class="form-group">
        <label class="form-label" for="${f.id}">${f.label}</label>
        <select id="${f.id}" class="form-control" ${f.required ? 'required' : ''}>
          <option value="">Select...</option>
          ${(f.options || []).map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>
      </div>`;
    }
    if (f.type === 'password') {
      return `<div class="form-group">
        <label class="form-label" for="${f.id}">${f.label}</label>
        <div class="password-field-wrap">
          <input type="password" id="${f.id}" class="form-control password-input"
            ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${f.placeholder}"` : ''}
          />
          <button type="button" class="password-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">
            <svg class="eye-icon eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg class="eye-icon eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
        ${f.hint ? `<div class="form-hint">${f.hint}</div>` : ''}
      </div>`;
    }
    return `<div class="form-group">
      <label class="form-label" for="${f.id}">${f.label}</label>
      <${f.type === 'textarea' ? 'textarea' : 'input'} type="${f.type || 'text'}" id="${f.id}" class="form-control"
        ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${f.placeholder}"` : ''}
        ${f.step ? `step="${f.step}"` : ''} ${f.min !== undefined ? `min="${f.min}"` : ''}
      ${f.type === 'textarea' ? '></textarea>' : '/>'}
      ${f.hint ? `<div class="form-hint">${f.hint}</div>` : ''}
    </div>`;
  }).join('');

  const html = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">Manage your ${title.toLowerCase()}</p>
      </div>
      <button id="newBtn" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New ${entityName}
      </button>
    </div>

    <div class="card table-wrapper">
      <div class="table-toolbar">
        <div style="display:flex; gap:1rem; align-items:center;">
          <button id="batchDeleteBtn" class="btn btn-danger btn-sm" style="display:none;">Delete (<span id="batchCount">0</span>)</button>
          <input type="text" class="search-input" id="searchInput" placeholder="Search ${title.toLowerCase()}..." />
        </div>
        <span id="tableCount" class="table-count"></span>
      </div>
      <table class="table">
        <thead><tr>${thHeaders}</tr></thead>
        <tbody id="tbody"></tbody>
      </table>
      <div class="table-footer">
        <span id="pageInfo" class="page-info">Page 1</span>
        <div style="display:flex;gap:0.5rem">
          <button id="prevBtn" class="btn btn-secondary btn-sm">Prev</button>
          <button id="nextBtn" class="btn btn-secondary btn-sm">Next</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="modal">
      <div class="card modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">New ${entityName}</h3>
          <button class="btn-icon-close" id="modalClose" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-error" id="modalError"></div>
          <form id="crudForm">
            ${formHtml}
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modalCancel">Cancel</button>
          <button type="submit" form="crudForm" class="btn btn-primary" id="saveBtn">Save</button>
        </div>
      </div>
    </div>
  `;

  renderLayout(html, navId);

  const tbody = document.getElementById('tbody');
  const modal = document.getElementById('modal');
  const form = document.getElementById('crudForm');
  const searchInput = document.getElementById('searchInput');

  // Wire up password toggle buttons inside modal
  modal.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.closest('.password-field-wrap').querySelector('.password-input');
      const pwInput = btn.closest('.password-field-wrap').querySelector('.password-input');
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (pwInput.type === 'password') {
        pwInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        pwInput.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  });

  async function loadData() {
    tbody.innerHTML = `<tr><td colspan="${columns.length + 2}" class="page-loader"><div class="loader"></div></td></tr>`;
    try {
      const res = await apiFetch(`${endpoint}?page=${currentPage}&limit=15`);
      allData = res.data;
      renderRows(allData);
      document.getElementById('pageInfo').textContent = `Page ${res.meta.page} of ${res.meta.lastPage || 1}`;
      document.getElementById('tableCount').textContent = `${res.meta.total} records`;
      document.getElementById('prevBtn').disabled = res.meta.page <= 1;
      document.getElementById('nextBtn').disabled = res.meta.page >= (res.meta.lastPage || 1);
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="${columns.length + 2}" class="empty-state"><div class="empty-state-text">${err.message}</div></td></tr>`;
    }
  }

  function renderRows(data) {
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${columns.length + 2}" class="empty-state">
        <div class="empty-state-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        </div>
        <div class="empty-state-text">No ${title.toLowerCase()} found</div>
        <div class="empty-state-hint">Click "New ${entityName}" to create one</div>
      </td></tr>`;
      return;
    }
    
    const adminCount = entityName === 'User' ? allData.filter(d => d.role && d.role.name === 'Admin').length : 0;
    
    tbody.innerHTML = data.map(item => {
      const cells = buildRow(item);
      const isSoleAdmin = entityName === 'User' && item.role && item.role.name === 'Admin' && adminCount <= 1;
      const isReferenced = item.referenceCount && item.referenceCount > 0;
      // Support custom canDelete callback from page config
      const customBlocked = canDelete ? !canDelete(item) : false;
      const customReason = customBlocked && deleteBlockedMsg ? deleteBlockedMsg(item) : '';
      const cantDelete = isSoleAdmin || isReferenced || customBlocked;
      const cantDeleteReason = isSoleAdmin
        ? 'Cannot delete the sole admin'
        : isReferenced
        ? `In use (${item.referenceCount} references)`
        : customReason;
      
      return `<tr>
        <td>
          ${!cantDelete 
            ? `<input type="checkbox" class="row-checkbox" value="${item.id}">`
            : `<input type="checkbox" disabled title="${cantDeleteReason}">`
          }
        </td>
        ${cells}
        <td class="action-btns">
          ${!cantDelete ? `
          <button class="btn-icon edit-btn" data-id="${item.id}" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon btn-icon-danger del-btn" data-id="${item.id}" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
          ` : `
          <button class="btn-icon" disabled title="Cannot edit: ${cantDeleteReason}" style="opacity: 0.3; cursor: not-allowed;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" disabled title="Cannot delete: ${cantDeleteReason}" style="opacity: 0.3; cursor: not-allowed;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
          `}
        </td>
      </tr>`;
    }).join('');
    bindActions();
    updateBatchDelete();
    const selectAll = document.getElementById('selectAllCheckbox');
    if (selectAll) selectAll.checked = false;
  }

  function bindActions() {
    tbody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = allData.find(d => d.id === parseInt(btn.dataset.id));
        if (item) openEditModal(item);
      });
    });
    tbody.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const confirmed = await confirmAction('Delete ' + entityName, 'This action is permanent and cannot be undone.');
        if (!confirmed) return;
        try {
          await apiFetch(`${endpoint}/${btn.dataset.id}`, { method: 'DELETE' });
          showToast(`${entityName} deleted successfully`, 'success');
          loadData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });
  }

  function openEditModal(item) {
    editingId = item.id;
    document.getElementById('modalTitle').textContent = `Edit ${entityName}`;
    formFields.forEach(f => {
      if (f.type === 'row-start' || f.type === 'row-end') return;
      const el = document.getElementById(f.id);
      if (!el) return;
      const key = f.field || f.id.replace(/^f-/, '');
      let val = item[key];
      if (val && typeof val === 'object' && val.id !== undefined) val = val.id;
      // Handle permissions checkboxes
      if (f.type === 'permissions') {
        const permsObj = val || {};
        el.querySelectorAll('.perm-checkbox').forEach(cb => {
          cb.checked = !!permsObj[cb.value];
        });
        return;
      }
      
      // Don't populate password fields on edit
      if (f.type === 'password') { el.value = ''; return; }
      el.value = val ?? '';
      if (el.tomselect) {
        el.tomselect.setValue(val ?? '');
      }
    });
    document.getElementById('modalError').style.display = 'none';
    modal.classList.add('active');
    if (typeof window._onEditModalOpen === 'function') window._onEditModalOpen(item);
  }

  document.getElementById('newBtn').addEventListener('click', () => {
    editingId = null;
    form.reset();
    form.querySelectorAll('select').forEach(el => {
      if (el.tomselect) el.tomselect.clear();
    });
    document.getElementById('modalTitle').textContent = `New ${entityName}`;
    formFields.forEach(f => {
      if (f.type === 'permissions') {
        const el = document.getElementById(f.id);
        if (el) el.querySelectorAll('.perm-checkbox').forEach(cb => cb.checked = false);
      }
    });
    document.getElementById('modalError').style.display = 'none';
    modal.classList.add('active');
    if (typeof window._onModalOpen === 'function') window._onModalOpen();
  });

  const closeModal = () => { modal.classList.remove('active'); editingId = null; };
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBtn');
    const errEl = document.getElementById('modalError');
    btn.textContent = 'Saving...'; btn.disabled = true; errEl.style.display = 'none';
    try {
      const body = parseForm();
      if (editingId) {
        await apiFetch(`${endpoint}/${editingId}`, { method: 'PATCH', body: JSON.stringify(body) });
        showToast(`${entityName} updated`, 'success');
      } else {
        await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) });
        showToast(`${entityName} created`, 'success');
      }
      closeModal(); form.reset(); loadData();
    } catch (err) {
      errEl.textContent = Array.isArray(err.message) ? err.message[0] : err.message;
      errEl.style.display = 'block';
    } finally {
      btn.textContent = 'Save'; btn.disabled = false;
    }
  });

  document.getElementById('prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; loadData(); } });
  document.getElementById('nextBtn').addEventListener('click', () => { currentPage++; loadData(); });

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) { renderRows(allData); return; }
    renderRows(allData.filter(item => JSON.stringify(item).toLowerCase().includes(q)));
  });

  function updateBatchDelete() {
    const selected = Array.from(document.querySelectorAll('.row-checkbox:checked'));
    const btn = document.getElementById('batchDeleteBtn');
    if (!btn) return;
    if (selected.length > 0) {
      btn.style.display = 'inline-flex';
      document.getElementById('batchCount').textContent = selected.length;
    } else {
      btn.style.display = 'none';
    }
  }

  document.getElementById('selectAllCheckbox')?.addEventListener('change', (e) => {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
    updateBatchDelete();
  });

  tbody.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-checkbox')) {
      const all = document.querySelectorAll('.row-checkbox');
      const checked = document.querySelectorAll('.row-checkbox:checked');
      const selectAll = document.getElementById('selectAllCheckbox');
      if (selectAll) selectAll.checked = (all.length > 0 && all.length === checked.length);
      updateBatchDelete();
    }
  });

  document.getElementById('batchDeleteBtn')?.addEventListener('click', async () => {
    const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
    if (selectedIds.length === 0) return;
    const confirmed = await confirmAction('Batch Delete', `You are about to permanently delete ${selectedIds.length} item(s). This cannot be undone.`);
    if (!confirmed) return;

    const btn = document.getElementById('batchDeleteBtn');
    btn.disabled = true;
    btn.textContent = 'Deleting...';

    let successCount = 0;
    let errorCount = 0;
    for (const id of selectedIds) {
      try {
        await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
        successCount++;
      } catch (e) {
        errorCount++;
      }
    }

    if (errorCount > 0 && successCount > 0) {
      showToast(`Deleted ${successCount} items (${errorCount} failed)`, 'warning');
    } else if (errorCount > 0) {
      showToast(`Failed to delete items`, 'error');
    } else {
      showToast(`Deleted ${successCount} items`, 'success');
    }

    btn.disabled = false;
    btn.innerHTML = `Delete (<span id="batchCount">0</span>)`;
    btn.style.display = 'none';
    const selectAll = document.getElementById('selectAllCheckbox');
    if (selectAll) selectAll.checked = false;
    loadData();
  });

  loadData();

  return { loadData, openEditModal };
}

/* ========== TOM SELECT HELPER ========== */
export function initSelects(container = document) {
  if (typeof TomSelect === 'undefined') return;
  container.querySelectorAll('select').forEach(el => {
    if (!el.tomselect) {
      new TomSelect(el, {
        create: false,
        sortField: { field: 'text', direction: 'asc' },
        placeholder: 'Select...',
        allowEmptyOption: true
      });
    }
  });
}
