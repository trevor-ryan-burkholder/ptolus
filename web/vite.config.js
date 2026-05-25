import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base: './' makes all asset paths relative, so the app works at any GitHub
// Pages subpath (https://user.github.io/<repo>/) without extra config.
// Routing uses HashRouter, so deep links + refresh work on Pages too.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // Service worker: precache the built app + bundled game data so the runner
    // works fully offline at the table. autoUpdate + cleanupOutdatedCaches means
    // a bad cache self-heals on the next deploy rather than locking users in.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, // keep the themed public/manifest.webmanifest
      includeAssets: ['icon.svg', 'manifest.webmanifest'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,woff,woff2,webmanifest}'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // Library chunk bundles all markdown
      },
      devOptions: { enabled: false }, // don't register the SW during `npm run dev`
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
