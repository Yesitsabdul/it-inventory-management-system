import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        assets: resolve(__dirname, 'assets.html'),
        assignments: resolve(__dirname, 'assignments.html'),
        auditLogs: resolve(__dirname, 'audit-logs.html'),
        maintenance: resolve(__dirname, 'maintenance.html'),
        settings: resolve(__dirname, 'settings.html'),
      }
    }
  }
});
