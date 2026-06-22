import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Gift, X, CheckCircle, Clock, Sparkles, Facebook, Package } from 'lucide-react';

const DAILY_REWARD_AMOUNT = 500; // 5 pesos in centavos
const STREAK_BONUS = 100; // 1 peso bonus per streak day

export default function DailyRewardsTracker({ onClose }) {
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const user = await base44.auth.me();
      const rewards = await base44.entities.UserReward.filter({ user_email: user.email });
      const data = rewards[0] || { total_centavos: 0, streak_days: 0, last_claimed_date: null };
      setRewardData(data);
      
      // Check if can claim today
      const today = new Date().toISOString().split('T')[0];
      const lastClaimed = data.last_claimed_date;
      setCanClaim(lastClaimed !== today);
    } catch (e) {
      console.error('Failed to load rewards:', e);
    }
    setLoading(false);
  };

  const claimDailyReward = async () => {
    if (!canClaim) return;
    setClaiming(true);
    
    try {
      const user = await base44.auth.me();
      const today = new Date().toISOString().split('T')[0];
      const rewards = await base44.entities.UserReward.filter({ user_email: user.email });
      
      const newStreak = rewards.length > 0 && rewards[0].last_claimed_date === new Date(Date.now() - 86400000).toISOString().split('T')[0]
        ? (rewards[0].streak_days || 0) + 1
        : 1;
      
      const streakBonus = (newStreak - 1) * STREAK_BONUS;
      const totalAmount = DAILY_REWARD_AMOUNT + streakBonus;
      
      if (rewards.length > 0) {
        await base44.entities.UserReward.update(rewards[0].id, {
          total_centavos: (rewards[0].total_centavos || 0) + totalAmount,
          last_claimed_date: today,
          streak_days: newStreak,
        });
      } else {
        await base44.entities.UserReward.create({
          user_email: user.email,
          user_id: user.id,
          total_centavos: totalAmount,
          last_claimed_date: today,
          streak_days: newStreak,
        });
      }
      
      await loadRewards();
    } catch (e) {
      console.error('Failed to claim reward:', e);
    }
    setClaiming(false);
  };

  const tasks = [
    { id: 1, label: 'Claim Daily Reward', points: DAILY_REWARD_AMOUNT, completed: !canClaim, icon: Gift },
    { id: 2, label: 'List New Item', points: 200, completed: false, icon: Package },
    { id: 3, label: 'Share on Facebook', points: 300, completed: false, icon: Facebook },
    { id: 4, label: 'Complete Sale', points: 500, completed: false, icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-2xl">Daily Rewards</h2>
              <p className="font-body text-sm text-white/80 mt-1">Earn points by completing tasks!</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs text-amber-700 font-semibold uppercase tracking-wider">Total Balance</p>
                <p className="font-heading font-bold text-3xl text-amber-900 mt-1">
                  ₱{((rewardData?.total_centavos || 0) / 100).toFixed(2)}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            {rewardData?.streak_days > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-body text-xs font-bold text-amber-800">
                  {rewardData.streak_days} day streak! +₱{((rewardData.streak_days - 1) * STREAK_BONUS / 100).toFixed(2)} bonus
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Daily Reward Button */}
        <div className="px-6 pb-4">
          <button
            onClick={claimDailyReward}
            disabled={claiming || !canClaim}
            className={`w-full py-4 rounded-2xl font-body font-bold text-sm transition-all ${
              canClaim
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {claiming ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Claiming...
              </div>
            ) : canClaim ? (
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                Claim Daily Reward - ₱{(DAILY_REWARD_AMOUNT / 100).toFixed(2)}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Already Claimed Today
              </div>
            )}
          </button>
        </div>

        {/* Tasks List */}
        <div className="px-6 pb-6">
          <h3 className="font-heading font-bold text-sm text-gray-800 mb-3">Tasks</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  task.completed ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <task.icon className={`w-5 h-5 ${task.completed ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-xs font-bold ${task.completed ? 'text-green-800' : 'text-gray-700'}`}>
                    {task.label}
                  </p>
                  <p className="font-body text-[10px] text-gray-500">
                    +₱{(task.points / 100).toFixed(2)}
                  </p>
                </div>
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}