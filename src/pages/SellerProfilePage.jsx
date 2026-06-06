import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, User, MapPin, Star, Facebook, Instagram, Youtube, Globe, Link as LinkIcon, Heart, Share2, Flag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AnimatedHeartButton from '../components/AnimatedHeartButton';

export default function SellerProfilePage({ sellerId }) {
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState('');
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          setUser(me);
          // Check if following
          const follows = await base44.entities.Follow.filter({ follower_email: me.email, following_user_id: sellerId });
          setFollowing(follows.length > 0);
        }
        // Load follower count
        const allFollows = await base44.entities.Follow.filter({ following_user_id: sellerId });
        setFollowerCount(allFollows.length);
        // Load seller profile
        const users = await base44.entities.User.filter({ 
          $or: [{ id: sellerId }, { username: sellerId }] 
        });
        if (users.length > 0) {
          setSeller(users[0]);
          const items = await base44.entities.Listing.filter({ created_by: users[0].email, is_active: true });
          setListings(items);
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, [sellerId]);

  const handleFollow = async () => {
    if (!user) return;
    if (following) {
      const follows = await base44.entities.Follow.filter({ follower_email: user.email, following_user_id: sellerId });
      if (follows.length > 0) await base44.entities.Follow.delete(follows[0].id);
      setFollowing(false);
    } else {
      await base44.entities.Follow.create({
        follower_email: user.email,
        following_user_id: sellerId,
        following_email: seller.email,
      });
      setFollowing(true);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user) return;
    await base44.entities.ChatMessage.create({
      listing_id: 'profile',
      seller_email: seller.email,
      buyer_email: user.email,
      sender_email: user.email,
      sender_name: user.full_name || user.username,
      message: message.trim(),
    });
    setMessage('');
    setShowContact(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="font-heading font-bold text-xl text-white mb-2">Profile Not Found</h2>
          <p className="font-body text-sm text-white/40">This seller profile doesn't exist.</p>
        </div>
      </div>
    );
  }

  const initials = (seller.full_name || seller.email || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isVerified = seller.is_verified_seller;
  const memberSince = seller.created_date ? new Date(seller.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';

  return (
    <div className="min-h-screen bg-[#070F1A]">
      {/* Header with Cover */}
      <div className="relative h-48 overflow-hidden" style={{ background: seller.cover_photo ? 'none' : 'linear-gradient(135deg,#0D1F3C,#1e3a5f)' }}>
        {seller.cover_photo && <img src={seller.cover_photo} alt="cover" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 pb-12">
        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {seller.profile_picture ? (
                <img src={seller.profile_picture} alt={seller.full_name} className="w-24 h-24 rounded-2xl object-cover border-2 border-[#00D4FF]" />
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-heading font-bold text-3xl text-white border-2 border-[#00D4FF]"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                  {initials}
                </div>
              )}
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#0A192F]">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h1 className="font-heading font-bold text-2xl text-white mb-1">
                    {seller.full_name || seller.username || 'Seller'}
                    {isVerified && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">✓ Verified</span>}
                  </h1>
                  <p className="font-body text-sm text-white/40 flex items-center gap-2">
                    {seller.bio && <><span>{seller.bio}</span>{seller.location && '·'}</>}
                    {seller.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00D4FF]" /> {seller.location}
                      </span>
                    )}
                  </p>
                  <p className="font-body text-xs text-white/30 mt-1">Member since {memberSince}</p>
                </div>
                {user && user.email !== seller.email && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-xl font-body font-bold text-xs transition-all ${
                      following
                        ? 'bg-white/10 border border-white/20 text-white/60 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-[#00D4FF] text-[#0A192F] hover:bg-white'
                    }`}
                  >
                    {following ? 'Following' : '+ Follow'}
                  </button>
                )}
              </div>

              {/* Social Links */}
              {(seller.social_facebook || seller.social_instagram || seller.social_youtube) && (
                <div className="flex items-center gap-2 mt-3">
                  {seller.social_facebook && (
                    <a href={seller.social_facebook} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/30 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {seller.social_instagram && (
                    <a href={seller.social_instagram} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:bg-pink-600/30 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {seller.social_youtube && (
                    <a href={seller.social_youtube} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600/30 transition-colors">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {user && user.email !== seller.email && (
                    <button onClick={() => setShowContact(true)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] rounded-xl font-body text-xs font-bold hover:bg-[#00D4FF]/20 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/8">
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-white">{listings.length}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Listings</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-[#00D4FF]">{followerCount}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-white">{isVerified ? '✓' : '—'}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Verified</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-white">{memberSince.split(' ')[1] || '—'}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Joined</p>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <h2 className="font-heading font-bold text-lg text-white mb-4">Active Listings</h2>
        {listings.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-body text-sm text-white/30">No active listings yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                    <AnimatedHeartButton liked={false} onToggle={() => {}} size="sm" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-heading font-bold text-sm text-white mb-1 truncate">{item.title}</h3>
                  <p className="font-body text-xs text-[#00D4FF] mb-2">{item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                  <a href={`/listing/${item.id}`}
                    className="block w-full py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] rounded-lg font-body text-xs font-bold text-center hover:bg-[#00D4FF]/20 transition-colors">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-sm" onClick={() => setShowContact(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">Message {seller.full_name || seller.username}</h3>
                <button onClick={() => setShowContact(false)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
              </div>
              <div className="p-4 space-y-3">
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  placeholder="Write your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none" />
                <button onClick={sendMessage} disabled={!message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}