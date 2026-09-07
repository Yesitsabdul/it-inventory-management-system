import { buildCrudPage, initSelects } from './layout.js';
import { apiFetch } from './api.js';

async function populateDropdowns() {
  try {
    const locs = await apiFetch('/locations?limit=100');
    const sel = document.getElementById('f-location_id');
    if (sel) sel.innerHTML = '<option value="">None</option>' + locs.data.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
    initSelects(document.getElementById('crudForm'));
  } catch (e) { console.error(e); }
}

window._onModalOpen = populateDropdowns;

buildCrudPage({
  title: 'Departments', navId: 'departments', endpoint: '/departments', entityName: 'Department',
  columns: ['Name', 'Location'],
  formFields: [
    { id: 'f-name', label: 'Department Name', type: 'text', required: true, field: 'name' },
    { id: 'f-location_id', label: 'Location', type: 'select', field: 'location_id', options: [] },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td><td>${item.location?.name || '-'}</td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    location_id: parseInt(document.getElementById('f-location_id').value) || undefined,
  })
});
