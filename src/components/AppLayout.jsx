import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FloatingNavbar from './FloatingNavbar';
import UserTasks from './UserTasks';
import ThemeCustomizer from './ThemeCustomizer';
import OceanCategoryBackdrop from './home/OceanCategoryBackdrop';
import { useAuth } from '@/lib/AuthContext';

export default function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname.startsWith('/listing/') || location.pathname.startsWith('/seller/') || location.pathname.startsWith('/seller-profile/');
  const { user } = useAuth();

  // Direct navigation for faster page changes.


  return (
    <div data-app-shell className={`relative flex min-h-screen overflow-hidden ${isLandingPage ? '' : 'site-ocean-theme'}`} style={{ background: isLandingPage ? 'var(--landing-bg-gradient)' : 'transparent' }}>
      {!isLandingPage && <OceanCategoryBackdrop global />}
      <main className="relative z-10 flex-1 min-w-0 overflow-x-hidden" style={{ background: isLandingPage ? 'var(--landing-bg-gradient)' : 'transparent' }}>
        <FloatingNavbar />
        <Outlet />
      </main>

      {/* User tasks widget */}
      {user && <UserTasks user={user} />}
      <ThemeCustomizer />
    </div>
  );
}