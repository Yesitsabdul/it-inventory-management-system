import { buildCrudPage } from './layout.js';

buildCrudPage({
  title: 'Vendors', navId: 'vendors', endpoint: '/vendors', entityName: 'Vendor',
  columns: ['Name', 'Contact', 'Email', 'Phone'],
  formFields: [
    { id: 'f-name', label: 'Company Name', type: 'text', required: true, field: 'name' },
    { type: 'row-start' },
    { id: 'f-contact_name', label: 'Contact Person', type: 'text', field: 'contact_name' },
    { id: 'f-email', label: 'Email', type: 'email', field: 'email' },
    { type: 'row-end' },
    { id: 'f-phone', label: 'Phone', type: 'text', field: 'phone' },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td><td>${item.contact_name || '-'}</td><td>${item.email || '-'}</td><td>${item.phone || '-'}</td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    contact_name: document.getElementById('f-contact_name').value || undefined,
    email: document.getElementById('f-email').value || undefined,
    phone: document.getElementById('f-phone').value || undefined,
  })
});
