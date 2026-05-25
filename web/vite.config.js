import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes all asset paths relative, so the app works at any GitHub
// Pages subpath (https://user.github.io/<repo>/) without extra config.
// Routing uses HashRouter, so deep links + refresh work on Pages too.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
