import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plane, UtensilsCrossed, ShoppingBag, Car, Wrench, Briefcase, Users, Heart, MessageSquare, Bell, User, ChevronLeft, ChevronRight, ShoppingCart, Package, BarChart2, Settings, LogOut, Shield, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import PostListingMenu from './PostListingMenu';
import NotificationsBell from './NotificationsBell';
import MetaVerifiedBadge from './MetaVerifiedBadge';

const NAV_ITEMS = [
  { to: '/',           icon: Home,           label: 'Home',         color: '#00D4FF' },
  { to: '/travel',     icon: Plane,          label: 'Travel',       color: '#0ea5e9' },
  { to: '/food',       icon: UtensilsCrossed, label: 'Food',        color: '#f97316' },
  { to: '/buysell',    icon: ShoppingBag,    label: 'Buy & Sell',   color: '#8b5cf6' },
  { to: '/rent',       icon: KeyRound,       label: 'Rent / Sale',  color: '#10b981' },
  { to: '/services',   icon: Wrench,         label: 'Services',     color: '#3b82f6' },
  { to: '/jobs',       icon: Briefcase,      label: 'Jobs',         color: '#f59e0b' },
  { to: '/community',  icon: Users,          label: 'Community',    color: '#a855f7' },
];

export default function LeftSidebar({ isMobileHidden = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.user_type === 'seller' || user?.is_seller || user?.account_type === 'business_owner';
  const initials = user ? (user.full_name || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

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
      <div className="flex items-center gap-2.5 px-3 py-4 flex-shrink-0 border-b border-white/8">
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {NAV_ITEMS.map(item => {
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
        {isAuthenticated && user && (
          <>
            <Link to="/favourites"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-pink-400 hover:bg-pink-500/10"
              title={collapsed ? 'Saved' : undefined}>
              <Heart className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Saved</span>}
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

        {/* Seller tools */}
        {(isSeller || isAdmin) && isAuthenticated && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller</p>}
            <Link to="/profile?tab=listings"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-[#00D4FF] hover:bg-[#00D4FF]/10"
              title={collapsed ? 'My Listings' : undefined}>
              <Package className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">My Listings</span>}
            </Link>
            <Link to="/profile?tab=analytics"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-white/50 hover:text-yellow-400 hover:bg-yellow-400/10"
              title={collapsed ? 'Analytics' : undefined}>
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Analytics</span>}
            </Link>
          </>
        )}

        {/* Admin */}
        {isAdmin && (
          <>
            <div className="my-2 border-t border-white/8 mx-1" />
            {!collapsed && <p className="px-2 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin</p>}
            <Link to="/admin"
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10"
              title={collapsed ? 'Admin' : undefined}>
              <Shield className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-body text-xs font-semibold truncate">Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Post & Add — seller/admin only */}
      {(isSeller || isAdmin) && isAuthenticated && (
        <div className="px-2 pb-2 flex-shrink-0 border-t border-white/8 pt-2">
          {collapsed ? (
            <div className="flex justify-center">
              <PostListingMenu user={user} compact iconOnly />
            </div>
          ) : (
            <PostListingMenu user={user} compact />
          )}
        </div>
      )}

      {/* User profile footer */}
      <div className="px-2 pb-3 flex-shrink-0 border-t border-white/8 pt-2">
        {isAuthenticated && user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-white/8 transition-colors group">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-[10px]">
                    {initials}
                  </div>
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[11px] font-bold text-white truncate">{user.full_name?.split(' ')[0] || 'Account'}</p>
                  <p className="font-body text-[9px] text-[#00D4FF]/70 truncate">{user.email}</p>
                </div>
              )}
            </Link>
            {/* Admin-only: Connected Accounts below profile */}
            {isAdmin && (
              <Link to="/connected-accounts"
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-purple-400/70 hover:text-purple-400 hover:bg-purple-400/10 mt-1"
                title={collapsed ? 'Connected Accounts' : undefined}>
                <Users className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="font-body text-xs font-semibold truncate">Connected Accounts</span>}
              </Link>
            )}
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-2 py-2 rounded-xl bg-[#2563EB]/20 hover:bg-[#2563EB]/30 transition-colors">
            <User className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
            {!collapsed && <span className="font-body text-xs font-semibold text-[#00D4FF]">Login / Sign up</span>}
          </Link>
        )}
      </div>
    </motion.aside>
  );
}