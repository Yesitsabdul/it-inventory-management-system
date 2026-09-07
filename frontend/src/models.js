import { buildCrudPage, initSelects } from './layout.js';
import { apiFetch } from './api.js';

async function populateDropdowns() {
  try {
    const [mfrs, cats] = await Promise.all([
      apiFetch('/manufacturers?limit=100'),
      apiFetch('/categories?limit=100')
    ]);
    const m = document.getElementById('f-manufacturer_id');
    const c = document.getElementById('f-category_id');
    if (m) m.innerHTML = '<option value="">Select...</option>' + mfrs.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    if (c) c.innerHTML = '<option value="">Select...</option>' + cats.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    initSelects(document.getElementById('crudForm'));
  } catch (e) { console.error(e); }
}

populateDropdowns();

buildCrudPage({
  title: 'Models', navId: 'models', endpoint: '/models', entityName: 'Model',
  columns: ['Name', 'Model #', 'Unique ID', 'Manufacturer', 'Category'],
  formFields: [
    { type: 'row-start' },
    { id: 'f-name', label: 'Model Name', type: 'text', required: true, field: 'name' },
    { id: 'f-model_number', label: 'Model Number', type: 'text', field: 'model_number' },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-manufacturer_id', label: 'Manufacturer', type: 'select', required: true, field: 'manufacturer_id', options: [] },
    { id: 'f-category_id', label: 'Category', type: 'select', required: true, field: 'category_id', options: [] },
    { type: 'row-end' },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td><td>${item.model_number || '-'}</td><td style="font-family:monospace;font-size:0.8rem">${item.unique_id}</td><td>${item.manufacturer?.name || '-'}</td><td>${item.category?.name || '-'}</td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    model_number: document.getElementById('f-model_number').value || undefined,
    manufacturer_id: parseInt(document.getElementById('f-manufacturer_id').value),
    category_id: parseInt(document.getElementById('f-category_id').value),
  })
});
