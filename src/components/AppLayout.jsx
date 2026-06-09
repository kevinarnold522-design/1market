import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import WaveTransition from './WaveTransition';
import { subscribeWave, isWaveActive } from '@/lib/waveTransition';

export default function AppLayout() {
  const [waveActive, setWaveActive] = useState(isWaveActive());
  useEffect(() => subscribeWave(setWaveActive), []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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