import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { CtxProvider } from './state/ctx.jsx';
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
