import { buildCrudPage, initSelects } from './layout.js';
import { apiFetch } from './api.js';

let companyPrefix = 'HB-';

async function populateDropdowns() {
  try {
    const [models, locs, vendors, prefixRes] = await Promise.all([
      apiFetch('/models?limit=100'),
      apiFetch('/locations?limit=100'),
      apiFetch('/vendors?limit=100'),
      apiFetch('/settings/COMPANY_PREFIX').catch(() => ({ value: 'HB' }))
    ]);
    const opts = (data) => '<option value="">Select...</option>' + data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    document.getElementById('f-model_id').innerHTML = opts(models.data);
    document.getElementById('f-location_id').innerHTML = '<option value="">None</option>' + locs.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    document.getElementById('f-vendor_id').innerHTML = '<option value="">None</option>' + vendors.data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');
    initSelects(document.getElementById('crudForm'));

    // Handle company prefix for Asset Tag
    let p = prefixRes?.value || 'HB';
    if (!p.endsWith('-')) p += '-';
    companyPrefix = p;

    // Inject the prefix addon into the Asset Tag input group
    const assetTagInput = document.getElementById('f-asset_tag');
    if (assetTagInput) {
      const parent = assetTagInput.parentElement;
      const wrap = document.createElement('div');
      wrap.className = 'emp-prefix-group';
      
      const addon = document.createElement('div');
      addon.className = 'prefix-addon';
      addon.id = 'asset-prefix-addon';
      addon.textContent = companyPrefix;
      
      const inputWrap = document.createElement('div');
      inputWrap.style.flex = '1';
      
      parent.insertBefore(wrap, assetTagInput);
      inputWrap.appendChild(assetTagInput);
      wrap.appendChild(addon);
      wrap.appendChild(inputWrap);
    }
  } catch (e) { console.error(e); }
}

populateDropdowns();

buildCrudPage({
  title: 'Assets', navId: 'assets', endpoint: '/assets', entityName: 'Asset',
  columns: ['Tag', 'Type', 'Name', 'Model', 'Qty', 'Location', 'Cost'],
  formFields: [
    { type: 'row-start' },
    { id: 'f-asset_tag', label: 'Asset Tag', type: 'text', required: true, field: 'asset_tag' },
    { id: 'f-name', label: 'Name', type: 'text', field: 'name' },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-model_id', label: 'Model', type: 'select', required: true, field: 'model_id', options: [] },

    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-location_id', label: 'Location', type: 'select', field: 'location_id', options: [] },
    { id: 'f-vendor_id', label: 'Vendor', type: 'select', field: 'vendor_id', options: [] },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-serial_number', label: 'Serial Number', type: 'text', field: 'serial_number' },
    { id: 'f-purchase_cost', label: 'Purchase Cost', type: 'number', step: '0.01', min: '0', field: 'purchase_cost' },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-quantity', label: 'Quantity', type: 'number', step: '1', field: 'quantity', required: false },
    { type: 'row-end' },
    { type: 'row-start' },
    { id: 'f-purchase_date', label: 'Purchase Date', type: 'date', field: 'purchase_date' },
    { id: 'f-warranty_expiry', label: 'Warranty Expiry', type: 'date', field: 'warranty_expiry' },
    { type: 'row-end' },
    { id: 'f-notes', label: 'Notes', type: 'textarea', field: 'notes' },
  ],
  buildRow: (item) => {
    let typeVal = item.model?.category?.type || 'asset';
    let typeBadge = typeVal === 'accessory' ? 'Accessory' : (typeVal === 'component' ? 'Component' : 'Asset');
    return `<td><strong>${item.asset_tag}</strong></td>
      <td><span style="font-size:0.8rem; background:var(--bg-secondary); padding:0.2rem 0.4rem; border-radius:4px">${typeBadge}</span></td>
      <td>${item.name || '-'}</td>
      <td>${item.model?.name || '-'}</td>
      <td>${item.quantity ?? 1}</td>
      <td>${item.location?.name || '-'}</td>
      <td>${item.purchase_cost ? 'Rs ' + Number(item.purchase_cost).toFixed(2) : '-'}</td>`;
  },
  parseForm: () => {
    let assetTagPart = document.getElementById('f-asset_tag').value.trim();
    return {
      asset_tag: assetTagPart ? (companyPrefix + assetTagPart) : '',
      name: document.getElementById('f-name').value || undefined,
      serial_number: document.getElementById('f-serial_number').value || undefined,
      purchase_cost: parseFloat(document.getElementById('f-purchase_cost').value) || undefined,
      quantity: parseInt(document.getElementById('f-quantity').value) || 1,
      purchase_date: document.getElementById('f-purchase_date').value || undefined,
      warranty_expiry: document.getElementById('f-warranty_expiry').value || undefined,
      notes: document.getElementById('f-notes').value || undefined,
      model_id: parseInt(document.getElementById('f-model_id').value),

      location_id: parseInt(document.getElementById('f-location_id').value) || undefined,
      vendor_id: parseInt(document.getElementById('f-vendor_id').value) || undefined,
    };
  }
});

// Hook to strip existing alphabetic prefix when editing an asset
window._onEditModalOpen = (item) => {
  let tag = item.asset_tag || '';
  const match = tag.match(/^[A-Za-z]+-?(.*)$/);
  if (match) {
    document.getElementById('f-asset_tag').value = match[1];
  }
};
