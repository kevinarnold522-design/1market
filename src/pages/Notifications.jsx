import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, Star, Check, ArrowLeft, Trash2, Reply } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const ICON_MAP = {
  like: <Heart className="w-4 h-4 text-red-400" />,
  rating: <Star className="w-4 h-4 text-yellow-400" />,
  comment: <MessageCircle className="w-4 h-4 text-blue-400" />,
  reply: <Reply className="w-4 h-4 text-purple-400" />,
};

const COLOR_MAP = {
  like: 'rgba(239,68,68,0.15)',
  rating: 'rgba(245,158,11,0.15)',
  comment: 'rgba(59,130,246,0.15)',
  reply: 'rgba(168,85,247,0.15)',
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    base44.entities.Notification.filter({ user_email: user.email }, '-created_date', 50)
      .then(data => { setNotifications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.email]);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markOne = async (id) => {
    await base44.entities.Notification.update(id, { is_read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteOne = async (id) => {
    await base44.entities.Notification.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6">
          <Bell className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-white mb-2">Sign In Required</h2>
          <p className="font-body text-sm text-white/40 mb-4">You need to be signed in to view notifications.</p>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pt-28">
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-4 font-body text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#00D4FF]" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">{unreadCount}</span>
              )}
            </h1>
            <p className="font-body text-xs text-white/35 mt-1">{notifications.length} total notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] font-body text-xs font-semibold hover:bg-[#00D4FF]/20 transition-colors">
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['all', 'like', 'comment', 'reply', 'rating'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-body text-xs font-semibold whitespace-nowrap transition-all ${filter === f ? 'bg-[#2563EB] text-white' : 'bg-white/5 text-white/40 hover:text-white border border-white/10'}`}>
              {f === 'all' ? '📬 All' : f === 'like' ? '❤️ Likes' : f === 'comment' ? '💬 Comments' : f === 'reply' ? '↩️ Replies' : '⭐ Ratings'}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#00D4FF] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Bell className="w-12 h-12 text-white/15 mx-auto mb-3" />
            <p className="font-body text-sm text-white/30">No notifications yet</p>
            <p className="font-body text-[10px] text-white/20 mt-1">You'll see likes, comments, and ratings on your listings here</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((n, i) => (
                <motion.div key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className={`relative flex items-start gap-3 p-4 rounded-2xl border transition-all ${!n.is_read ? 'border-[#00D4FF]/20' : 'border-white/8'}`}
                  style={{ background: !n.is_read ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.03)' }}>

                  {/* Unread dot */}
                  {!n.is_read && (
                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                  )}

                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: COLOR_MAP[n.type] || 'rgba(255,255,255,0.08)' }}>
                    {ICON_MAP[n.type] || <Bell className="w-4 h-4 text-white/50" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-white leading-snug">{n.message}</p>
                    {n.from_user_name && (
                      <p className="font-body text-[10px] text-white/40 mt-0.5">from {n.from_user_name}</p>
                    )}
                    {n.listing_title && (
                      <p className="font-body text-[10px] text-white/30 mt-0.5 truncate">📋 {n.listing_title}</p>
                    )}
                    <p className="font-body text-[9px] text-white/20 mt-1.5">
                      {new Date(n.created_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!n.is_read && (
                      <button onClick={() => markOne(n.id)}
                        className="w-7 h-7 rounded-xl bg-[#00D4FF]/15 flex items-center justify-center hover:bg-[#00D4FF]/30 transition-colors"
                        title="Mark as read">
                        <Check className="w-3.5 h-3.5 text-[#00D4FF]" />
                      </button>
                    )}
                    <button onClick={() => deleteOne(n.id)}
                      className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      title="Delete">
                      <Trash2 className="w-3 h-3 text-white/30 hover:text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}