import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import FloatingNavbar from './FloatingNavbar';
import WaveTransition from './WaveTransition';
import UserTasks from './UserTasks';
import ThemeCustomizer from './ThemeCustomizer';
import { subscribeWave, isWaveActive, triggerWave } from '@/lib/waveTransition';
import { base44 } from '@/api/base44Client';
import { getGhostSession } from '@/lib/ghostAccounts';

export default function AppLayout() {
  const [waveActive, setWaveActive] = useState(isWaveActive());
  useEffect(() => subscribeWave(setWaveActive), []);
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState(null);
  useEffect(() => {
    const refresh = () => {
      const ghost = getGhostSession();
      if (ghost) { setAppUser(null); return; }
      base44.auth.me().then(setAppUser).catch(() => setAppUser(null));
    };
    refresh();
    window.addEventListener('ghost-session-changed', refresh);
    window.addEventListener('supabase-auth-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('ghost-session-changed', refresh);
      window.removeEventListener('supabase-auth-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
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


  return (
    <div data-app-shell className="flex min-h-screen" style={{ background: 'var(--landing-bg-gradient)' }}>
      <main className="flex-1 min-w-0 overflow-x-hidden" style={{ background: 'var(--landing-bg-gradient)' }}>
        <div className="fixed top-3 right-4 z-[140] flex items-center gap-2 rounded-full bg-[#001a80]/70 border border-white/15 px-2 py-1.5 backdrop-blur-xl shadow-2xl">
          <Link to="/about" className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all">
            About Us
          </Link>
          <Link to="/privacy-policy" className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all">
            Privacy Policy
          </Link>
          <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/1marketph/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)' }}>
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading text-sm font-black hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg,#010101,#25F4EE,#FE2C55)' }}>
            ♪
          </a>
          <a href="https://www.youtube.com/@1marketph" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform">
            <Youtube className="w-4 h-4" />
          </a>
        </div>
        <FloatingNavbar />
        <Outlet />
      </main>

      {/* Wave overlay */}
      <WaveTransition active={waveActive} />
      {/* User tasks widget */}
      {appUser && <UserTasks user={appUser} />}
      <ThemeCustomizer />
    </div>
  );
}