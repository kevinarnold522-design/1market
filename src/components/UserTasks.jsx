import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, ChevronRight, Package, User, Star, MessageSquare, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import OneCheckmark from './OneCheckmark';

const SELLER_TASKS = [
  { id: 'publish_listing_1', label: 'Publish your 1st listing', href: '/profile?tab=listings', icon: Package },
  { id: 'publish_listing_2', label: 'Publish your 2nd listing', href: '/profile?tab=listings', icon: Package },
  { id: 'publish_listing_3', label: 'Publish your 3rd listing', href: '/profile?tab=listings', icon: Package },
  { id: 'publish_listing_4', label: 'Publish your 4th listing', href: '/profile?tab=listings', icon: Package },
  { id: 'publish_listing_5', label: 'Publish your 5th listing', href: '/profile?tab=listings', icon: Package },
];

const CUSTOMER_TASKS = [
  { id: 'complete_profile', label: 'Complete your profile', href: '/profile', icon: User },
  { id: 'save_favourite', label: 'Save a favourite listing', href: '/buysell', icon: Heart },
  { id: 'browse_food', label: 'Browse the Food section', href: '/food', icon: Package },
  { id: 'send_message', label: 'Message a seller', href: '/messages', icon: MessageSquare },
  { id: 'leave_review', label: 'Leave a comment on a listing', href: '/explore', icon: Star },
];

const STORAGE_KEY = 'user_tasks_v1';

function loadTasks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveTasks(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export default function UserTasks({ user }) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(loadTasks);

  const isSeller = user?.is_seller || user?.user_type === 'seller' || user?.user_type === 'business' || user?.account_type === 'business_owner';
  const tasks = isSeller ? SELLER_TASKS : CUSTOMER_TASKS;
  const done = tasks.filter(t => completed[t.id]).length;
  const allDone = done === tasks.length;

  const toggle = (id) => {
    setCompleted(prev => {
      const next = { ...prev, [id]: !prev[id] };
      saveTasks(next);
      return next;
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Floating task button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-24 z-[480] flex items-center gap-2 px-3 py-2 rounded-2xl shadow-2xl font-body font-bold text-xs text-white"
        style={{ background: allDone ? 'linear-gradient(135deg,#10b981,#00D4FF)' : 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 20px rgba(37,99,235,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <span className="font-bold">{done}/{tasks.length}</span>
        <span className="hidden sm:inline">Tasks</span>
        {allDone && <OneCheckmark size="xs" label="" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-4 bottom-36 z-[490] rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.25)', width: 'min(320px, 94vw)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <h3 className="font-heading font-bold text-white text-sm">Your 5 Getting Started Tasks</h3>
                <p className="font-body text-[10px] text-white/40">{done}/{tasks.length} completed</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-3 h-3 text-white/50" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-white/10">
              <motion.div className="h-full" animate={{ width: `${(done / tasks.length) * 100}%` }} style={{ background: 'linear-gradient(90deg,#10b981,#00D4FF)' }} />
            </div>
            <div className="p-3 space-y-2">
              {tasks.map((task, i) => {
                const isDone = !!completed[task.id];
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-center gap-2.5 p-2 rounded-xl transition-all"
                    style={{ background: isDone ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
                    <button onClick={() => toggle(task.id)} className="flex-shrink-0">
                      {isDone
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : <Circle className="w-4 h-4 text-white/25 hover:text-white/50 transition-colors" />
                      }
                    </button>
                    <Link to={task.href} onClick={() => setOpen(false)} className="flex-1 flex items-center gap-2 group">
                      <Icon className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
                      <span className={`font-body text-xs ${isDone ? 'line-through text-white/30' : 'text-white/80 group-hover:text-white transition-colors'}`}>
                        {task.label}
                      </span>
                    </Link>
                    <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                  </div>
                );
              })}
              {allDone && (
                <div className="text-center pt-2">
                  <p className="font-body text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                    AI All tasks done! <OneCheckmark size="xs" label="1Checkmark eligible!" />
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}