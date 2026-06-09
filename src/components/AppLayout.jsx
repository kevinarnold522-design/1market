import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import WaveTransition from './WaveTransition';
import { subscribeWave, isWaveActive, triggerWave } from '@/lib/waveTransition';

export default function AppLayout() {
  const [waveActive, setWaveActive] = useState(isWaveActive());
  useEffect(() => subscribeWave(setWaveActive), []);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Global wave interceptor for listing navigation
  useEffect(() => {
    const handler = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || (!href.startsWith('/listing/') && !href.startsWith('/seller/'))) return;
      if (anchor.target === '_blank') return;
      e.preventDefault();
      triggerWave(() => navigate(href), 420);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [navigate]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar — hidden on mobile, shown on md+ */}
      {!isMobile && <LeftSidebar />}

      {/* Main content — offset by fixed sidebar (220px expanded) */}
      <main
        className="flex-1 min-w-0 overflow-x-hidden"
        style={{ marginLeft: isMobile ? 0 : 220 }}
      >
        <Outlet />
      </main>

      {/* Wave overlay */}
      <WaveTransition active={waveActive} />
    </div>
  );
}