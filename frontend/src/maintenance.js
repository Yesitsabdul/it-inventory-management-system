import { buildCrudPage, initSelects } from './layout.js';
import { apiFetch } from './api.js';

async function populateDropdowns() {
  try {
    const [assets, users, vendors] = await Promise.all([
      apiFetch('/assets?limit=100'),
      apiFetch('/users?limit=100'),
      apiFetch('/vendors?limit=100')
    ]);
    const opts = (data, format) => '<option value="">Select...</option>' + data.map(x => `<option value="${x.id}">${format(x)}</option>`).join('');
    document.getElementById('f-asset_id').innerHTML = opts(assets.data, x => `${x.asset_tag} - ${x.name || ''}`);
    document.getElementById('f-performed_by_id').innerHTML = '<option value="">None</option>' + users.data.map(x => `<option value="${x.id}">${x.first_name} ${x.last_name}</option>`).join('');
    document.getElementById('f-vendor_id').innerHTML = '<option value="">None</option>' + vendors.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    initSelects(document.getElementById('crudForm'));
  } catch (e) { console.error(e); }
}

window._onModalOpen = populateDropdowns;

buildCrudPage({
  title: 'Maintenance Logs', navId: 'maintenance', endpoint: '/maintenance-logs', entityName: 'Log',
  columns: ['Title', 'Asset', 'Type', 'Start Date', 'Cost', 'Performed By'],
  formFields: [
    { type: 'row-start' },
    { id: 'f-title', label: 'Title', type: 'text', required: true, field: 'title' },
    { id: 'f-type', label: 'Type', type: 'select', field: 'type', options: [{value:'maintenance',label:'Maintenance'}, {value:'repair',label:'Repair'}, {value:'upgrade',label:'Upgrade'}] },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-asset_id', label: 'Asset', type: 'select', required: true, field: 'asset_id', options: [] },
    { id: 'f-vendor_id', label: 'Vendor', type: 'select', field: 'vendor_id', options: [] },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-start_date', label: 'Start Date', type: 'date', field: 'start_date' },
    { id: 'f-completion_date', label: 'Completion Date', type: 'date', field: 'completion_date' },
    { type: 'row-end' },
    { id: 'f-cost', label: 'Cost', type: 'number', step: '0.01', field: 'cost' },
    { id: 'f-performed_by_id', label: 'Performed By (Internal User)', type: 'select', field: 'performed_by_id', options: [] },
    { id: 'f-notes', label: 'Notes', type: 'textarea', field: 'notes' },
  ],
  buildRow: (item) => {
    const perf = item.performed_by ? `${item.performed_by.first_name}` : (item.vendor ? item.vendor.name : '-');
    return `<td><strong>${item.title}</strong></td>
      <td><a href="#">${item.asset?.asset_tag || '-'}</a></td>
      <td><span class="badge badge-warning">${item.type || 'maintenance'}</span></td>
      <td>${item.start_date || '-'}</td>
      <td>${item.cost ? 'Rs ' + Number(item.cost).toFixed(2) : '-'}</td>
      <td>${perf}</td>`;
  },
  parseForm: () => ({
    title: document.getElementById('f-title').value,
    type: document.getElementById('f-type').value || 'maintenance',
    asset_id: parseInt(document.getElementById('f-asset_id').value),
    vendor_id: parseInt(document.getElementById('f-vendor_id').value) || undefined,
    start_date: document.getElementById('f-start_date').value || undefined,
    completion_date: document.getElementById('f-completion_date').value || undefined,
    cost: parseFloat(document.getElementById('f-cost').value) || undefined,
    performed_by_id: parseInt(document.getElementById('f-performed_by_id').value) || undefined,
    notes: document.getElementById('f-notes').value || undefined,
  })
});
