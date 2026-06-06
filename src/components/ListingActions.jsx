import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Flag, Share2 } from 'lucide-react';
import AnimatedHeartButton from './AnimatedHeartButton';
import { base44 } from '@/api/base44Client';

export default function ListingActions({ listing, user, onReport, onShare }) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleComment = async () => {
    if (!comment.trim() || !user) return;
    setSubmitting(true);
    await base44.entities.ListingComment.create({
      listing_id: listing.id,
      listing_type: 'db',
      user_email: user.email,
      user_name: user.full_name || user.username,
      comment: comment.trim(),
      rating,
    });
    setComment('');
    setShowComment(false);
    setSubmitting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatedHeartButton size="sm" />
      
      <button
        onClick={() => setShowComment(true)}
        className="w-7 h-7 rounded-full bg-white/80 border-2 border-white/30 flex items-center justify-center text-white/60 hover:bg-blue-50 hover:text-blue-400 transition-all"
      >
        <MessageSquare className="w-3 h-3" />
      </button>

      <button
        onClick={() => onShare && onShare(listing)}
        className="w-7 h-7 rounded-full bg-white/80 border-2 border-white/30 flex items-center justify-center text-white/60 hover:bg-blue-50 hover:text-blue-400 transition-all"
      >
        <Share2 className="w-3 h-3" />
      </button>

      {user && (
        <button
          onClick={() => onReport && onReport(listing)}
          className="w-7 h-7 rounded-full bg-white/80 border-2 border-white/30 flex items-center justify-center text-white/60 hover:bg-red-50 hover:text-red-400 transition-all"
        >
          <Flag className="w-3 h-3" />
        </button>
      )}

      {/* Comment Modal */}
      {showComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-sm" onClick={() => setShowComment(false)}>
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-heading font-bold text-white">Leave a Comment</h3>
              <p className="font-body text-xs text-white/40 mt-0.5">{listing.title}</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        star <= rating ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/20 hover:text-yellow-400/50'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Write your comment..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none"
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim() || submitting}
                className="w-full py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}