import { buildCrudPage } from './layout.js';

buildCrudPage({
  title: 'Locations', navId: 'locations', endpoint: '/locations', entityName: 'Location',
  columns: ['Name', 'Address', 'City', 'Country'],
  formFields: [
    { id: 'f-name', label: 'Location Name', type: 'text', required: true, field: 'name' },
    { id: 'f-address', label: 'Address', type: 'text', field: 'address' },
    { type: 'row-start' },
    { id: 'f-city', label: 'City', type: 'text', field: 'city' },
    { id: 'f-country', label: 'Country', type: 'text', field: 'country' },
    { type: 'row-end' },
  ],
  buildRow: (item) => `<td><strong>${item.name}</strong></td><td>${item.address || '-'}</td><td>${item.city || '-'}</td><td>${item.country || '-'}</td>`,
  parseForm: () => ({
    name: document.getElementById('f-name').value,
    address: document.getElementById('f-address').value || undefined,
    city: document.getElementById('f-city').value || undefined,
    country: document.getElementById('f-country').value || undefined,
  })
});
