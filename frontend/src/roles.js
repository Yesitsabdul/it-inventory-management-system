import { buildCrudPage } from './layout.js';

buildCrudPage({
  title: 'Roles',
  navId: 'roles',
  endpoint: '/roles',
  entityName: 'Role',
  formFields: [
    { id: 'f-name', label: 'Role Name', type: 'text', required: true, field: 'name' },
    { id: 'f-description', label: 'Description', type: 'textarea', field: 'description' }
  ],
  columns: ['Name', 'Description', 'Users'],
  buildRow: (item) => `
    <td><strong>${item.name}</strong></td>
    <td>${item.description || '-'}</td>
    <td>
      ${item.userCount > 0
        ? `<span class="badge badge-purple">${item.userCount} user${item.userCount !== 1 ? 's' : ''}</span>`
        : `<span style="color:var(--text-muted)">—</span>`}
    </td>
  `,
  canDelete: (item) => item.userCount === 0,
  deleteBlockedMsg: (item) => `Role "${item.name}" is assigned to ${item.userCount} user(s). Reassign them before deleting.`,
  parseForm: () => {
    return {
      name: document.getElementById('f-name').value,
      description: document.getElementById('f-description').value || undefined
    };
  }
});
