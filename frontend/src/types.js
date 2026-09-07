import { buildCrudPage } from './layout.js';

buildCrudPage({
  title: 'Item Types',
  navId: 'types',
  endpoint: '/item-types',
  entityName: 'Type',
  columns: ['Name', 'Categories'],
  formFields: [
    { id: 'f-name', label: 'Type Name', type: 'text', required: true, field: 'name', placeholder: 'e.g., Asset, Furniture, Software' }
  ],
  buildRow: (item) => `
    <td><strong>${item.name}</strong></td>
    <td>
      ${item.referenceCount > 0
        ? `<span class="badge badge-purple">${item.referenceCount} category${item.referenceCount !== 1 ? 'ies' : ''}</span>`
        : `<span style="color:var(--text-muted)">—</span>`}
    </td>
  `,
  canDelete: (item) => item.referenceCount === 0,
  deleteBlockedMsg: (item) => `Type "${item.name}" is used by ${item.referenceCount} category(ies). Please reassign them first.`,
  parseForm: () => ({
    name: document.getElementById('f-name').value
  })
});
