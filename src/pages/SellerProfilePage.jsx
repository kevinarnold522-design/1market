import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, MessageSquare, Send, X, UserCheck, UserPlus,
  Facebook, Instagram, Youtube, Globe, Phone, Mail,
  Grid, FileText, Star, Package, ArrowLeft
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MetaVerifiedBadge from '../components/MetaVerifiedBadge';

const SOCIAL_CONFIGS = {
  facebook: { icon: Facebook, color: '#1877f2', bg: 'rgba(24,119,242,0.15)', label: 'Facebook' },
  instagram: { icon: Instagram, color: '#e1306c', bg: 'rgba(225,48,108,0.15)', label: 'Instagram' },
  youtube: { icon: Youtube, color: '#ff0000', bg: 'rgba(255,0,0,0.15)', label: 'YouTube' },
  tiktok: { icon: Globe, color: '#69c9d0', bg: 'rgba(105,201,208,0.15)', label: 'TikTok' },
  viber: { icon: Phone, color: '#7360f2', bg: 'rgba(115,96,242,0.15)', label: 'Viber' },
};

function UserTypeBadge({ seller }) {
  const isAdmin = seller?.role === 'admin';
  const isBusiness = seller?.account_type === 'business_owner' || seller?.user_type === 'business';
  const isSeller = seller?.user_type === 'seller' || seller?.is_seller;

  if (isAdmin) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.35)', color: '#fbbf24' }}>
      CEO &amp; Founder
    </span>
  );
  if (isBusiness) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(0,212,255,0.12)', borderColor: 'rgba(0,212,255,0.3)', color: '#00D4FF' }}>
      Business Owner
    </span>
  );
  if (isSeller) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.3)', color: '#c084fc' }}>
      Seller
    </span>
  );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0.3)', color: '#60a5fa' }}>
      Member
    </span>
  );
}

function MessageModal({ seller, user, onClose }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    await base44.entities.ChatMessage.create({
      listing_id: 'profile_' + seller.id,
      listing_title: 'Chat with ' + (seller.full_name || 'Seller'),
      seller_email: seller.email,
      buyer_email: user.email,
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      message: message.trim(),
      chat_type: 'listing',
    });
    setSending(false);
    setSent(true);
    setTimeout(() => { onClose(); navigate('/messages'); }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,10,25,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            {seller.profile_picture
              ? <img src={seller.profile_picture} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm">
                  {(seller.full_name || 'S')[0]}
                </div>}
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-sm text-white">{seller.full_name || 'Seller'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <UserTypeBadge seller={seller} />
              {seller.is_verified_seller && <MetaVerifiedBadge size="xs" label="" />}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl">✓</div>
              <p className="font-heading font-bold text-white">Message Sent!</p>
              <p className="font-body text-xs text-white/40">Redirecting to Messages...</p>
            </div>
          ) : (
            <>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Write your message to the seller..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50 resize-none" />
              <button onClick={handleSend} disabled={!message.trim() || sending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-[1.02] disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                {sending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          setUser(me);
          const follows = await base44.entities.Follow.filter({ follower_email: me.email, following_user_id: sellerId });
          setFollowing(follows.length > 0);
        }
        const allFollows = await base44.entities.Follow.filter({ following_user_id: sellerId });
        setFollowerCount(allFollows.length);

        let users = await base44.entities.User.filter({ id: sellerId });
        if (!users || users.length === 0) {
          users = await base44.entities.User.filter({ username: sellerId });
        }
        if (users && users.length > 0) {
          const s = users[0];
          setSeller(s);
          const [items, communityPosts] = await Promise.all([
            base44.entities.Listing.filter({ email_contact: s.email, is_active: true }),
            base44.entities.CommunityPost.filter({ author_email: s.email }),
          ]);
          setListings(items);
          setPosts(communityPosts);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    init();
  }, [sellerId]);

  const handleFollow = async () => {
    if (!user || followLoading) return;
    setFollowLoading(true);
    if (following) {
      const follows = await base44.entities.Follow.filter({ follower_email: user.email, following_user_id: sellerId });
      if (follows.length > 0) await base44.entities.Follow.delete(follows[0].id);
      setFollowing(false);
      setFollowerCount(c => c - 1);
    } else {
      await base44.entities.Follow.create({ follower_email: user.email, following_user_id: sellerId, following_email: seller.email });
      setFollowing(true);
      setFollowerCount(c => c + 1);
    }
    setFollowLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070F1A' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!seller) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#070F1A' }}>
      <p className="font-heading font-bold text-xl text-white">Profile Not Found</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#00D4FF] font-body text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const initials = (seller.full_name || seller.email || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isVerified = seller.is_verified_seller;
  const memberSince = seller.created_date
    ? new Date(seller.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const isOwnProfile = user?.email === seller.email;

  const socials = [
    seller.social_facebook && { key: 'facebook', url: seller.social_facebook },
    seller.social_instagram && { key: 'instagram', url: seller.social_instagram },
    seller.social_youtube && { key: 'youtube', url: seller.social_youtube },
    seller.social_tiktok && { key: 'tiktok', url: seller.social_tiktok },
    seller.social_viber && { key: 'viber', url: seller.social_viber },
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#070F1A 0%,#0A192F 100%)' }}>
      {/* Cover Photo */}
      <div className="relative h-52 md:h-60 overflow-hidden">
        {seller.cover_photo
          ? <img src={seller.cover_photo} alt="cover" className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#0033CC 0%,#001a80 50%,#0D1F3C 100%)' }} />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(7,15,26,0.97) 100%)' }} />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold text-white/80 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* Profile Card */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(13,31,60,0.97)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(12px)' }}>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden"
                style={isVerified
                  ? { boxShadow: '0 0 0 2px #a855f7, 0 0 0 4px #38bdf8, 0 0 20px rgba(168,85,247,0.4)' }
                  : { boxShadow: '0 0 0 2px rgba(37,99,235,0.5)' }}>
                {seller.profile_picture
                  ? <img src={seller.profile_picture} alt={seller.full_name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-3xl text-white">{initials}</div>
                }
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2">
                  <MetaVerifiedBadge size="sm" label="" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h1 className="font-heading font-bold text-2xl text-white leading-tight">
                      {seller.full_name || seller.username || 'Seller'}
                    </h1>
                    {/* ONLY animated MetaVerifiedBadge for verified users — no plain checkmarks */}
                    {isVerified && <MetaVerifiedBadge size="md" label="Fully Verified" />}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <UserTypeBadge seller={seller} />
                    {seller.seller_location && (
                      <span className="flex items-center gap-1 font-body text-[11px] text-white/40">
                        <MapPin className="w-3 h-3 text-[#00D4FF]" />
                        {seller.seller_location}{seller.seller_area ? ` · ${seller.seller_area}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {!isOwnProfile && user && (
                    <>
                      <button onClick={handleFollow} disabled={followLoading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs transition-all ${
                          following
                            ? 'bg-white/10 border border-white/20 text-white/60 hover:bg-red-500/15 hover:text-red-400 hover:border-red-400/30'
                            : 'text-[#0A192F]'
                        }`}
                        style={!following ? { background: 'linear-gradient(135deg,#00D4FF,#2563EB)' } : {}}>
                        {following ? <><UserCheck className="w-3.5 h-3.5" /> Following</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
                      </button>
                      <button onClick={() => setShowMessage(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all">
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </button>
                    </>
                  )}
                  {!isOwnProfile && !user && (
                    <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs text-[#0A192F]"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                      <UserPlus className="w-3.5 h-3.5" /> Follow
                    </button>
                  )}
                  {isOwnProfile && (
                    <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs border border-white/20 text-white/60 hover:bg-white/10 transition-all">
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Bio */}
              {seller.bio && (
                <p className="font-body text-sm text-white/60 mb-3 leading-relaxed">{seller.bio}</p>
              )}

              {/* Social Links */}
              {(socials.length > 0 || seller.phone) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {socials.map(s => {
                    const cfg = SOCIAL_CONFIGS[s.key];
                    const Icon = cfg.icon;
                    return (
                      <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-[11px] font-semibold transition-all hover:scale-105"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </a>
                    );
                  })}
                  {seller.phone && (
                    <a href={`tel:${seller.phone}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-[11px] font-semibold transition-all hover:scale-105"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
                      <Phone className="w-3 h-3" /> {seller.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/8">
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-white">{listings.length}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Listings</p>
            </div>
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-[#00D4FF]">{followerCount}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-purple-400">{posts.length}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Posts</p>
            </div>
            <div className="text-center py-2 flex flex-col items-center justify-center">
              {isVerified
                ? <MetaVerifiedBadge size="sm" label="" />
                : <span className="font-heading font-bold text-xl text-white/25">—</span>}
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider mt-1">Verified</p>
            </div>
          </div>

          {memberSince && (
            <p className="font-body text-[11px] text-white/25 mt-3 text-right">Member since {memberSince}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-2xl" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'listings', label: 'Listings', icon: Grid, count: listings.length },
            { key: 'posts', label: 'Posts', icon: FileText, count: posts.length },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-xs transition-all"
              style={{
                background: activeTab === tab.key ? 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(37,99,235,0.15))' : 'transparent',
                color: activeTab === tab.key ? '#00D4FF' : 'rgba(255,255,255,0.4)',
                border: activeTab === tab.key ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: activeTab === tab.key ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)',
                  color: activeTab === tab.key ? '#00D4FF' : 'rgba(255,255,255,0.4)'
                }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          listings.length === 0
            ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-body text-sm text-white/30">No active listings yet</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(item => (
                  <Link key={item.id} to={`/listing/${item.id}`}
                    className="group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl block"
                    style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <div className="relative aspect-video overflow-hidden">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.06)' }}>
                            <Package className="w-10 h-10 text-white/15" />
                          </div>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading font-semibold text-sm text-white mb-1 truncate">{item.title}</h3>
                      <p className="font-body text-xs text-[#00D4FF] font-semibold mb-1">
                        {item.price_label || (item.price ? `\u20B1${Number(item.price).toLocaleString()}` : 'Contact for price')}
                      </p>
                      {item.location && (
                        <p className="font-body text-[10px] text-white/35 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {item.location}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          posts.length === 0
            ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FileText className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-body text-sm text-white/30">No community posts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="rounded-2xl p-5" style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                        {seller.profile_picture
                          ? <img src={seller.profile_picture} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-xs">{initials}</div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-body font-bold text-xs text-white">{seller.full_name || 'Seller'}</p>
                          {isVerified && <MetaVerifiedBadge size="xs" label="" />}
                        </div>
                        <p className="font-body text-[10px] text-white/35">
                          {new Date(post.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {post.post_type && (
                        <span className="ml-auto px-2 py-0.5 rounded-full font-body text-[9px] font-bold capitalize"
                          style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
                          {post.post_type}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-white/70 leading-relaxed">{post.content}</p>
                    {post.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={post.image_url} alt="" className="w-full max-h-80 object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/6">
                      <span className="font-body text-[11px] text-white/30">{post.likes || 0} likes</span>
                      <span className="font-body text-[11px] text-white/30">{post.comment_count || 0} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessage && user && (
          <MessageModal seller={seller} user={user} onClose={() => setShowMessage(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}