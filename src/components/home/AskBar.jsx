import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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
      prompt: `You are 1Market.ph's helpful AI assistant. The user is browsing a Philippine marketplace with Travel, Food, Buy & Sell, For Rent, and Services sections. Answer helpfully and concisely in 2-3 sentences. User asked: "${query}"`,
    });
    setAnswer(typeof res === 'string' ? res : res.text || JSON.stringify(res));
    setLoading(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#0A192F] to-[#1a2f4f] py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-body text-xs font-bold text-[#00D4FF] uppercase tracking-wider">Ask 1Market AI</span>
          <span className="font-body text-xs text-white/40">— What are you looking for?</span>
        </div>
        <form onSubmit={handleAsk} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-body text-sm select-none">?</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Best budget hotel in Tagaytay, where to buy cheap phones in Manila..."
              className="w-full pl-8 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/60 transition-all"
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()}
            className="px-4 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-4 h-4" />
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
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
            >
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                <p className="font-body text-sm text-white/90 pr-4">{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}