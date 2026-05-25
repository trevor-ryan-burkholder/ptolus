/* useLocalStorage — persistent state hook for per-tool data (combat, delve, etc.).
 * Mirrors the legacy ptolus-*-v1 keys so data survives reloads. */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw != null ? JSON.parse(raw) : initial; }
    catch { return initial; }
  });
  const ref = useRef(value);
  ref.current = value;

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
  }, [key, value]);

  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, setValue, reset];
}

// read a localStorage JSON value once (for cross-tool reads, e.g. dashboard)
export function readJSON(key, fallback = null) {
  try { const raw = localStorage.getItem(key); return raw != null ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
