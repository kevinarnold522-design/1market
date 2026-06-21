import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import FloatingNavbar from './FloatingNavbar';
import WaveTransition from './WaveTransition';
import UserTasks from './UserTasks';
import ThemeCustomizer from './ThemeCustomizer';
import OceanCategoryBackdrop from './home/OceanCategoryBackdrop';
import { subscribeWave, isWaveActive, triggerWave } from '@/lib/waveTransition';
import { useAuth } from '@/lib/AuthContext';

export default function AppLayout() {
  const [waveActive, setWaveActive] = useState(isWaveActive());
  useEffect(() => subscribeWave(setWaveActive), []);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname.startsWith('/listing/') || location.pathname.startsWith('/seller/') || location.pathname.startsWith('/seller-profile/');
  const { user } = useAuth();

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


  return (
    <div data-app-shell className={`relative flex min-h-screen overflow-hidden ${isLandingPage ? '' : 'site-ocean-theme'}`} style={{ background: isLandingPage ? 'var(--landing-bg-gradient)' : 'transparent' }}>
      {!isLandingPage && <OceanCategoryBackdrop global />}
      <main className="relative z-10 flex-1 min-w-0 overflow-x-hidden" style={{ background: isLandingPage ? 'var(--landing-bg-gradient)' : 'transparent' }}>
        <FloatingNavbar />
        <Outlet />
      </main>

      {/* Wave overlay */}
      <WaveTransition active={waveActive} />
      {/* User tasks widget */}
      {user && <UserTasks user={user} />}
      <ThemeCustomizer />
    </div>
  );
}