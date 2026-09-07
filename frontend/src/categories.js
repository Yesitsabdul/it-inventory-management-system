import { buildCrudPage, initSelects } from './layout.js';
import { apiFetch } from './api.js';

async function populateDropdowns() {
  try {
    const typesRes = await apiFetch('/item-types?limit=100');
    const typeSelect = document.getElementById('f-type_id');
    if (typeSelect) {
      typeSelect.innerHTML = '<option value="">Select...</option>' + 
        typesRes.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    }
    initSelects(document.getElementById('crudForm'));
  } catch (e) { console.error(e); }
}

buildCrudPage({
  title: 'Categories', navId: 'categories', endpoint: '/categories', entityName: 'Category',
  columns: ['Name', 'Type'],
  formFields: [
    { id: 'f-name', label: 'Category Name', type: 'text', required: true, field: 'name' },
    { id: 'f-type_id', label: 'Type', type: 'select', required: true, field: 'type_id', options: [] },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td><td><span class="badge badge-info">${item.type ? item.type.name : '—'}</span></td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    type_id: parseInt(document.getElementById('f-type_id').value) || undefined,
  })
});

populateDropdowns();

