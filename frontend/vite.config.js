import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'index.html'),
        login:         resolve(__dirname, 'login.html'),
        assets:        resolve(__dirname, 'assets.html'),
        assignments:   resolve(__dirname, 'assignments.html'),
        auditLogs:     resolve(__dirname, 'audit-logs.html'),
        maintenance:   resolve(__dirname, 'maintenance.html'),
        settings:      resolve(__dirname, 'settings.html'),
        // Setup pages
        users:         resolve(__dirname, 'setup/users.html'),
        roles:         resolve(__dirname, 'setup/roles.html'),
        departments:   resolve(__dirname, 'setup/departments.html'),
        locations:     resolve(__dirname, 'setup/locations.html'),
        types:         resolve(__dirname, 'setup/types.html'),
        categories:    resolve(__dirname, 'setup/categories.html'),
        manufacturers: resolve(__dirname, 'setup/manufacturers.html'),
        vendors:       resolve(__dirname, 'setup/vendors.html'),
        models:        resolve(__dirname, 'setup/models.html'),
      }
    }
  }
});
