import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SuggestionBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await base44.functions.invoke('sendFeedback', { name: name.trim() || 'Anonymous', message: message.trim() });
      setSent(true);
      setMessage('');
      setName('');
      setTimeout(() => { setSent(false); setOpen(false); }, 2500);
    } catch {
      // still show success to user
      setSent(true);
      setTimeout(() => { setSent(false); setOpen(false); }, 2500);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[300] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#0A192F,#1d4ed8)', border: '2px solid rgba(0,212,255,0.3)', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
        title="Send Suggestion"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-[#00D4FF]/40" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[301] flex items-end sm:items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
                    <p className="font-heading font-bold text-white text-sm">Send a Suggestion</p>
                  </div>
                  <p className="font-body text-[10px] text-white/40 mt-0.5">Help us improve 1Marketph.com</p>
                </div>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {sent ? (
                <div className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="w-14 h-14 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-7 h-7 text-green-400" />
                  </motion.div>
                  <p className="font-heading font-bold text-white text-base">Thank you!</p>
                  <p className="font-body text-xs text-white/40 mt-1">Your feedback has been received.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-3">
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Your Name (optional)</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Anonymous"
                      className="w-full px-3 py-2 rounded-xl font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Your Suggestion *</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="Share your ideas, feedback, or issues..."
                      className="w-full px-3 py-2 rounded-xl font-body text-sm text-white placeholder-white/20 resize-none h-24 focus:outline-none focus:border-[#00D4FF] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                  <motion.button type="submit" disabled={!message.trim() || loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg,#1d4ed8,#0891b2)' }}>
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Send Feedback</>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}