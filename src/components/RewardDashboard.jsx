import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Coins, Flame, X, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function RewardDashboard({ user, onClose }) {
  const [reward, setReward] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.UserReward.filter({ user_email: user.email })
      .then(recs => {
        if (recs.length > 0) setReward(recs[0]);
        else setReward(null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const alreadyClaimed = reward?.last_claimed_date === today;

  const handleClaim = async () => {
    if (alreadyClaimed || claiming) return;
    setClaiming(true);
    try {
      if (reward) {
        const updated = await base44.entities.UserReward.update(reward.id, {
          total_centavos: (reward.total_centavos || 0) + 0.01,
          last_claimed_date: today,
          streak_days: (reward.streak_days || 0) + 1,
        });
        setReward({ ...reward, total_centavos: (reward.total_centavos || 0) + 0.01, last_claimed_date: today, streak_days: (reward.streak_days || 0) + 1 });
      } else {
        const created = await base44.entities.UserReward.create({
          user_email: user.email,
          user_id: user.id,
          total_centavos: 0.01,
          last_claimed_date: today,
          streak_days: 1,
        });
        setReward(created);
      }
      setClaimed(true);
    } catch (e) {}
    setClaiming(false);
  };

  const total = reward?.total_centavos || 0;
  const streak = reward?.streak_days || 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-[#070F1A]/80 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(168,85,247,0.3)' }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg,rgba(168,85,247,0.2),rgba(236,72,153,0.1))' }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">Daily Rewards</h3>
              <p className="font-body text-[10px] text-purple-300">Login daily to earn centavos!</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Balance */}
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))', border: '1px solid rgba(168,85,247,0.2)' }}>
                <p className="font-body text-xs text-white/50 mb-1">Total Balance</p>
                <p className="font-heading font-bold text-3xl text-white">₱{total.toFixed(4)}</p>
                <p className="font-body text-[10px] text-purple-300 mt-1">{(total * 100).toFixed(2)} centavos earned</p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-body font-bold text-sm text-white">{streak} Day Streak </p>
                  <p className="font-body text-[10px] text-white/40">Login daily to keep your streak alive</p>
                </div>
              </div>

              {/* Today's reward */}
              <div className="rounded-xl p-3 text-center"
                style={{ background: alreadyClaimed ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)', border: `1px solid ${alreadyClaimed ? 'rgba(34,197,94,0.2)' : 'rgba(168,85,247,0.2)'}` }}>
                <p className="font-body text-[10px] text-white/50 mb-0.5">Today's Reward</p>
                <p className="font-heading font-bold text-xl text-white">+₱0.0001</p>
                <p className="font-body text-[10px] text-white/30">0.01 centavos per day</p>
              </div>

              {/* Claim button */}
              <AnimatePresence mode="wait">
                {claimed ? (
                  <motion.div key="claimed" initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="w-full py-3 rounded-xl text-center font-body font-bold text-sm"
                    style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                    Reward Claimed! Come back tomorrow
                  </motion.div>
                ) : alreadyClaimed ? (
                  <div className="w-full py-3 rounded-xl text-center font-body font-bold text-sm bg-white/5 text-white/30">
                    Already claimed today — come back tomorrow!
                  </div>
                ) : (
                  <motion.button key="claim" onClick={handleClaim} disabled={claiming}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', boxShadow: '0 4px 20px rgba(168,85,247,0.4)' }}>
                    {claiming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Gift className="w-4 h-4" /> Claim Daily Reward</>}
                  </motion.button>
                )}
              </AnimatePresence>

              <p className="font-body text-[10px] text-white/25 text-center">Rewards are in centavos (₱0.01 = 1 centavo). Accumulate and redeem for discounts soon!</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}