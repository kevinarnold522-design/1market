import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plane, UtensilsCrossed, ShoppingBag, Car, Wrench, Briefcase, Users, Heart, MessageSquare, Bell, User, ChevronLeft, ChevronRight, ShoppingCart, Package, BarChart2, Settings, LogOut, Shield, KeyRound, Ghost, HelpCircle, Info, FileText, Layers } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import PostListingMenu from './PostListingMenu';
import MetaVerifiedBadge from './MetaVerifiedBadge';
import { getImpersonatedUser } from '@/pages/ConnectedAccounts';

const NAV_ITEMS = [
  { to: '/',           icon: Home,           label: 'Home',         color: '#00D4FF' },
  { to: '/travel',     icon: Plane,          label: 'Travel',       color: '#0ea5e9' },
  { to: '/food',       icon: UtensilsCrossed, label: 'Food',        color: '#f97316' },
  { to: '/buysell',    icon: ShoppingBag,    label: 'Buy & Sell',   color: '#8b5cf6' },
  { to: '/rent',       icon: KeyRound,       label: 'Rent / Sale',  color: '#10b981' },
  { to: '/services',   icon: Wrench,         label: 'Services',     color: '#3b82f6' },
  { to: '/jobs',       icon: Briefcase,      label: 'Jobs',         color: '#f59e0b' },
  { to: '/community',  icon: Users,          label: 'Community',    color: '#a855f7' },
  { to: '/groups',     icon: Layers,         label: 'Groups',       color: '#ec4899' },
];

// Philippines Cities Data
const PHILIPPINES_CITIES = {
  'Luzon (72 Cities)': {
    'National Capital Region (Metro Manila)': ['Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela'],
    'Region I (Ilocos Region)': ['Alaminos', 'Batac', 'Candon', 'Dagupan', 'Laoag', 'San Fernando (La Union)', 'Urdaneta', 'Vigan'],
    'Cordillera Administrative Region (CAR)': ['Baguio', 'Tabuk'],
    'Region II (Cagayan Valley)': ['Cauayan', 'Ilagan', 'Santiago', 'Tuguegarao'],
    'Region III (Central Luzon)': ['Angeles', 'Balanga', 'Baliwag', 'Cabanatuan', 'Gapan', 'Mabalacat', 'Malolos', 'Meycauayan', 'Muñoz', 'Olongapo', 'Palayan', 'San Fernando (Pampanga)', 'San Jose', 'San Jose del Monte', 'Tarlac City'],
    'Region IV-A (Calabarzon)': ['Antipolo', 'Bacoor', 'Biñan', 'Cabuyao', 'Calamba', 'Carmona', 'Cavite City', 'Dasmariñas', 'General Trias', 'Imus', 'Lipa', 'San Pablo', 'San Pedro', 'Santa Rosa', 'Santo Tomas', 'Tagaytay', 'Tanauan', 'Trece Martires'],
    'Region IV-B (Mimaropa)': ['Calapan', 'Puerto Princesa'],
    'Region V (Bicol Region)': ['Iriga', 'Legazpi', 'Ligao', 'Masbate City', 'Naga', 'Sorsogon City', 'Tabaco'],
  },
  'Visayas (39 Cities)': {
    'Region VI (Western Visayas)': ['Bacolod', 'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Iloilo City', 'Kabankalan', 'La Carlota', 'Passi', 'Roxas City', 'Sagay', 'San Carlos (Negros Occidental)', 'Silay', 'Sipay', 'Talisay (Negros Occidental)', 'Victorias'],
    'Region VII (Central Visayas)': ['Bais', 'Bayawan', 'Canlaon', 'Carcar', 'Cebu City', 'Danao', 'Dumaguete', 'Guihulngan', 'Lapu-Lapu', 'Mandaue', 'Naga (Cebu)', 'Tagbilaran', 'Talisay (Cebu)', 'Toledo', 'Tanjay'],
    'Region VIII (Eastern Visayas)': ['Baybay', 'Borongan', 'Calbayog', 'Catbalogan', 'Maasin', 'Ormoc', 'Tacloban'],
  },
  'Mindanao (38 Cities)': {
    'Region IX (Zamboanga Peninsula)': ['Dapitan', 'Dipolog', 'Isabela (Basilan)', 'Pagadian', 'Zamboanga City'],
    'Region X (Northern Mindanao)': ['Cagayan de Oro', 'El Salvador', 'Gingoog', 'Iligan', 'Malaybalay', 'Oroquieta', 'Ozamiz', 'Tangub', 'Valencia'],
    'Region XI (Davao Region)': ['Davao City', 'Digos', 'Mati', 'Panabo', 'Samal', 'Tagum'],
    'Region XII (Soccsksargen)': ['General Santos', 'Kidapawan', 'Koronadal', 'Tacurong'],
    'Region XIII (Caraga)': ['Bayugan', 'Butuan', 'Cabadbaran', 'Surigao City', 'Tandag'],
    'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)': ['Cotabato City', 'Lamitan', 'Marawi'],
  }
};

export default function LeftSidebar({ isMobileHidden = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [ghostUser, setGhostUser] = useState(null);

  useEffect(() => {
    const ghost = getImpersonatedUser();
    if (ghost) setGhostUser(ghost);
  }, []);

  // Use ghost user if in ghost session, otherwise use regular user
  const isGhostSession = !!ghostUser;
  // isAdmin: STRICTLY NEVER true in ghost session — ghost completely overrides admin state
  const isAdmin = !isGhostSession && !!(user?.email?.toLowerCase() === 'kevinarnold522@gmail.com');
  const activeUser = isGhostSession ? ghostUser : user;
  const isSeller = !!(activeUser?.user_type === 'seller' || activeUser?.user_type === 'business' || activeUser?.is_seller || activeUser?.account_type === 'business_owner');
  const initials = activeUser ? (activeUser.full_name || activeUser.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const accountTypeLabel = isAdmin ? 'CEO & Founder' : activeUser?.user_type === 'business' ? 'Business' : activeUser?.user_type === 'rider' ? 'Rider Delivery' : isSeller ? 'Sales Account' : isGhostSession ? 'Live Test' : 'Customer';

  if (isMobileHidden) return null;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{
        top: 108, /* 40px top banner + ~68px nav */
        background: 'linear-gradient(180deg,#000d40 0%,#0a1940 50%,#000d40 100%)',
        borderRight: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '2px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3 flex-shrink-0 border-b border-white/8">
        <a href="/" className="flex items-center gap-2 min-w-0">
          <img
            src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
            alt="1MarketPH"
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="font-heading font-bold text-sm text-white whitespace-nowrap overflow-hidden">
              1Market<span className="text-[#FFD700]">PH</span>
            </motion.span>
          )}
        </a>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white/60" /> : <ChevronLeft className="w-3.5 h-3.5 text-white/60" />}
        </button>
      </div>

      {/* Profile Details — ABOVE nav, visible when authenticated */}
      {isAuthenticated && activeUser && (
        <div className={`px-2 py-2.5 border-b border-white/8 flex-shrink-0 ${collapsed ? 'items-center justify-center flex flex-col' : ''}`}>
          <Link to="/profile" className={`flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/8 transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
              {activeUser?.profile_picture ? (
                <img src={activeUser.profile_picture} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-xl flex items-center justify-center text-white font-heading font-bold text-xs bg-gradient-to-br from-[#2563EB] to-[#00D4FF]">
                  {(activeUser.full_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                {/* Standardized account type badge */}
                <span className="inline-flex items-center font-body font-bold uppercase tracking-wider mb-0.5 flex-shrink-0"
                  style={{
                    fontSize: '8px', padding: '2px 7px', borderRadius: '4px',
                    background: isAdmin ? 'rgba(245,158,11,0.18)' : activeUser?.user_type === 'business' ? 'rgba(37,99,235,0.18)' : activeUser?.user_type === 'rider' ? 'rgba(245,158,11,0.13)' : isSeller ? 'rgba(16,185,129,0.15)' : isGhostSession ? 'rgba(168,85,247,0.13)' : 'rgba(37,99,235,0.13)',
                    border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.4)' : activeUser?.user_type === 'business' ? 'rgba(37,99,235,0.4)' : activeUser?.user_type === 'rider' ? 'rgba(245,158,11,0.35)' : isSeller ? 'rgba(16,185,129,0.38)' : isGhostSession ? 'rgba(168,85,247,0.35)' : 'rgba(37,99,235,0.3)'}`,
                    color: isAdmin ? '#fbbf24' : activeUser?.user_type === 'business' ? '#93c5fd' : activeUser?.user_type === 'rider' ? '#fde68a' : isSeller ? '#6ee7b7' : isGhostSession ? '#d8b4fe' : '#60a5fa',
                  }}>
                  {accountTypeLabel}
                </span>
                <p className="font-body text-[11px] font-bold text-white truncate">{activeUser.full_name?.split(' ')[0] || 'Account'}</p>
              </div>
            )}
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-scroll py-2 space-y-0.5 px-2" style={{ scrollbarWidth: 'auto', scrollbarColor: 'rgba(255,255,255,0.85) rgba(255,255,255,0.08)', scrollbarGutter: 'stable', minHeight: 0 }}
        ref={el => {
          if (el) {
            el.style.setProperty('--scrollbar-width', '10px');
          }
        }}
      >
        {!isAuthenticated && NAV_ITEMS.map(item => {
          const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all group relative"
              style={{
                background: active ? `${item.color}22` : 'transparent',
                borderLeft: active ? `3px solid ${item.color}` : '3px solid transparent',
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0 transition-colors"
                style={{ color: active ? item.color : 'rgba(255,255,255,0.5)' }} />
              {!collapsed && (
                <span className="font-body text-xs font-semibold truncate transition-colors"
                  style={{ color: active ? 'white' : 'rgba(255,255,255,0.55)' }}>
                  {item.label}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-[#0D1F3C] border border-white/10 text-white font-body text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-white/8 mx-1" />

        {/* Authenticated user links */}
        {isAuthenticated && activeUser && (
          <>
            <Link to="/favourites"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-pink-400 hover:bg-pink-500/10"
              title={collapsed ? 'Saved' : undefined}>
              <Heart className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Saved</span>}
            </Link>
            <Link to="/cart"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-green-400 hover:bg-green-500/10"
              title={collapsed ? 'Cart' : undefined}>
              <ShoppingCart className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Cart</span>}
            </Link>

            <Link to="/messages"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'Messages' : undefined}>
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Messages</span>}
            </Link>
            <Link to="/notifications"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'Notifications' : undefined}>
              <Bell className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Notifications</span>}
            </Link>
          </>
        )}

        {/* Seller tools - for both regular and ghost sellers */}
        {((isSeller && !isGhostSession) || (isGhostSession && (ghostUser?.user_type === 'seller' || ghostUser?.user_type === 'business')) || isAdmin) && isAuthenticated && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller</p>}
            <Link to="/my-listings"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'My Listings' : undefined}>
              <Package className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">My Listings</span>}
            </Link>
            <Link to="/my-analytics"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-yellow-400 hover:bg-yellow-400/10"
              title={collapsed ? 'Analytics' : undefined}>
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Analytics</span>}
            </Link>
            <Link to={`/seller/${isGhostSession ? (ghostUser?.username || ghostUser?.id) : (activeUser?.username || activeUser?.id)}`}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-green-400 hover:bg-green-400/10"
              title={collapsed ? 'My Seller Profile' : undefined}>
              <User className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">My Seller Profile</span>}
            </Link>
          </>
        )}

        {/* Support & Info — signed in users only */}
        {isAuthenticated && activeUser && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-white/30 uppercase tracking-wider font-bold">Help & Info</p>}
            <Link to="/about"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'About Us' : undefined}>
              <Info className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">About Us</span>}
            </Link>
            <Link to="/privacy-policy"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'Privacy Policy' : undefined}>
              <FileText className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Privacy Policy</span>}
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-support'))}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-emerald-400 hover:bg-emerald-400/10"
              title={collapsed ? 'Support' : undefined}>
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Support</span>}
            </button>
          </>
        )}

        {/* Main site links — kept at the bottom for all account types */}
        {isAuthenticated && activeUser && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-white/30 uppercase tracking-wider font-bold">Browse</p>}
            {NAV_ITEMS.map(item => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link key={item.to} to={item.to}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all group relative"
                  style={{ background: active ? `${item.color}22` : 'transparent', borderLeft: active ? `3px solid ${item.color}` : '3px solid transparent' }}
                  title={collapsed ? item.label : undefined}>
                  <item.icon className="w-4 h-4 flex-shrink-0 transition-colors" style={{ color: active ? item.color : 'rgba(255,255,255,0.5)' }} />
                  {!collapsed && <span className="font-body text-xs font-semibold truncate transition-colors" style={{ color: active ? 'white' : 'rgba(255,255,255,0.55)' }}>{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}

        {/* Admin — ONLY real owner, never ghost session, never non-admin */}
        {isAdmin && !isGhostSession && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin</p>}
            <Link to="/admin"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10"
              title={collapsed ? 'Admin' : undefined}>
              <Shield className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Admin Panel</span>}
            </Link>
            {/* Connected Accounts: strictly admin only, NEVER in ghost session */}
            <Link to="/connected-accounts"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-purple-400/70 hover:text-purple-400 hover:bg-purple-400/10"
              title={collapsed ? 'Connected Accounts' : undefined}>
              <Users className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Connected Accounts</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Post & Add — seller/admin only (including ghost sellers) */}
      {(isAdmin || ((isSeller && !isGhostSession) || (isGhostSession && (ghostUser?.user_type === 'seller' || ghostUser?.user_type === 'business'))) && activeUser?.user_type !== 'customer' && activeUser?.user_type !== 'rider') && isAuthenticated && (
        <div className="px-2 pb-2 flex-shrink-0 border-t border-white/8 pt-2">
          {collapsed ? (
            <div className="flex justify-center">
              <PostListingMenu user={activeUser} compact iconOnly />
            </div>
          ) : (
            <PostListingMenu user={activeUser} compact />
          )}
        </div>
      )}

      {/* User profile footer */}
      <div className="px-2 pb-3 flex-shrink-0 border-t border-white/8 pt-2">
        {isAuthenticated && activeUser ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/8 transition-colors group">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                {activeUser?.profile_picture ? (
                  <img src={activeUser.profile_picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-lg flex items-center justify-center text-white font-heading font-bold text-[10px] bg-gradient-to-br from-[#2563EB] to-[#00D4FF]">
                    {initials}
                  </div>
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#00D4FF]/25 bg-[#00D4FF]/10 font-body text-[8px] font-bold uppercase tracking-wider text-[#00D4FF] mb-0.5">
                    {accountTypeLabel}
                  </span>
                  <p className="font-body text-[11px] font-bold text-white truncate">{activeUser.full_name?.split(' ')[0] || 'Account'}</p>
                </div>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center gap-2 px-2 py-2 rounded-xl bg-[#2563EB]/20 hover:bg-[#2563EB]/30 transition-colors">
              <User className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold text-[#00D4FF]">Login</span>}
            </Link>
            <Link to="/login" className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors mt-1">
              <User className="w-4 h-4 text-white flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold text-white">Continue with Google</span>}
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-2 py-2 rounded-xl bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 transition-colors mt-1">
              <User className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold text-[#00D4FF]">Sign Up</span>}
            </Link>
          </>
        )}
      </div>
    </motion.aside>
  );
}