import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import FloatingNavbar from './FloatingNavbar';
import WaveTransition from './WaveTransition';
import UserTasks from './UserTasks';
import { subscribeWave, isWaveActive, triggerWave } from '@/lib/waveTransition';
import { base44 } from '@/api/base44Client';
import { getGhostSession } from '@/lib/ghostAccounts';

export default function AppLayout() {
  const [waveActive, setWaveActive] = useState(isWaveActive());
  useEffect(() => subscribeWave(setWaveActive), []);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState(null);
  useEffect(() => {
    const refresh = () => {
      const ghost = getGhostSession();
      if (ghost) { setAppUser(null); return; }
      base44.auth.me().then(setAppUser).catch(() => {});
    };
    refresh();
    window.addEventListener('ghost-session-changed', refresh);
    return () => window.removeEventListener('ghost-session-changed', refresh);
  }, []);

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
      {/* Left Sidebar — desktop only */}
      {!isMobile && <LeftSidebar isMobileHidden={false} />}

      {/* Main content — offset by sidebar width on desktop */}
      <main
        className="flex-1 min-w-0 overflow-x-hidden"
        style={{ marginLeft: isMobile ? 0 : (220) }}
      >
        <FloatingNavbar />
        <Outlet />
      </main>

      {/* Wave overlay */}
      <WaveTransition active={waveActive} />
      {/* User tasks widget */}
      {appUser && <UserTasks user={appUser} />}
    </div>
  );
}