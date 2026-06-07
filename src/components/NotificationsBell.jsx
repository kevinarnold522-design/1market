import React, { useState, useEffect, useRef } from 'react';
import { Bell, Heart, MessageCircle, Star, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function NotificationsBell({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user?.email) return;
    const fetch = () => {
      base44.entities.Notification.filter({ user_email: user.email }, '-created_date', 30)
        .then(setNotifications).catch(() => {});
    };
    fetch();
    const iv = setInterval(fetch, 15000);
    return () => clearInterval(iv);
  }, [user?.email]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    const unreadItems = notifications.filter(n => !n.is_read);
    await Promise.all(unreadItems.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markOne = async (id) => {
    await base44.entities.Notification.update(id, { is_read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const iconFor = (type) => {
    if (type === 'like') return <Heart className="w-3.5 h-3.5 text-red-400" />;
    if (type === 'rating') return <Star className="w-3.5 h-3.5 text-yellow-400" />;
    return <MessageCircle className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/8 border border-white/10 hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/10 transition-all"
      >
        <Bell className="w-4 h-4 text-white/70" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl z-[999]"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00D4FF]" />
                <span className="font-heading font-bold text-white text-sm">Notifications</span>
                {unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">{unread}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="font-body text-[10px] text-[#00D4FF] hover:underline">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-3 h-3 text-white/50" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <Bell className="w-8 h-8 text-white/15 mb-2" />
                  <p className="font-body text-sm text-white/30">No notifications yet</p>
                  <p className="font-body text-[10px] text-white/20 mt-1">You'll be notified when someone likes or comments on your listings</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors hover:bg-white/5 ${!n.is_read ? 'bg-[#00D4FF]/5' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {iconFor(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-white leading-snug">{n.message}</p>
                      {n.listing_title && (
                        <p className="font-body text-[10px] text-white/35 mt-0.5 truncate">on: {n.listing_title}</p>
                      )}
                      <p className="font-body text-[9px] text-white/25 mt-1">
                        {new Date(n.created_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.is_read && (
                      <button onClick={() => markOne(n.id)} className="w-5 h-5 rounded-full bg-[#00D4FF]/20 flex items-center justify-center flex-shrink-0 hover:bg-[#00D4FF]/40 transition-colors">
                        <Check className="w-3 h-3 text-[#00D4FF]" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}