/**
 * AISellerTips — Daily AI-powered selling tips for sellers
 * Shows on SellerDashboard / UserProfile seller tabs
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2, RefreshCw, TrendingUp, Target, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TIP_ICONS = [TrendingUp, Target, Zap, Lightbulb];

export default function AISellerTips({ user, listings = [] }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  // Auto-load once on mount
  useEffect(() => {
    const cached = sessionStorage.getItem('1market_seller_tips');
    if (cached) {
      try { setTips(JSON.parse(cached)); setShown(true); } catch {}
    }
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const activeListing = listings.filter(l => l.is_active).length;
      const totalViews = listings.reduce((s, l) => s + (l.view_count || 0), 0);
      const categories = [...new Set(listings.map(l => l.type).filter(Boolean))].join(', ');

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Philippine marketplace growth coach for 1MarketPH.com.
Give this seller 4 specific, actionable tips to boost their sales TODAY.

Seller Profile:
- Name: ${user?.full_name || 'Seller'}
- Active Listings: ${activeListing}
- Total Views: ${totalViews}
- Categories: ${categories || 'General'}
- Location: ${user?.seller_location || 'Philippines'}

Context: It's a Philippine online marketplace. Buyers look for good photos, clear prices, fast response.
Tips should be specific to their situation, not generic. Use friendly Filipino-English tone.
Each tip should be actionable in under 5 minutes.`,
        response_json_schema: {
          type: 'object',
          properties: {
            greeting: { type: 'string' },
            tips: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  action: { type: 'string' },
                  impact: { type: 'string' }
                }
              }
            },
            motivation: { type: 'string' }
          }
        }
      });
      setTips(res);
      setShown(true);
      sessionStorage.setItem('1market_seller_tips', JSON.stringify(res));
    } catch {
      const fallback = {
        greeting: `Hi ${user?.full_name?.split(' ')[0] || 'Seller'}!`,
        tips: [
          { title: 'Add More Photos', action: 'Listings with 5+ photos get 3x more views. Add clear shots from multiple angles.', impact: 'High' },
          { title: 'Respond Faster', action: 'Reply to messages within 1 hour. Buyers go to the next seller if ignored.', impact: 'High' },
          { title: 'Update Your Price', action: 'Check competing listings and adjust your price to be competitive.', impact: 'Medium' },
          { title: 'Share on Facebook', action: 'Post your listing link in local buy & sell Facebook groups.', impact: 'High' },
        ],
        motivation: 'Consistent effort leads to consistent sales!'
      };
      setTips(fallback);
      setShown(true);
    }
    setLoading(false);
  };

  if (!shown && !loading) {
    return (
      <div className="rounded-2xl p-4" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-amber-400">AI Seller Tips</p>
              <p className="font-body text-[10px] text-white/40">Personalized advice just for you</p>
            </div>
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-amber-400 transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Lightbulb className="w-3 h-3" /> Get Tips
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {loading ? (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          <div>
            <p className="font-body font-bold text-sm text-amber-400">Analyzing your store...</p>
            <p className="font-body text-[10px] text-white/40">AI is reviewing your listings</p>
          </div>
        </div>
      ) : tips && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-amber-400">AI Seller Tips</p>
                {tips.greeting && <p className="font-body text-[10px] text-white/50">{tips.greeting}</p>}
              </div>
            </div>
            <button onClick={generate}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white/30 hover:text-amber-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {(tips.tips || []).slice(0, 4).map((tip, i) => {
              const Icon = TIP_ICONS[i % TIP_ICONS.length];
              return (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(251,191,36,0.15)' }}>
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-body font-bold text-xs text-white">{tip.title}</p>
                      {tip.impact && (
                        <span className="px-1.5 py-0.5 rounded-full font-body text-[8px] font-bold"
                          style={{ background: tip.impact === 'High' ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)', color: tip.impact === 'High' ? '#34d399' : '#fbbf24' }}>
                          {tip.impact}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-[10px] text-white/55 leading-relaxed">{tip.action}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {tips.motivation && (
            <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(251,191,36,0.08)' }}>
              <p className="font-body text-[11px] text-amber-400/80 italic">AI {tips.motivation}</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}