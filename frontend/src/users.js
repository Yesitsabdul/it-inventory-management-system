import { renderLayout, showToast, confirmAction, initSelects } from './layout.js';
import { apiFetch } from './api.js';

if (!localStorage.getItem('token')) { window.location.href = '/login.html'; }

let currentPage = 1;
let editingId = null;
let allData = [];
let roles = [];
let depts = [];
let companyPrefix = 'HB-';

/* ---------- Page HTML ---------- */
function buildPageHtml() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage admin accounts and employee records</p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <div class="dropdown-wrap" id="importDropdownContainer">
          <button id="importDropdownBtn" class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import Options
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div id="importDropdownMenu" class="dropdown-menu">
            <a href="/sample_employees.csv" download class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Sample CSV
            </a>
            <button id="uploadCsvBtn" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload CSV
            </button>
          </div>
        </div>
        <input type="file" id="csvFileInput" accept=".csv" style="display: none;" />
        <button id="newBtn" class="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register User
        </button>
      </div>
    </div>

    <div class="card table-wrapper">
      <div class="table-toolbar">
        <div style="display:flex; gap:1rem; align-items:center;">
          <button id="batchDeleteBtn" class="btn btn-danger btn-sm" style="display:none;">Delete (<span id="batchCount">0</span>)</button>
          <input type="text" class="search-input" id="searchInput" placeholder="Search users..." />
        </div>
        <span id="tableCount" class="table-count"></span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox" id="selectAllCheckbox"></th>
            <th>Name</th>
            <th>Email</th>
            <th>Employee #</th>
            <th>Role</th>
            <th>Type</th>
            <th style="width:100px">Actions</th>
          </tr>
        </thead>
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

    <!-- User Registration Modal -->
    <div class="modal-overlay" id="modal">
      <div class="card modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Register User</h3>
          <button class="btn-icon-close" id="modalClose" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form id="crudForm">
          <div class="modal-body">
            <div class="modal-error" id="modalError"></div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" id="f-first_name" class="form-control" required placeholder="John" />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" id="f-last_name" class="form-control" required placeholder="Doe" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="f-email" class="form-control" required placeholder="john.doe@company.com" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Role</label>
                <select id="f-role_id" class="form-control" required>
                  <option value="">Select a role...</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="f-emp_number">Employee Number</label>
                <div class="emp-prefix-group">
                  <div class="prefix-addon">
                    HB-
                  </div>
                  <div style="flex: 1;">
                    <input type="text" id="f-emp_number" class="form-control" placeholder="001" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Role info hint -->
            <div id="role-hint" style="display:none; margin-bottom:1rem; padding:0.65rem 1rem; border-radius:6px; font-size:0.82rem; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-secondary);"></div>

            <!-- Password — only shown when Admin role is selected -->
            <div class="form-group" id="password-group" style="display:none;">
              <label class="form-label">Password</label>
              <div class="password-field-wrap">
                <input type="password" id="f-password" class="form-control password-input" placeholder="Min. 6 characters" />
                <button type="button" class="password-toggle-btn" tabindex="-1" aria-label="Toggle password">
                  <svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg class="eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="f-department_id">Department</label>
              <select id="f-department_id" class="form-control" required>
                <option value="">Select a department...</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="modalCancel">Cancel</button>
            <button type="submit" class="btn btn-primary" id="saveBtn">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
renderLayout(buildPageHtml(), 'users');
const tbody = document.getElementById('tbody');
const modal = document.getElementById('modal');
const form = document.getElementById('crudForm');
const roleSelect = document.getElementById('f-role_id');
const pwGroup = document.getElementById('password-group');
const roleHint = document.getElementById('role-hint');

async function populateDropdowns() {
  try {
    const [rolesRes, deptsRes, prefixRes] = await Promise.all([
      apiFetch('/roles?limit=100'),
      apiFetch('/departments?limit=100'),
      apiFetch('/settings/COMPANY_PREFIX').catch(() => ({ value: 'HB' }))
    ]);
    roles = rolesRes.data;
    depts = deptsRes.data;

    // Ensure prefix has a hyphen for display
    let p = prefixRes.value || 'HB';
    if (!p.endsWith('-')) p += '-';
    companyPrefix = p;
    
    // Update the UI addon with the dynamically loaded prefix
    const addon = document.querySelector('.prefix-addon');
    if (addon) addon.textContent = companyPrefix;

    roleSelect.innerHTML = '<option value="">Select a role...</option>' +
      roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

    const d = document.getElementById('f-department_id');
    if (d) d.innerHTML = '<option value="">Select a department...</option>' +
      depts.map(x => `<option value="${x.id}">${x.name}</option>`).join('');



    initSelects(document.getElementById('crudForm'));
  } catch (e) { console.error(e); }
}
populateDropdowns();

function isAdminRole(roleId) {
  const role = roles.find(r => r.id === parseInt(roleId));
  return role && role.name.toLowerCase() === 'admin';
}

roleSelect.addEventListener('change', () => {
  const roleId = roleSelect.value;
  if (!roleId) {
    pwGroup.style.display = 'none';
    roleHint.style.display = 'none';
    return;
  }
  const isAdmin = isAdminRole(roleId);
  const role = roles.find(r => r.id === parseInt(roleId));

  if (isAdmin) {
    pwGroup.style.display = 'block';
    roleHint.style.display = 'block';
    roleHint.style.borderColor = 'var(--accent-blue, #3b82f6)';
    roleHint.innerHTML = `<strong>Admin access</strong> — This user will be able to log in to the system. A password is required.`;
  } else {
    pwGroup.style.display = 'none';
    document.getElementById('f-password').value = '';
    roleHint.style.display = 'block';
    roleHint.style.borderColor = 'var(--border-color)';
    roleHint.innerHTML = `<strong>Record only</strong> — "${role?.name}" users are tracked for assignment purposes but cannot log in to the system.`;
  }
});
const toggleBtn = document.querySelector('.password-toggle-btn');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const pwInput = document.getElementById('f-password');
    const eyeOpen = toggleBtn.querySelector('.eye-open');
    const eyeClosed = toggleBtn.querySelector('.eye-closed');
    if (pwInput.type === 'password') {
      pwInput.type = 'text'; eyeOpen.style.display = 'none'; eyeClosed.style.display = 'block';
    } else {
      pwInput.type = 'password'; eyeOpen.style.display = 'block'; eyeClosed.style.display = 'none';
    }
  });
}
async function loadData() {
  tbody.innerHTML = `<tr><td colspan="7" class="page-loader"><div class="loader"></div></td></tr>`;
  try {
    const res = await apiFetch(`/users?page=${currentPage}&limit=15`);
    allData = res.data;
    renderRows(allData);
    document.getElementById('pageInfo').textContent = `Page ${res.meta.page} of ${res.meta.lastPage || 1}`;
    document.getElementById('tableCount').textContent = `${res.meta.total} records`;
    document.getElementById('prevBtn').disabled = res.meta.page <= 1;
    document.getElementById('nextBtn').disabled = res.meta.page >= (res.meta.lastPage || 1);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><div class="empty-state-text">${err.message}</div></td></tr>`;
  }
}

const dropdownBtn = document.getElementById('importDropdownBtn');
const dropdownMenu = document.getElementById('importDropdownMenu');
const uploadCsvBtn = document.getElementById('uploadCsvBtn');
const csvFileInput = document.getElementById('csvFileInput');

if (dropdownBtn && dropdownMenu && uploadCsvBtn && csvFileInput) {
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });
  uploadCsvBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    csvFileInput.click();
  });
  csvFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dropdownBtn.disabled = true;
    const originalText = dropdownBtn.innerHTML;
    dropdownBtn.innerHTML = 'Importing...';
    e.target.value = '';
    try {
      let text = await file.text();
      text = text.replace(/^\uFEFF/, '');
      function parseCSVRow(row) {
        const result = [];
        let i = 0;
        while (i < row.length) {
          if (row[i] === '"') {
            let field = '';
            i++; 
            while (i < row.length) {
              if (row[i] === '"' && row[i + 1] === '"') { field += '"'; i += 2; }
              else if (row[i] === '"') { i++; break; }
              else { field += row[i++]; }
            }
            result.push(field.trim());
            if (row[i] === ',') i++;
          } else {
            let field = '';
            while (i < row.length && row[i] !== ',') { field += row[i++]; }
            result.push(field.trim());
            if (row[i] === ',') i++;
          }
        }
        return result;
      }
      const lines = text.split(/\r?\n/).map(r => r.trim()).filter(r => r);
      if (lines.length < 2) {
        showToast('CSV file is empty or missing headers', 'error');
        return;
      }
      const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ''));
      const required = ['first name', 'last name', 'email', 'department'];
      if (!required.every(h => headers.includes(h))) {
        showToast('CSV missing required headers: First Name, Last Name, Email, Department', 'error');
        return;
      }

      const fnIdx    = headers.indexOf('first name');
      const lnIdx    = headers.indexOf('last name');
      const emailIdx = headers.indexOf('email');
      const deptIdx  = headers.indexOf('department');
      const empIdx   = headers.indexOf('employee number');
      const data = [];
      const preflight = []; 
      const allParsedRows = []; 
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVRow(lines[i]);

        const rowObj = {
          first_name:      fnIdx < cols.length    ? (cols[fnIdx]    || '') : '',
          last_name:       lnIdx < cols.length    ? (cols[lnIdx]    || '') : '',
          email:           emailIdx < cols.length ? (cols[emailIdx] || '') : '',
          department_name: deptIdx < cols.length  ? (cols[deptIdx]  || '') : '',
          employee_number: empIdx !== -1 && empIdx < cols.length ? (cols[empIdx] || '') : ''
        };
        const isEmpLastAndOptionallyMissing =
          empIdx !== -1 &&
          empIdx === headers.length - 1 &&
          cols.length === headers.length - 1;

        if (cols.length < headers.length && !isEmpLastAndOptionallyMissing) {
          allParsedRows.push(rowObj);
          preflight.push({
            row: i,
            data: rowObj,
            error: `Row has ${cols.length} column(s) but the header has ${headers.length}. A column value is likely missing. If Department is blank, keep the comma: e.g. "First Name,Last Name,Email,,Emp Number"`
          });
          continue;
        }
        allParsedRows.push(rowObj);
        data.push(rowObj);
      }
      if (preflight.length > 0) {
        showImportErrorModal({ success: 0, failed: preflight.length, errors: preflight }, allParsedRows);
        return;
      }
      if (data.length === 0) {
        showToast('No valid data found in CSV', 'error');
        return;
      }
      const res = await apiFetch('/users/bulk-import', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (res.failed > 0) {
        showImportErrorModal(res, allParsedRows);
      } else {
        showToast(`Import complete: ${res.success} user(s) imported successfully.`, 'success');
        currentPage = 1;
        loadData();
      }
    } catch (err) {
      showToast('Import failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      dropdownBtn.innerHTML = originalText;
      dropdownBtn.disabled = false;
    }
  });
}
function showImportErrorModal(res, allParsedRows = []) {
  const existing = document.getElementById('importErrorModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'importErrorModal';
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="card modal-content" style="max-width:420px; width:100%;">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:36px; height:36px; border-radius:50%; background:var(--status-danger-bg); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--status-danger)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 style="margin:0; font-size:1rem; font-weight:600;">Import Failed</h3>
        </div>
        <button class="btn-icon-close" id="importErrorClose" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="padding:1.5rem;">
        <p style="color:var(--text-secondary); font-size:0.9rem; margin:0 0 1.25rem;">
          <strong style="color:var(--status-danger);">${res.failed} row${res.failed !== 1 ? 's' : ''}</strong> contain errors. Nothing was saved. Download the full report below — it includes every row with errors highlighted and valid rows marked as "No errors".
        </p>
        <button class="btn btn-primary" id="downloadErrorCsvBtn" style="width:100%;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Full Report
        </button>
      </div>
      <div class="modal-footer" style="justify-content:flex-end;">
        <button class="btn btn-secondary" id="importErrorClose2">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const closeModal = () => modal.remove();
  document.getElementById('importErrorClose').addEventListener('click', closeModal);
  document.getElementById('importErrorClose2').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.getElementById('downloadErrorCsvBtn').addEventListener('click', () => {
    const csvHeaders = ['First Name', 'Last Name', 'Email', 'Department', 'Employee Number', 'Error'];
    const errorMap = new Map(res.errors.map(e => [e.row, e.error]));
    const sourceRows = allParsedRows.length > 0 ? allParsedRows : res.errors.map(e => e.data);

    const csvRows = sourceRows.map((row, idx) => {
      const rowNum = idx + 1;
      const errorMsg = errorMap.get(rowNum) || 'No errors';
      return [
        row?.first_name      || '',
        row?.last_name       || '',
        row?.email           || '',
        row?.department_name || '',
        row?.employee_number || '',
        errorMsg
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}


function renderRows(data) {
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">
      <div class="empty-state-icon-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="empty-state-text">No users found</div>
      <div class="empty-state-hint">Click "Register User" to add one</div>
    </td></tr>`;
    return;
  }
  const adminCount = allData.filter(d => d.role && d.role.name.toLowerCase() === 'admin').length;

  tbody.innerHTML = data.map(item => {
    const name = `${item.first_name} ${item.last_name}`;
    const roleName = item.role?.name || '';
    const isAdmin = roleName.toLowerCase() === 'admin';
    
    const isSoleAdmin = isAdmin && adminCount <= 1;
    const isReferenced = item.referenceCount && item.referenceCount > 0;
    const cantDelete = isSoleAdmin || isReferenced;
    const cantDeleteReason = isSoleAdmin
      ? 'Cannot delete the sole admin'
      : isReferenced
      ? `In use (${item.referenceCount} assignments)`
      : '';

    return `<tr>
      <td>
        ${!cantDelete 
          ? `<input type="checkbox" class="row-checkbox" value="${item.id}">`
          : `<input type="checkbox" disabled title="${cantDeleteReason}">`
        }
      </td>
      <td><strong>${name}</strong></td>
      <td style="color:var(--text-secondary)">${item.email}</td>
      <td>${item.employee_number || '<span style="color:var(--text-muted)">—</span>'}</td>
      <td><span class="badge badge-purple">${roleName || '—'}</span></td>
      <td><span class="badge ${isAdmin ? 'badge-success' : 'badge-secondary'}">${isAdmin ? 'Login Access' : 'Record Only'}</span></td>
      <td class="action-btns">
        <button class="btn-icon edit-btn" data-id="${item.id}" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        ${!cantDelete ? `
        <button class="btn-icon btn-icon-danger del-btn" data-id="${item.id}" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
        ` : `
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
      const confirmed = await confirmAction('Delete User', 'This action is permanent and cannot be undone.');
      if (!confirmed) return;
      try {
        await apiFetch(`/users/${btn.dataset.id}`, { method: 'DELETE' });
        showToast('User deleted successfully', 'success');
        loadData();
      } catch (err) { showToast(err.message, 'error'); }
    });
  });
}

function resetModal() {
  form.reset();
  form.querySelectorAll('select').forEach(el => {
    if (el.tomselect) el.tomselect.clear();
  });
  pwGroup.style.display = 'none';
  roleHint.style.display = 'none';
  document.getElementById('modalError').style.display = 'none';
}

function openEditModal(item) {
  editingId = item.id;
  resetModal();
  document.getElementById('modalTitle').textContent = 'Edit User';
  document.getElementById('f-first_name').value = item.first_name || '';
  document.getElementById('f-last_name').value = item.last_name || '';
  document.getElementById('f-email').value = item.email || '';
  let eNum = item.employee_number || '';
  const prefixMatch = eNum.match(/^[A-Za-z]+-?(.*)$/);
  if (prefixMatch) {
    eNum = prefixMatch[1];
  }
  document.getElementById('f-emp_number').value = eNum;
  
  const rId = item.role?.id || '';
  document.getElementById('f-role_id').value = rId;
  if (document.getElementById('f-role_id').tomselect) document.getElementById('f-role_id').tomselect.setValue(rId);

  const dId = item.department?.id || '';
  document.getElementById('f-department_id').value = dId;
  if (document.getElementById('f-department_id').tomselect) document.getElementById('f-department_id').tomselect.setValue(dId);
  roleSelect.dispatchEvent(new Event('change'));
  modal.classList.add('active');
}
const closeModal = () => { modal.classList.remove('active'); editingId = null; resetModal(); };
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.getElementById('newBtn').addEventListener('click', () => {
  editingId = null;
  resetModal();
  document.getElementById('modalTitle').textContent = 'Register User';
  modal.classList.add('active');
});
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  const errEl = document.getElementById('modalError');
  btn.textContent = 'Saving...'; btn.disabled = true; errEl.style.display = 'none';
  try {
    let empNumPart = document.getElementById('f-emp_number').value.trim();
    let empNo = empNumPart ? (companyPrefix + empNumPart) : '';
    const body = {
      first_name: document.getElementById('f-first_name').value.trim(),
      last_name: document.getElementById('f-last_name').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      employee_number: empNo || undefined,
      role_id: parseInt(document.getElementById('f-role_id').value),
      department_id: parseInt(document.getElementById('f-department_id').value) || undefined,
    };
    const pw = document.getElementById('f-password').value;
    if (pw) body.password = pw;
    if (editingId) {
      await apiFetch(`/users/${editingId}`, { method: 'PATCH', body: JSON.stringify(body) });
      showToast('User updated', 'success');
    } else {
      await apiFetch('/users', { method: 'POST', body: JSON.stringify(body) });
      showToast('User registered successfully', 'success');
    }
    closeModal(); loadData();
  } catch (err) {
    errEl.textContent = Array.isArray(err.message) ? err.message[0] : err.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Save'; btn.disabled = false;
  }
});

document.getElementById('prevBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; loadData(); } });
document.getElementById('nextBtn').addEventListener('click', () => { currentPage++; loadData(); });
document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  if (!q) { renderRows(allData); return; }
  renderRows(allData.filter(item => JSON.stringify(item).toLowerCase().includes(q)));
});
function updateBatchDelete() {
  const selected = Array.from(document.querySelectorAll('.row-checkbox:checked'));
  const btn = document.getElementById('batchDeleteBtn');
  if (!btn) return;
  btn.style.display = selected.length > 0 ? 'inline-flex' : 'none';
  if (selected.length > 0) document.getElementById('batchCount').textContent = selected.length;
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
  if (!selectedIds.length) return;
  const confirmed = await confirmAction('Batch Delete', `You are about to permanently delete ${selectedIds.length} user(s). This cannot be undone.`);
  if (!confirmed) return;
  let ok = 0, fail = 0;
  for (const id of selectedIds) {
    try { await apiFetch(`/users/${id}`, { method: 'DELETE' }); ok++; } catch { fail++; }
  }
  showToast(fail > 0 ? `Deleted ${ok} (${fail} failed)` : `Deleted ${ok} users`, fail > 0 ? 'warning' : 'success');
  loadData();
});
loadData();
