import { apiFetch } from './api.js';
import { renderLayout } from './layout.js';

let currentPage = 1;

async function loadData() {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = `<tr><td colspan="5" class="page-loader"><div class="loader"></div></td></tr>`;
  try {
    const res = await apiFetch(`/audit-logs?page=${currentPage}&limit=20`);
    if (res.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-state">
        <div class="empty-state-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div class="empty-state-text">No audit logs found</div>
        <div class="empty-state-hint">System actions will appear here</div>
      </td></tr>`;
      return;
    }
    
    tbody.innerHTML = res.data.map(log => {
      let color = 'info';
      if (log.action === 'CREATE') color = 'success';
      if (log.action === 'UPDATE') color = 'warning';
      if (log.action === 'DELETE') color = 'danger';
      
      const userStr = log.user ? `${log.user.email}` : 'System';
      const detailsStr = log.details ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem">${log.details}</div>` : '';
      
      return `<tr>
        <td><span class="badge badge-${color}">${log.action}</span></td>
        <td><strong>${log.entity_type}</strong></td>
        <td>#${log.entity_id}</td>
        <td>${userStr}</td>
        <td>${detailsStr || '-'}</td>
      </tr>`;
    }).join('');
    
    document.getElementById('pageInfo').textContent = `Page ${res.meta.page} of ${res.meta.lastPage || 1}`;
    document.getElementById('tableCount').textContent = `${res.meta.total} total`;
    document.getElementById('prevBtn').disabled = res.meta.page <= 1;
    document.getElementById('nextBtn').disabled = res.meta.page >= (res.meta.lastPage || 1);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--accent-rose);text-align:center;padding:2rem">${err.message}</td></tr>`;
  }
}

function init() {
  if (!localStorage.getItem('token')) { window.location.href = '/login.html'; return; }

  const html = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Audit Logs</h1>
        <p class="page-subtitle">Read-only system activity trail</p>
      </div>
    </div>
    <div class="card table-wrapper">
      <div class="table-toolbar">
        <span style="font-size:0.875rem; color:var(--text-secondary)">Showing recent system activity</span>
        <span id="tableCount" style="font-size:0.78rem; color:var(--text-muted)"></span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Entity</th>
            <th>ID</th>
            <th>User</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
      <div class="table-footer">
        <span id="pageInfo">Page 1</span>
        <div style="display:flex;gap:0.5rem">
          <button id="prevBtn" class="btn btn-secondary btn-sm">Prev</button>
          <button id="nextBtn" class="btn btn-secondary btn-sm">Next</button>
        </div>
      </div>
    </div>
  `;

  renderLayout(html, 'audit-logs');
  
  document.getElementById('prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; loadData(); } });
  document.getElementById('nextBtn').addEventListener('click', () => { currentPage++; loadData(); });
  
  loadData();
}

init();
