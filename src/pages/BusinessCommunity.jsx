import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import { Building2, Plus, Heart, MessageCircle, Image, Send, Megaphone, HelpCircle, Tag, RefreshCw, X, Share2, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POST_TYPES = [
  { value: 'update', label: 'Update', icon: RefreshCw, color: '#00D4FF' },
  { value: 'promo', label: 'Promo', icon: Tag, color: '#10b981' },
  { value: 'announcement', label: 'Announcement', icon: Megaphone, color: '#f59e0b' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: '#8b5cf6' },
];

function PostCard({ post, user, onLike }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const typeConfig = POST_TYPES.find(t => t.value === post.post_type) || POST_TYPES[0];

  const loadComments = async () => {
    const data = await base44.entities.ListingComment.filter({ listing_id: post.id, listing_type: 'static' }, '-created_date', 20);
    setComments(data);
  };

  const handleToggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(s => !s);
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    await base44.entities.ListingComment.create({
      listing_id: post.id,
      listing_type: 'static',
      user_email: user.email,
      user_name: user.full_name || user.email,
      comment: commentText.trim(),
    });
    await base44.entities.CommunityPost.update(post.id, { comment_count: (post.comment_count || 0) + 1 });
    setCommentText('');
    setSubmitting(false);
    loadComments();
  };

  const handleLike = async () => {
    if (!user || liked) return;
    setLiked(true);
    await base44.entities.CommunityPost.update(post.id, { likes: (post.likes || 0) + 1 });
    if (onLike) onLike(post.id);
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: post.business_name || 'Community post', text: post.content, url: window.location.href }).catch(() => {});
    else navigator.clipboard.writeText(window.location.href);
  };

  const handleReport = async () => {
    await base44.entities.Report.create({
      listing_id: post.id,
      listing_title: post.content?.slice(0, 80) || 'Community post',
      reporter_email: user?.email || 'anonymous',
      reporter_name: user?.full_name || 'Anonymous',
      reason: 'inappropriate',
      details: 'Reported from Business Communities',
      status: 'pending',
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0D1F3C', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Post header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body font-bold text-sm text-white">{post.business_name || 'Business'}</span>
            <span className="font-body text-[9px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${typeConfig.color}22`, color: typeConfig.color, border: `1px solid ${typeConfig.color}44` }}>
              {typeConfig.label}
            </span>
          </div>
          <p className="font-body text-[10px] text-white/35">
            {post.author_name} · {new Date(post.created_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="font-body text-sm text-white/80 leading-relaxed">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="" className="mt-3 w-full rounded-xl object-cover max-h-64" />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/8">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 font-body text-xs transition-colors ${liked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
          <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
        </button>
        <button onClick={handleToggleComments}
          className="flex items-center gap-1.5 font-body text-xs text-white/40 hover:text-blue-400 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comment_count || 0} comments</span>
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 font-body text-xs text-white/40 hover:text-green-400 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button onClick={handleReport}
          className="flex items-center gap-1.5 font-body text-xs text-white/40 hover:text-red-400 transition-colors">
          <Flag className="w-4 h-4" /> Report
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-white/8">
            <div className="p-4 space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold text-[9px]">
                    {(c.user_name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <p className="font-body text-[10px] font-semibold text-[#00D4FF]">{c.user_name}</p>
                    <p className="font-body text-xs text-white/70">{c.comment}</p>
                  </div>
                </div>
              ))}
              {user ? (
                <div className="flex gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center flex-shrink-0 mt-1 text-white font-bold text-[9px]">
                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleComment()}
                      placeholder="Write a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs font-body focus:outline-none focus:border-[#00D4FF] placeholder-white/20"
                    />
                    <button onClick={handleComment} disabled={submitting || !commentText.trim()}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold disabled:opacity-40 hover:bg-[#1d4ed8] transition-colors">
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-[10px] text-white/30 text-center py-2">Sign in to comment</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NewPostModal({ user, businesses, onClose, onCreated }) {
  const [bizId, setBizId] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('update');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImage = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await uploadMediaFileToSupabase(file);
    setImageUrl(file_url);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const biz = businesses.find(b => b.id === bizId);
    await base44.entities.CommunityPost.create({
      business_id: bizId || 'general',
      business_name: biz?.name || 'Community',
      author_name: user.full_name || user.email,
      author_email: user.email,
      content: content.trim(),
      image_url: imageUrl,
      post_type: postType,
      likes: 0,
      comment_count: 0,
    });
    setSubmitting(false);
    onCreated();
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="font-heading font-bold text-white">Create Post</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {businesses.length > 0 && (
            <select value={bizId} onChange={e => setBizId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-[#00D4FF]">
              <option value="" className="bg-[#0D1F3C]">Community / General</option>
              {businesses.map(b => <option key={b.id} value={b.id} className="bg-[#0D1F3C]">{b.name}</option>)}
            </select>
          )}
          <div className="flex gap-2 flex-wrap">
            {POST_TYPES.map(pt => (
              <button key={pt.value} onClick={() => setPostType(pt.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-semibold border-2 transition-all"
                style={{
                  borderColor: postType === pt.value ? pt.color : 'rgba(255,255,255,0.1)',
                  background: postType === pt.value ? `${pt.color}18` : 'transparent',
                  color: postType === pt.value ? pt.color : 'rgba(255,255,255,0.4)',
                }}>
                <pt.icon className="w-3 h-3" /> {pt.label}
              </button>
            ))}
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4}
            placeholder="Share an update, promotion, or question about your business..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-body focus:outline-none focus:border-[#00D4FF] resize-none placeholder-white/20" />
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="" className="w-full h-40 object-cover rounded-xl" />
              <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/40 transition-colors">
              {uploading ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <Image className="w-4 h-4 text-white/30" />}
              <span className="font-body text-xs text-white/30">{uploading ? 'Uploading...' : 'Add photo (optional)'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
            </label>
          )}
          <button onClick={handleSubmit} disabled={submitting || !content.trim()}
            className="w-full py-3 rounded-xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Posting...' : 'Post to Community'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BusinessCommunity() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [filterBiz, setFilterBiz] = useState('');

  const isSeller = user?.user_type === 'seller' || user?.user_type === 'business' || user?.is_seller || user?.account_type === 'business_owner';

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [postsData, bizData] = await Promise.all([
      base44.entities.CommunityPost.list('-created_date', 50),
      base44.entities.Business.list('-created_date', 50),
    ]);
    setPosts(postsData);
    setBusinesses(bizData);
    setLoading(false);
  };

  const filteredPosts = filterBiz ? posts.filter(p => p.business_id === filterBiz) : posts;

  return (
    <div className="min-h-screen bg-[#060F1E] pt-28">
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">Business Communities</h1>
            <p className="font-body text-sm text-white/40 mt-1">Updates, promos & announcements from local businesses</p>
          </div>
          {(isSeller || user?.role === 'admin') && (
            <button onClick={() => setShowNewPost(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
              <Plus className="w-4 h-4" /> Post
            </button>
          )}
        </div>

        {/* Business filter pills */}
        {businesses.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: 'none' }}>
            <button onClick={() => setFilterBiz('')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full font-body text-xs font-semibold border transition-all ${!filterBiz ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/25'}`}>
              All
            </button>
            {businesses.slice(0, 20).map(b => (
              <button key={b.id} onClick={() => setFilterBiz(filterBiz === b.id ? '' : b.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold border transition-all ${filterBiz === b.id ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/25'}`}>
                {b.logo_url && <img src={b.logo_url} alt="" className="w-4 h-4 rounded-full object-cover" />}
                {b.name}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-white/15 mx-auto mb-3" />
            <p className="font-body text-white/40">No community posts yet</p>
            {isSeller && <p className="font-body text-[#00D4FF] text-sm mt-2 cursor-pointer hover:underline" onClick={() => setShowNewPost(true)}>Be the first to post!</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} user={user} onLike={() => loadData()} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showNewPost && user && (
          <NewPostModal user={user} businesses={businesses} onClose={() => setShowNewPost(false)} onCreated={loadData} />
        )}
      </AnimatePresence>
    </div>
  );
}