import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Send, X } from 'lucide-react';
import { useFireTransition, FireOverlay } from './FireTransition';
import { base44 } from '@/api/base44Client';

const SUGGESTIONS = [
  { emoji: '', label: 'Looking for Food?', sub: 'Carinderias & restaurants', href: '/food', color: '#f97316' },
  { emoji: '', label: 'Looking for a Hotel?', sub: 'Manila & Cavite stays', href: '/travel', color: '#3b82f6' },
  { emoji: '', label: 'Looking for Deals?', sub: 'Best prices today', href: '/travel', color: '#ef4444' },
  { emoji: '', label: 'Looking for a Place to Rent?', sub: 'Homes & apartments', href: '/rent', color: '#22c55e' },
  { emoji: '', label: 'Looking for Plane Tickets?', sub: 'Domestic flights PH', href: '/travel', color: '#8b5cf6' },
  { emoji: '', label: 'Looking for a Phone?', sub: 'Tech & gadget deals', href: '/buysell', color: '#06b6d4' },
  { emoji: '', label: 'Need a Service?', sub: 'Plumbers, tutors & more', href: '/services', color: '#f59e0b' },
  { emoji: '', label: 'Looking for a Car?', sub: 'Sedans, SUVs & more', href: '/buysell', color: '#64748b' },
];

export default function SuggestionsBar() {
  const [hovered, setHovered] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { firing, fireNavigate } = useFireTransition();

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are 1Market.ph's helpful assistant. The user is browsing a Philippine marketplace with Travel, Food, Buy & Sell, For Rent, and Services sections. Answer helpfully and concisely in 2-3 sentences. User asked: "${query}"`,
    });
    setAnswer(typeof res === 'string' ? res : res.text || JSON.stringify(res));
    setLoading(false);
  };

  return (
    <>
      <FireOverlay firing={firing} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-[#112240] to-[#0A192F] border-b border-white/5 py-3 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row: toggle + suggestion pills */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => { setAiOpen(o => !o); setAnswer(''); setQuery(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all flex-shrink-0 ${aiOpen ? 'bg-[#00D4FF]/20 border-[#00D4FF]/60 text-[#00D4FF]' : 'bg-white/5 border-white/15 text-white/60 hover:border-[#00D4FF]/40 hover:text-[#00D4FF]'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-body text-[11px] font-bold uppercase tracking-wider">Ask 1Market </span>
            </button>
            <span className="font-body text-[10px] text-white/25 hidden sm:block">— Popular searches</span>
          </div>

          {/* panel */}
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="bg-white/5 border border-[#00D4FF]/20 rounded-2xl p-4">
                  <form onSubmit={handleAsk} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-body text-sm select-none">?</span>
                      <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="e.g. Best budget hotel in Tagaytay, cheap phones in Manila..."
                        className="w-full pl-8 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/60 transition-all"
                        autoFocus
                      />
                    </div>
                    <button type="submit" disabled={loading || !query.trim()}
                      className="px-4 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50">
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      ) : <Send className="w-4 h-4" />}
                      <span className="hidden sm:inline">Ask</span>
                    </button>
                  </form>
                  <AnimatePresence>
                    {answer && (
                      <motion.div
                        initial={{ opacity: 0, marginTop: 0 }}
                        animate={{ opacity: 1, marginTop: 10 }}
                        exit={{ opacity: 0 }}
                        className="relative bg-white/10 rounded-xl p-3 flex items-start gap-2"
                      >
                        <button onClick={() => setAnswer('')} className="absolute top-2 right-2 text-white/30 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                        <Sparkles className="w-3.5 h-3.5 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                        <p className="font-body text-sm text-white/90 pr-4">{answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                onClick={() => fireNavigate(s.href)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={hovered === i ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border whitespace-nowrap cursor-pointer transition-all"
                style={{
                  borderColor: hovered === i ? s.color : 'rgba(255,255,255,0.1)',
                  backgroundColor: hovered === i ? `${s.color}22` : 'rgba(255,255,255,0.05)',
                }}
              >
                <span className="text-base leading-none">{s.emoji}</span>
                <div className="text-left">
                  <p className="font-body text-[11px] font-semibold text-white leading-tight">{s.label}</p>
                  <p className="font-body text-[9px] text-white/40 leading-tight">{s.sub}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-white/30 ml-1" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}