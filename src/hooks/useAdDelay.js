/**
 * useAdDelay — returns true after 4 minutes from first page visit.
 * Persists via sessionStorage so a full page refresh resets it.
 */
import { useState, useEffect } from 'react';

const DELAY_MS = 4 * 60 * 1000; // 4 minutes
const STORAGE_KEY = '1m_visit_start';

export function useAdDelay() {
  const [ready, setReady] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) {
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
        return false;
      }
      return Date.now() - parseInt(stored, 10) >= DELAY_MS;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (ready) return;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) || Date.now().toString();
      const elapsed = Date.now() - parseInt(stored, 10);
      const remaining = Math.max(0, DELAY_MS - elapsed);
      if (remaining === 0) { setReady(true); return; }
      const timer = setTimeout(() => setReady(true), remaining);
      return () => clearTimeout(timer);
    } catch {
      const timer = setTimeout(() => setReady(true), DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  return ready;
}