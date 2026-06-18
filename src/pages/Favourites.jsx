import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import StarField from '../components/StarField';

export default function Favourites() {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { setLoading(false); return; }
        const me = await base44.auth.me();
        setUser(me);
        const favs = await base44.entities.Favourite.filter({ user_email: me.email });
        setFavourites(favs);
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  const remove = async (id) => {
    await base44.entities.Favourite.delete(id);
    setFavourites(f => f.filter(i => i.id !== id));
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex flex-col items-center justify-center gap-4">
        <StarField />
        <Bookmark className="w-12 h-12 text-[#00D4FF]" />
        <p className="font-heading font-bold text-xl text-white">Sign in to view your saved items</p>
        <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="px-6 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F]"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-5 font-body text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="w-6 h-6 text-pink-400" />
          <h1 className="font-heading font-bold text-2xl text-white">Saved Favourites</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 font-body text-xs font-bold border border-pink-500/25">{favourites.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
          </div>
        ) : favourites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Heart className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-heading font-bold text-lg text-white/30">No saved items yet</p>
            <p className="font-body text-sm text-white/20 mt-1">Bookmark listings by clicking the bookmark icon</p>
            <Link to="/explore" className="inline-block mt-5 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F]"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
              Explore Listings
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {favourites.map(fav => (
                <motion.div key={fav.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.1)' }}>
                  {fav.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={fav.image_url} alt={fav.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-heading font-bold text-sm text-white truncate mb-0.5">{fav.title}</p>
                    {fav.price_label && <p className="font-body text-xs text-[#00D4FF] mb-1">{fav.price_label}</p>}
                    {fav.area && <p className="font-body text-[10px] text-white/35">{fav.area}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      {fav.listing_id && (
                        <Link to={`/listing/${fav.listing_id}`}
                          className="flex-1 text-center py-1.5 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] font-body text-[10px] font-bold hover:bg-[#00D4FF]/20 transition-colors">
                          View Listing
                        </Link>
                      )}
                      <button onClick={() => remove(fav.id)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/15 text-red-400/60 hover:text-red-400 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}