import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ALFIE_IMG = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/dba602fee_5C2B4377-0629-406D-97F0-9485947B48FD.png';

export default function AskBar() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    setOpen(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are Alfie, 1Market.ph's friendly dog mascot and AI assistant. The user is browsing a Philippine marketplace with Travel, Food, Buy & Sell, For Rent, and Services sections. Answer helpfully and concisely in 2-3 sentences. Be friendly and end with a short 🐾 emoji. User asked: "${query}"`,
    });
    setAnswer(typeof res === 'string' ? res : res.text || JSON.stringify(res));
    setLoading(false);
  };

  return (
    <div className="w-full py-4 px-4" style={{ background: 'linear-gradient(90deg,#001a80,#0033CC,#001a80)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <img src={ALFIE_IMG} alt="Alfie" className="w-7 h-7 object-contain rounded-full" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,51,204,0.5))' }} />
          <span className="font-body text-xs font-bold text-[#FFD700] uppercase tracking-wider">Ask Alfie</span>
          <span className="font-body text-xs text-white/50">— Your 1Market PH buddy, here to help!</span>
        </div>
        <form onSubmit={handleAsk} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-body text-sm select-none">🐾</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask Alfie anything — best deals, hotels, local food, jobs..."
              className="w-full pl-8 pr-4 py-2.5 border border-white/20 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#FFD700]/60 transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()}
            className="px-4 py-2.5 rounded-xl font-body font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50 text-[#0A192F]"
            style={{ background: loading ? 'rgba(255,215,0,0.6)' : 'linear-gradient(135deg,#FFD700,#FFA500)' }}>
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                <img src={ALFIE_IMG} alt="Alfie" className="w-4 h-4 object-contain rounded-full" />
              </motion.div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

        <AnimatePresence>
          {open && answer && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="relative backdrop-blur-sm border border-white/20 rounded-xl p-4"
              style={{ background: 'rgba(0,26,128,0.7)' }}
            >
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-start gap-2">
                <img src={ALFIE_IMG} alt="Alfie" className="w-6 h-6 object-contain flex-shrink-0 mt-0.5 rounded-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,51,204,0.5))' }} />
                <p className="font-body text-sm text-white/90 pr-4">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}