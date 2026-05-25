import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { CtxProvider } from './state/ctx.jsx';
// Self-hosted Cinzel display face (bundled by Vite) — no network dependency, so
// the masthead renders correctly fully offline at the table.
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <CtxProvider>
        <App />
      </CtxProvider>
    </HashRouter>
  </React.StrictMode>
);
