import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// AdManager: shows one ad after a 4-minute delay, no close button, admin exempt
export default function AdManager() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await base44.auth.me();
        if (u?.role === 'admin' || u?.email === 'Kevinarnold522@gmail.com') return;
      } catch {}
      // 4-minute delay before showing the single ad slot
      const t = setTimeout(() => setShow(true), 4 * 60 * 1000);
      return () => clearTimeout(t);
    };
    init();
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 right-4 z-[8000] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto"
      style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.15)', width: 280 }}
    >
      <div className="px-3 py-1.5 border-b border-white/8">
        <span className="font-body text-[9px] text-white/25 uppercase tracking-wider">Sponsored</span>
      </div>
      <div className="p-3 min-h-[90px] flex items-center justify-center">
        <span className="font-body text-xs text-white/15">Advertisement</span>
      </div>
    </div>
  );
}