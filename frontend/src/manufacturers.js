import { buildCrudPage } from './layout.js';

buildCrudPage({
  title: 'Manufacturers', navId: 'manufacturers', endpoint: '/manufacturers', entityName: 'Manufacturer',
  columns: ['Name', 'Support URL', 'Support Email'],
  formFields: [
    { id: 'f-name', label: 'Name', type: 'text', required: true, field: 'name' },
    { type: 'row-start' },
    { id: 'f-support_url', label: 'Support URL', type: 'url', field: 'support_url', placeholder: 'https://example.com/support' },
    { id: 'f-support_email', label: 'Support Email', type: 'email', field: 'support_email', placeholder: 'support@example.com' },
    { type: 'row-end' },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td>
    <td>${item.support_url ? `<a href="${item.support_url}" target="_blank" style="font-size:0.8rem">${item.support_url}</a>` : '-'}</td>
    <td>${item.support_email || '-'}</td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    support_url: document.getElementById('f-support_url').value || undefined,
    support_email: document.getElementById('f-support_email').value || undefined,
  })
});
