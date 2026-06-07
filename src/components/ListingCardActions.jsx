import React, { useState } from 'react';
import { Heart, Share2, Bookmark, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const STYLE = `
  @keyframes heart-pop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.5); }
    60%  { transform: scale(0.9); }
    80%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes heart-float {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(0.6); }
  }
  .heart-pop { animation: heart-pop 0.45s cubic-bezier(0.36,0.07,0.19,0.97) forwards; }
  .heart-float { animation: heart-float 0.7s ease-out forwards; }
`;

export default function ListingCardActions({ item, user, isFav, onFavourite, onShare, onComment, onBookmark, isSaved }) {
  const [heartAnim, setHeartAnim] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(isSaved || false);

  const handleHeart = async () => {
    // Animate regardless of auth
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 450);

    // Float a blue heart
    const id = Date.now();
    setFloatingHearts(h => [...h, id]);
    setTimeout(() => setFloatingHearts(h => h.filter(x => x !== id)), 700);

    if (onFavourite) onFavourite(item);
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
        {/* Floating hearts */}
        {floatingHearts.map(id => (
          <div key={id} className="heart-float absolute bottom-full left-2 pointer-events-none text-blue-400 text-lg z-20">
            💙
          </div>
        ))}

        {/* Heart */}
        <button
          onClick={handleHeart}
          className={`relative p-1.5 rounded-full transition-colors ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          title="Like"
        >
          <Heart
            className={`w-4 h-4 ${heartAnim ? 'heart-pop' : ''} ${isFav ? 'fill-red-500' : ''}`}
            style={{ color: isFav ? '#ef4444' : heartAnim ? '#3b82f6' : undefined }}
          />
        </button>

        {/* Comment */}
        <button
          onClick={() => {
            if (item.id && !item._static) {
              window.location.href = `/listing/${item.id}#comments`;
            }
            if (onComment) onComment(item);
          }}
          className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
          title="Comment"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

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

        {/* Bookmark / Save */}
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