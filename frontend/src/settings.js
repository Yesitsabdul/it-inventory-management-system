import { apiFetch } from './api.js';
import { renderLayout, showToast } from './layout.js';

function buildPageHtml() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Manage global configuration for the application</p>
      </div>
    </div>
    <div style="max-width: 600px;">
      <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem;">General Settings</h2>
        
        <form id="prefixForm">
          <div class="form-group">
            <label class="form-label" for="f-company_prefix">Company Prefix</label>
            <p class="form-hint" style="margin-bottom: 0.75rem;">This prefix is automatically added to all new Employee Numbers.</p>
            <div style="display:flex; gap: 1rem; align-items: flex-start;">
              <input type="text" id="f-company_prefix" class="form-control" style="max-width: 200px;" required />
              <button type="submit" class="btn btn-primary" id="savePrefixBtn">Save</button>
            </div>
            <div id="prefixError" style="color: var(--status-danger); font-size: 0.85rem; margin-top: 0.5rem; display: none;"></div>
          </div>
        </form>
      </div>
    </div>
  `;
}

renderLayout(buildPageHtml(), 'settings');

async function loadSettings() {
  try {
    const res = await apiFetch('/settings/COMPANY_PREFIX');
    document.getElementById('f-company_prefix').value = res.value || '';
  } catch (err) {
    showToast('Failed to load settings', 'error');
  }
}

document.getElementById('prefixForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('savePrefixBtn');
  const errEl = document.getElementById('prefixError');
  const prefix = document.getElementById('f-company_prefix').value.trim().toUpperCase();
  
  if (!prefix) return;

  btn.textContent = 'Saving...';
  btn.disabled = true;
  errEl.style.display = 'none';

  try {
    await apiFetch('/settings/COMPANY_PREFIX', {
      method: 'PATCH',
      body: JSON.stringify({ value: prefix })
    });
    showToast('Company prefix updated successfully', 'success');
  } catch (err) {
    errEl.textContent = Array.isArray(err.message) ? err.message[0] : err.message;
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Save';
    btn.disabled = false;
  }
});

loadSettings();
