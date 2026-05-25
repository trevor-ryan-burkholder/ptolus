import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import { CATALOG } from './catalog.js';

// auto-wire routes from the catalog; each entry's `component` maps to ./pages/<component>.jsx
const modules = import.meta.glob('./pages/*.jsx');
function lazyPage(component) {
  const loader = modules['./pages/' + component + '.jsx'];
  return loader ? lazy(loader) : null;
}

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: 20, color: '#9a9384' }}>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        {CATALOG.map((t) => {
          const C = lazyPage(t.component);
          return C ? <Route key={t.path} path={'/' + t.path} element={<C />} /> : null;
        })}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
