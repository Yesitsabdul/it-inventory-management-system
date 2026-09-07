import { apiFetch } from './api.js';
import { renderLayout, showToast, confirmAction, initSelects } from './layout.js';

let currentPage = 1;

async function loadData() {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = `<tr><td colspan="6" class="page-loader"><div class="loader"></div></td></tr>`;
  try {
    const res = await apiFetch(`/asset-assignments?page=${currentPage}&limit=15`);
    if (res.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">
        <div class="empty-state-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        </div>
        <div class="empty-state-text">No assignments found</div>
        <div class="empty-state-hint">Click "Checkout Asset" to create one</div>
      </td></tr>`;
      return;
    }
    
    tbody.innerHTML = res.data.map(item => {
      const isCheckedIn = !!item.checkin_at;
      return `<tr>
        <td><input type="checkbox" class="row-checkbox" value="${item.id}"></td>
        <td><strong>${item.asset?.asset_tag || '-'}</strong></td>
        <td>${item.assigned_to?.first_name} ${item.assigned_to?.last_name}</td>
        <td>${new Date(item.checkout_at).toLocaleDateString()}</td>
        <td>${item.expected_checkin ? new Date(item.expected_checkin).toLocaleDateString() : '-'}</td>
        <td><span class="badge ${isCheckedIn ? 'badge-success' : 'badge-warning'}">${isCheckedIn ? 'Checked In' : 'Checked Out'}</span></td>
        <td class="action-btns">
          ${!isCheckedIn && item.asset ? `<button class="btn btn-secondary btn-sm checkin-btn" data-id="${item.id}" data-asset-id="${item.asset.id}">Check In</button>` : (!item.asset ? '<span style="color:var(--status-danger);font-size:0.75rem;">Asset Deleted</span>' : '')}
          <button class="btn-icon btn-icon-danger del-btn" data-id="${item.id}" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </td>
      </tr>`;
    }).join('');
    
    document.getElementById('pageInfo').textContent = `Page ${res.meta.page} of ${res.meta.lastPage || 1}`;
    document.getElementById('tableCount').textContent = `${res.meta.total} total`;
    document.getElementById('prevBtn').disabled = res.meta.page <= 1;
    document.getElementById('nextBtn').disabled = res.meta.page >= (res.meta.lastPage || 1);
    
    document.getElementById('nextBtn').disabled = res.meta.page >= (res.meta.lastPage || 1);
    
    bindCheckinButtons();
    updateBatchDelete();
    if(document.getElementById('selectAllCheckbox')) document.getElementById('selectAllCheckbox').checked = false;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--accent-rose);text-align:center;padding:2rem">${err.message}</td></tr>`;
  }
}

function bindCheckinButtons() {
  document.querySelectorAll('.checkin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('ci-asset_id').value = btn.dataset.assetId;
      document.getElementById('checkinModal').classList.add('active');
    });
  });
  
  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmed = await confirmAction('Delete Assignment', 'Are you sure you want to delete this assignment log? This cannot be undone.');
      if (!confirmed) return;
      try {
        await apiFetch(`/asset-assignments/${id}`, { method: 'DELETE' });
        showToast('Assignment deleted', 'success');
        loadData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  });
}

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
async function populateDropdowns() {
  try {
    const [users, assets] = await Promise.all([
      apiFetch('/users?limit=100'),
      apiFetch('/assets?limit=100')
    ]);
    const opts = (data, fn) => '<option value="">Select...</option>' + data.map(x => `<option value="${x.id}">${fn(x)}</option>`).join('');
    const availableAssets = assets.data;
    document.getElementById('co-asset_id').innerHTML = opts(availableAssets, x => `${x.asset_tag} - ${x.name || ''}`);
    document.getElementById('co-assigned_to_id').innerHTML = opts(users.data, x => `${x.first_name} ${x.last_name}`);
    initSelects(document.getElementById('checkoutModal'));
  } catch (e) { console.error(e); }
}

function init() {
  if (!localStorage.getItem('token')) { window.location.href = '/login.html'; return; }
  const user = JSON.parse(localStorage.getItem('user'));

  const html = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Asset Assignments</h1>
        <p class="page-subtitle">Track checkouts and returns</p>
      </div>
      <button id="checkoutBtn" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>
        Checkout Asset
      </button>
    </div>

    <div class="card table-wrapper">
      <div class="table-toolbar">
        <div style="display:flex; gap:1rem; align-items:center;">
          <button id="batchDeleteBtn" class="btn btn-danger btn-sm" style="display:none;">Batch Delete (<span id="batchCount">0</span>)</button>
          <span style="font-size:0.875rem; color:var(--text-secondary)">Assignment History</span>
        </div>
        <span id="tableCount" style="font-size:0.78rem; color:var(--text-muted)"></span>
      </div>
      <table class="table">
        <thead><tr><th style="width:40px"><input type="checkbox" id="selectAllCheckbox"></th><th>Asset</th><th>Assigned To</th><th>Checkout Date</th><th>Expected Return</th><th>Status</th><th>Actions</th></tr></thead>
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

    <!-- CHECKOUT MODAL -->
    <div class="modal-overlay" id="checkoutModal">
      <div class="card modal-content">
        <div class="modal-header"><h3>Checkout Asset</h3><button class="btn-icon-close" onclick="document.getElementById('checkoutModal').classList.remove('active')" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <form id="checkoutForm">
          <div class="modal-body">
            <div class="modal-error" id="co-err"></div>
            <div class="form-group"><label class="form-label">Asset</label><select id="co-asset_id" class="form-control" required></select></div>
            <div class="form-group"><label class="form-label">Assign To</label><select id="co-assigned_to_id" class="form-control" required></select></div>
            <div class="form-group"><label class="form-label">Expected Return Date</label><input type="date" id="co-expected_checkin" class="form-control" /></div>

            <div class="form-group"><label class="form-label">Notes</label><textarea id="co-notes" class="form-control"></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" id="co-btn">Checkout</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CHECKIN MODAL -->
    <div class="modal-overlay" id="checkinModal">
      <div class="card modal-content">
        <div class="modal-header"><h3>Check In Asset</h3><button class="btn-icon-close" onclick="document.getElementById('checkinModal').classList.remove('active')" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <form id="checkinForm">
          <div class="modal-body">
            <div class="modal-error" id="ci-err"></div>
            <input type="hidden" id="ci-asset_id" />

            <div class="form-group"><label class="form-label">Notes</label><textarea id="ci-notes" class="form-control"></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary" id="ci-btn">Check In</button>
          </div>
        </form>
      </div>
    </div>
  `;

  renderLayout(html, 'assignments');
  populateDropdowns();
  
  document.getElementById('prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; loadData(); } });
  document.getElementById('nextBtn').addEventListener('click', () => { currentPage++; loadData(); });
  document.getElementById('checkoutBtn').addEventListener('click', () => document.getElementById('checkoutModal').classList.add('active'));

  // Checkout submit
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('co-btn'); const err = document.getElementById('co-err');
    btn.textContent = 'Processing...'; btn.disabled = true; err.style.display = 'none';
    try {
      await apiFetch('/asset-assignments/checkout', { method: 'POST', body: JSON.stringify({
        asset_id: parseInt(document.getElementById('co-asset_id').value),
        assigned_to_id: parseInt(document.getElementById('co-assigned_to_id').value),
        assigned_by_id: user.id,
        expected_checkin: document.getElementById('co-expected_checkin').value || undefined,

        notes: document.getElementById('co-notes').value || undefined
      })});
      showToast('Asset checked out successfully', 'success');
      document.getElementById('checkoutModal').classList.remove('active');
      document.getElementById('checkoutForm').reset();
      document.getElementById('checkoutForm').querySelectorAll('select').forEach(el => { if (el.tomselect) el.tomselect.clear(); });
      loadData();
      populateDropdowns();
    } catch (e) {
      err.textContent = e.message; err.style.display = 'block';
    } finally { btn.textContent = 'Checkout'; btn.disabled = false; }
  });

  // Checkin submit
  document.getElementById('checkinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('ci-btn'); const err = document.getElementById('ci-err');
    btn.textContent = 'Processing...'; btn.disabled = true; err.style.display = 'none';
    try {
      await apiFetch('/asset-assignments/checkin', { method: 'POST', body: JSON.stringify({
        asset_id: parseInt(document.getElementById('ci-asset_id').value),

        notes: document.getElementById('ci-notes').value || undefined
      })});
      showToast('Asset checked in successfully', 'success');
      document.getElementById('checkinModal').classList.remove('active');
      document.getElementById('checkinForm').reset();
      document.getElementById('checkinForm').querySelectorAll('select').forEach(el => { if (el.tomselect) el.tomselect.clear(); });
      loadData();
      populateDropdowns();
    } catch (e) {
      err.textContent = e.message; err.style.display = 'block';
    } finally { btn.textContent = 'Check In'; btn.disabled = false; }
  });

  document.getElementById('selectAllCheckbox')?.addEventListener('change', (e) => {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = e.target.checked);
    updateBatchDelete();
  });

  document.getElementById('tbody').addEventListener('change', (e) => {
    if (e.target.classList.contains('row-checkbox')) {
      const all = document.querySelectorAll('.row-checkbox');
      const checked = document.querySelectorAll('.row-checkbox:checked');
      const selectAll = document.getElementById('selectAllCheckbox');
      if(selectAll) selectAll.checked = (all.length > 0 && all.length === checked.length);
      updateBatchDelete();
    }
  });

  document.getElementById('batchDeleteBtn')?.addEventListener('click', async () => {
    const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
    if (selectedIds.length === 0) return;
    const confirmed = await confirmAction('Batch Delete', `Are you sure you want to delete ${selectedIds.length} assignments? This cannot be undone.`);
    if (!confirmed) return;
    
    const btn = document.getElementById('batchDeleteBtn');
    btn.disabled = true;
    btn.textContent = 'Deleting...';
    
    let successCount = 0;
    let errorCount = 0;
    for (const id of selectedIds) {
      try {
        await apiFetch(`/asset-assignments/${id}`, { method: 'DELETE' });
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
    btn.innerHTML = `Batch Delete (<span id="batchCount">0</span>)`;
    btn.style.display = 'none';
    if(document.getElementById('selectAllCheckbox')) document.getElementById('selectAllCheckbox').checked = false;
    loadData();
  });

  loadData();
}

init();
