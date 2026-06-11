import React, { useState } from 'react';
import { Heart, Share2, Bookmark, MessageCircle, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { triggerWave } from '@/lib/waveTransition';

const STYLE = `
  @keyframes heart-pop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.5); }
    60%  { transform: scale(0.9); }
    80%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes big-heart-rise {
    0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
    40%  { opacity: 1; transform: translate(-50%, -80%) scale(1.4); }
    80%  { opacity: 0.6; transform: translate(-50%, -120%) scale(1.1); }
    100% { opacity: 0; transform: translate(-50%, -150%) scale(0.8); }
  }
  @keyframes big-star-pop {
    0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.3) rotate(0deg); }
    40%  { opacity: 1; transform: translate(-50%, -80%) scale(1.6) rotate(20deg); }
    80%  { opacity: 0.6; transform: translate(-50%, -120%) scale(1.2) rotate(-10deg); }
    100% { opacity: 0; transform: translate(-50%, -160%) scale(0.6) rotate(0deg); }
  }
  .heart-pop { animation: heart-pop 0.45s cubic-bezier(0.36,0.07,0.19,0.97) forwards; }
  .big-heart-rise { animation: big-heart-rise 1.1s ease-out forwards; pointer-events: none; }
  .big-star-pop { animation: big-star-pop 1.1s ease-out forwards; pointer-events: none; }
`;

export default function ListingCardActions({ item, user, isFav, onFavourite, onShare, onComment, onBookmark, isSaved, heartCount = 0, commentCount = 0, onRate }) {
  const [heartAnim, setHeartAnim] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isSaved || false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showStars, setShowStars] = useState(false);
  const [showBigStar, setShowBigStar] = useState(false);
  const [bigStarVal, setBigStarVal] = useState(5);

  const handleHeart = async () => {
    setHeartAnim(true);
    setShowBigHeart(true);
    setTimeout(() => setHeartAnim(false), 450);
    setTimeout(() => setShowBigHeart(false), 1600);
    if (onFavourite) onFavourite(item);
  };

  const handleRate = (val) => {
    setBigStarVal(val);
    setShowBigStar(true);
    setTimeout(() => setShowBigStar(false), 1100);
    setShowStars(false);
    if (onRate) onRate(item, val);
  };

  const handleShare = () => {
    const url = item.id && !item._static
      ? `${window.location.origin}/listing/${item.id}`
      : window.location.href;
    if (navigator.share) {
      navigator.share({ title: item.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
    if (onShare) onShare(item);
  };

  const handleBookmark = () => {
    setBookmarked(b => !b);
    if (onBookmark) onBookmark(item);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="flex items-center gap-1 relative">
        {/* Big double heart burst - covers entire image area */}
        {showBigHeart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: [0.3, 2.5, 1.8, 1.2] }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden"
            style={{ background: 'rgba(0, 20, 80, 0.75)' }}
          >
            <div className="relative" style={{ filter: 'drop-shadow(0 0 40px rgba(0,150,255,1)) drop-shadow(0 0 100px rgba(100,220,255,0.8))' }}>
              {/* Double hearts SVG */}
              <svg viewBox="0 0 220 110" width="320" height="288">
                <defs>
                  <linearGradient id="modalDoubleHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="40%" stopColor="#00a8ff" />
                    <stop offset="100%" stopColor="#4a69ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M110 100 C110 100 40 55 40 28 C40 8 58 0 85 0 C95 0 105 5 110 10 C115 5 125 0 135 0 C162 0 180 8 180 28 C180 55 110 100 110 100Z"
                  fill="url(#modalDoubleHeart)"
                  opacity="0.95"
                />
                <path
                  d="M110 100 C110 100 40 55 40 28 C40 8 58 0 85 0 C95 0 105 5 110 10 C115 5 125 0 135 0 C162 0 180 8 180 28 C180 55 110 100 110 100Z"
                  fill="url(#modalDoubleHeart)"
                  opacity="0.85"
                  transform="translate(25, 0)"
                />
                <path d="M105 25 L85 70 L108 63 L95 115 L135 55 L110 65 L118 25Z" fill="white" opacity="0.95" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Big star burst */}
        {showBigStar && (
          <div className="big-star-pop absolute left-1/2 top-0 z-30 text-5xl" style={{ position: 'absolute' }}>
            ⭐
          </div>
        )}

        {/* Heart */}
        <button
          onClick={handleHeart}
          className={`relative flex items-center gap-0.5 p-1.5 rounded-full transition-colors ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          title="Like"
        >
          <Heart
            className={`w-4 h-4 ${heartAnim ? 'heart-pop' : ''} ${isFav ? 'fill-red-500' : ''}`}
            style={{ color: isFav ? '#ef4444' : heartAnim ? '#ef4444' : undefined }}
          />
          {heartCount > 0 && <span className="font-body text-[10px] font-semibold">{heartCount}</span>}
        </button>

        {/* Comment */}
        <button
          onClick={() => {
            if (item.id && !item._static) {
              window.location.href = `/listing/${item.id}#comments`;
            }
            if (onComment) onComment(item);
          }}
          className="flex items-center gap-0.5 p-1.5 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
          title="Comment"
        >
          <MessageCircle className="w-4 h-4" />
          {commentCount > 0 && <span className="font-body text-[10px] font-semibold">{commentCount}</span>}
        </button>

        {/* Star Rating */}
        <div className="relative">
          <button
            onClick={() => setShowStars(s => !s)}
            className="flex items-center gap-0.5 p-1.5 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
            title="Rate"
          >
            <Star className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {showStars && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex items-center gap-0.5 px-2 py-1.5 rounded-xl z-40"
                style={{ background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
              >
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onMouseEnter={() => setHoveredStar(val)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRate(val)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className="w-5 h-5"
                      style={{ color: val <= (hoveredStar || 0) ? '#FFD700' : 'rgba(255,255,255,0.2)', fill: val <= (hoveredStar || 0) ? '#FFD700' : 'transparent' }}
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-full text-gray-400 hover:text-green-500 transition-colors relative"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-full text-[9px] font-bold text-green-500 whitespace-nowrap pointer-events-none"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-full transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}
          title={bookmarked ? 'Saved' : 'Save'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-yellow-500' : ''}`} />
        </button>
      </div>
    </>
  );
}