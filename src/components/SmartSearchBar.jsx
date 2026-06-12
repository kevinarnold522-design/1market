import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, ArrowRight, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

const RECENT_KEY = '1m_recent_searches';
const MAX_RECENT = 6;

function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecentSearch(q) {
  if (!q?.trim()) return;
  const prev = getRecentSearches().filter(s => s !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

export default function SmartSearchBar({ placeholder = 'Search listings, food, jobs, services...' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounce = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRecent(getRecentSearches());
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (!query.trim() || query.length < 2) { setResults([]); setAiSuggestions([]); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch matching listings
        const all = await base44.entities.Listing.filter({ is_active: true }, '-view_count', 50);
        const q = query.toLowerCase();
        const matched = all.filter(l =>
          l.title?.toLowerCase().includes(q) ||
          l.subcategory?.toLowerCase().includes(q) ||
          l.type?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
        ).slice(0, 6);
        setResults(matched);

        // AI-powered keyword suggestions
        if (query.length >= 3) {
          const res = await base44.integrations.Core.InvokeLLM({
            prompt: `You are a smart search assistant for 1MarketPH, a Philippine marketplace. 
The user typed: "${query}"
Generate 4 short, relevant search suggestion phrases (2-5 words each) that a Filipino buyer might search for.
Return ONLY a JSON array of strings. Example: ["iPhone 14 Cavite","second hand laptop","cheap food delivery"]`,
            response_json_schema: {
              type: 'object',
              properties: { suggestions: { type: 'array', items: { type: 'string' } } }
            }
          });
          setAiSuggestions(res?.suggestions?.slice(0, 4) || []);
        }
      } catch {}
      setLoading(false);
    }, 400);
  }, [query]);

  const goSearch = (q) => {
    const term = (q || query).trim();
    if (!term) return;
    saveRecentSearch(term);
    setRecent(getRecentSearches());
    setOpen(false);
    setQuery('');
    navigate(`/explore?q=${encodeURIComponent(term)}`);
  };

  const CATEGORY_ROUTES = {
    travel: '/travel', food: '/food', buysell: '/buysell',
    rent: '/rent', services: '/services', jobs: '/jobs',
  };
  const goListing = (item) => {
    setOpen(false);
    setQuery('');
    navigate(`/listing/${item.id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => { if (e.key === 'Enter') goSearch(); if (e.key === 'Escape') setOpen(false); }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl font-body text-sm text-white placeholder-white/30 focus:outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setAiSuggestions([]); inputRef.current?.focus(); }}
            className="absolute right-3 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
            <X className="w-3 h-3 text-white/60" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

            {loading && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <div className="w-3.5 h-3.5 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                <span className="font-body text-xs text-white/40">Searching...</span>
              </div>
            )}

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-[#00D4FF]" />
                  <span className="font-body text-[10px] font-bold text-[#00D4FF]/70 uppercase tracking-wider">AI Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestions.map((s, i) => (
                    <button key={i} onClick={() => goSearch(s)}
                      className="px-2.5 py-1 rounded-full font-body text-[11px] text-[#00D4FF] transition-all hover:bg-[#00D4FF]/20"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Results */}
            {results.length > 0 && (
              <div className="px-2 pb-2">
                {!aiSuggestions.length && <p className="font-body text-[10px] text-white/30 px-2 pt-2 mb-1 uppercase tracking-wider">Results</p>}
                {results.map(item => (
                  <button key={item.id} onClick={() => goListing(item)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/8 transition-colors text-left">
                    {item.image_url
                      ? <img src={item.image_url} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-9 h-9 rounded-lg bg-white/10 flex-shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-xs text-white font-semibold truncate">{item.title}</p>
                      <p className="font-body text-[10px] text-white/35 truncate">{item.type} · {item.location}</p>
                    </div>
                    {item.price_label && <span className="font-heading font-bold text-xs text-[#00D4FF] flex-shrink-0">{item.price_label}</span>}
                    <ArrowRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                  </button>
                ))}
                <button onClick={() => goSearch()}
                  className="w-full mt-1 py-2 rounded-xl font-body text-xs text-[#00D4FF] text-center hover:bg-[#00D4FF]/10 transition-colors">
                  See all results for "{query}" →
                </button>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recent.length > 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3 h-3 text-white/30" />
                  <span className="font-body text-[10px] text-white/30 uppercase tracking-wider">Recent</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((s, i) => (
                    <button key={i} onClick={() => goSearch(s)}
                      className="px-2.5 py-1 rounded-full font-body text-[11px] text-white/50 hover:text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {query.length >= 2 && !loading && results.length === 0 && aiSuggestions.length === 0 && (
              <div className="px-4 py-4 text-center">
                <p className="font-body text-xs text-white/30">No listings found for "{query}"</p>
                <button onClick={() => goSearch()}
                  className="mt-1.5 font-body text-xs text-[#00D4FF] hover:underline">
                  Search anyway →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}