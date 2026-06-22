import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Lock, Globe, X, Image as ImageIcon, Heart, MessageCircle, Share2, Send, ChevronLeft, Layers, Flag, Hourglass } from 'lucide-react';
import DoubleHeartAnimation from '../components/DoubleHeartAnimation';

const OWNER_EMAIL = 'Kevinarnold522@gmail.com';

export default function Groups() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [heartAnim, setHeartAnim] = useState(null); // post_id
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', description: '', category: '', is_private: false });
  const [postForm, setPostForm] = useState({ content: '', image_url: '', post_type: 'post' });
  const [openComments, setOpenComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('discover'); // discover | my-groups

  const isAdmin = user?.role === 'admin' || user?.email === OWNER_EMAIL;

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    loadGroups();
  }, []);

  useEffect(() => {
    if (user) loadMyMemberships();
  }, [user]);

  useEffect(() => {
    if (selectedGroup) loadPosts();
  }, [selectedGroup]);

  const loadGroups = async () => {
    const all = await base44.entities.Group.list('-created_date', 100);
    setGroups(all);
  };

  const loadMyMemberships = async () => {
    if (!user) return;
    const m = await base44.entities.GroupMember.filter({ user_email: user.email });
    setMyMemberships(m.map(x => x.group_id));
  };

  const loadPosts = async () => {
    if (!selectedGroup) return;
    const p = await base44.entities.GroupPost.filter({ group_id: selectedGroup.id }, '-created_date', 50);
    setPosts(p.filter(post => post.approval_status !== 'rejected' && (post.approval_status !== 'pending' || isAdmin || post.author_email === user?.email)));
    // Load likes for current user
    if (user) {
      const likes = await base44.entities.GroupPostLike.filter({ user_email: user.email });
      setLikedPosts(new Set(likes.map(l => l.post_id)));
    }
  };

  const loadComments = async (postId) => {
    const c = await base44.entities.GroupComment.filter({ post_id: postId }, 'created_date', 50);
    setComments(prev => ({ ...prev, [postId]: c }));
  };

  const handleCreateGroup = async () => {
    if (!user || !groupForm.name.trim()) return;
    setSaving(true);
    await base44.entities.Group.create({
      name: groupForm.name.trim(),
      description: groupForm.description.trim(),
      category: groupForm.category.trim(),
      is_private: groupForm.is_private,
      creator_email: user.email,
      creator_name: user.full_name || user.email,
      member_count: 1,
      approval_status: 'pending',
    });
    setGroupForm({ name: '', description: '', category: '', is_private: false });
    setShowCreateGroup(false);
    setSaving(false);
    loadGroups();
  };

  const handleJoinGroup = async (group) => {
    if (!user) return;
    const already = myMemberships.includes(group.id);
    if (already) return;
    await base44.entities.GroupMember.create({ group_id: group.id, user_email: user.email, user_name: user.full_name || user.email });
    await base44.entities.Group.update(group.id, { member_count: (group.member_count || 1) + 1 });
    loadMyMemberships();
    loadGroups();
  };

  const handleCreatePost = async () => {
    if (!user || !postForm.content.trim() || !selectedGroup) return;
    setSaving(true);
    await base44.entities.GroupPost.create({
      group_id: selectedGroup.id,
      author_email: user.email,
      author_name: user.full_name || user.email,
      author_picture: user.profile_picture || '',
      content: postForm.content.trim(),
      image_url: postForm.image_url,
      post_type: postForm.post_type,
      approval_status: 'pending',
      likes: 0,
      comment_count: 0,
    });
    setPostForm({ content: '', image_url: '', post_type: 'post' });
    setShowCreatePost(false);
    setSaving(false);
    loadPosts();
  };

  const handleLike = async (post) => {
    if (!user) return;
    const alreadyLiked = likedPosts.has(post.id);
    if (alreadyLiked) return; // one-time like only
    // Trigger heart animation
    setHeartAnim(post.id);
    await base44.entities.GroupPostLike.create({ post_id: post.id, user_email: user.email });
    await base44.entities.GroupPost.update(post.id, { likes: (post.likes || 0) + 1 });
    setLikedPosts(prev => new Set([...prev, post.id]));
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: (p.likes || 0) + 1 } : p));
  };

  const handleReportPost = async (post) => {
    await base44.entities.Report.create({
      listing_id: post.id,
      listing_title: post.content?.slice(0, 80) || 'Group post',
      reporter_email: user?.email || 'anonymous',
      reporter_name: user?.full_name || 'Anonymous',
      reason: 'inappropriate',
      details: `Reported from group: ${selectedGroup?.name || ''}`,
      status: 'pending',
    });
  };

  const handleComment = async (postId) => {
    if (!user || !newComment.trim()) return;
    await base44.entities.GroupComment.create({ post_id: postId, group_id: selectedGroup.id, author_email: user.email, author_name: user.full_name || user.email, content: newComment.trim() });
    const post = posts.find(p => p.id === postId);
    if (post) await base44.entities.GroupPost.update(postId, { comment_count: (post.comment_count || 0) + 1 });
    setNewComment('');
    loadComments(postId);
    loadPosts();
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await uploadMediaFileToSupabase(file);
    setPostForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
    e.target.value = '';
  };

  const handleApproveGroup = async (group) => {
    await base44.entities.Group.update(group.id, { approval_status: 'approved' });
    loadGroups();
  };

  const handleRejectGroup = async (group) => {
    await base44.entities.Group.update(group.id, { approval_status: 'rejected' });
    loadGroups();
  };

  const approvedGroups = groups.filter(g => g.approval_status === 'approved');
  const pendingGroups = groups.filter(g => g.approval_status === 'pending');
  const myGroups = approvedGroups.filter(g => myMemberships.includes(g.id) || g.creator_email === user?.email);

  const displayGroups = tab === 'my-groups' ? myGroups : approvedGroups;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#0033CC 0%,#001a80 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white/70 hover:text-white font-body text-sm">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-white text-xl">Groups</h1>
              <p className="font-body text-[11px] text-white/40">Join or create communities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button onClick={() => setShowCreateGroup(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                <Plus className="w-4 h-4" /> Create Group
              </button>
            )}
          </div>
        </div>

        {/* Admin pending approvals */}
        {isAdmin && pendingGroups.length > 0 && !selectedGroup && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <p className="font-body font-bold text-amber-300 text-sm mb-3 flex items-center gap-2"><Hourglass className="w-4 h-4" /> Pending Group Approvals ({pendingGroups.length})</p>
            <div className="space-y-2">
              {pendingGroups.map(g => (
                <div key={g.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 flex-wrap">
                  <div>
                    <p className="font-body font-bold text-white text-sm">{g.name}</p>
                    <p className="font-body text-xs text-white/40">{g.creator_name} · {g.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveGroup(g)} className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 font-body text-xs font-bold">Approve</button>
                    <button onClick={() => handleRejectGroup(g)} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-body text-xs font-bold">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group detail view */}
        {selectedGroup ? (
          <div>
            {/* Back */}
            <button onClick={() => setSelectedGroup(null)} className="flex items-center gap-2 text-white/60 hover:text-white font-body text-sm mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Groups
            </button>
            {/* Group header */}
            <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(236,72,153,0.2)' }}>
              {selectedGroup.cover_image && <img src={selectedGroup.cover_image} alt="" className="w-full h-32 object-cover" />}
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="font-heading font-bold text-white text-xl">{selectedGroup.name}</h2>
                    {selectedGroup.description && <p className="font-body text-sm text-white/50 mt-1">{selectedGroup.description}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 font-body text-xs text-white/40"><Users className="w-3.5 h-3.5" /> {selectedGroup.member_count || 1} members</span>
                      {selectedGroup.category && <span className="px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 font-body text-xs border border-pink-500/25">{selectedGroup.category}</span>}
                    </div>
                  </div>
                  {user && !myMemberships.includes(selectedGroup.id) && (
                    <button onClick={() => handleJoinGroup(selectedGroup)}
                      className="px-4 py-2 rounded-xl font-body font-bold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Create post */}
            {user && (myMemberships.includes(selectedGroup.id) || selectedGroup.creator_email === user.email) && (
              <div className="mb-5 rounded-2xl p-4" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {!showCreatePost ? (
                  <button onClick={() => setShowCreatePost(true)} className="w-full text-left font-body text-sm text-white/30 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors border border-white/8">
                    Write something in this group...
                  </button>
                ) : (
                  <div className="space-y-3">
                    <textarea value={postForm.content} onChange={e => setPostForm(f => ({ ...f, content: e.target.value }))}
                      rows={3} placeholder="What's on your mind?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-pink-400 resize-none" />
                    {postForm.image_url && <img src={postForm.image_url} alt="" className="w-full max-h-48 object-cover rounded-xl" />}
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <ImageIcon className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-body text-xs text-white/50">{uploading ? 'Uploading...' : 'Add Photo'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploading} />
                      </label>
                      <div className="ml-auto flex gap-2">
                        <button onClick={() => setShowCreatePost(false)} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-body text-xs text-white/50 hover:text-white">Cancel</button>
                        <button onClick={handleCreatePost} disabled={saving || !postForm.content.trim()}
                          className="px-4 py-1.5 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40"
                          style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                          {saving ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Posts feed */}
            <div className="space-y-4">
              {posts.length === 0 && (
                <div className="text-center py-16">
                  <Layers className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="font-body text-white/30 text-sm">No posts yet. Be the first to share!</p>
                </div>
              )}
              {posts.map(post => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Author */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {post.author_picture ? <img src={post.author_picture} alt="" className="w-full h-full object-cover" /> : (post.author_name?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body font-bold text-sm text-white">{post.author_name}</p>
                      <p className="font-body text-[10px] text-white/30">{new Date(post.created_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="px-4 pb-3">
                    <p className="font-body text-sm text-white/80 leading-relaxed whitespace-pre-line">{post.content}</p>
                  </div>
                  {/* Image */}
                  {post.image_url && (
                    <div className="relative mx-4 mb-3 rounded-xl overflow-hidden">
                      <img src={post.image_url} alt="" className="w-full max-h-72 object-cover" />
                      {/* Heart animation overlay */}
                      {heartAnim === post.id && (
                        <DoubleHeartAnimation onDone={() => setHeartAnim(null)} />
                      )}
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center gap-1 px-3 pb-3 border-t border-white/6 pt-2">
                    <button onClick={() => handleLike(post)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all ${likedPosts.has(post.id) ? 'text-blue-400' : 'text-white/40 hover:text-blue-400 hover:bg-blue-500/10'}`}>
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-blue-400' : ''}`} />
                      {post.likes || 0}
                    </button>
                    <button onClick={() => { setOpenComments(openComments === post.id ? null : post.id); if (openComments !== post.id) loadComments(post.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 font-body text-xs font-semibold transition-all">
                      <MessageCircle className="w-4 h-4" />
                      {post.comment_count || 0}
                    </button>
                    <button onClick={() => { if (navigator.share) navigator.share({ title: post.author_name, text: post.content }); else navigator.clipboard.writeText(window.location.href); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 font-body text-xs font-semibold transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleReportPost(post)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 font-body text-xs font-semibold transition-all">
                      <Flag className="w-4 h-4" /> Report
                    </button>
                    {post.approval_status === 'pending' && (
                      <span className="ml-auto px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 font-body text-[10px] font-bold">Pending approval</span>
                    )}
                  </div>
                  {/* Comments section */}
                  <AnimatePresence>
                    {openComments === post.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/6">
                        <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
                          {(comments[post.id] || []).map(c => (
                            <div key={c.id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-lg bg-pink-500/30 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{c.author_name?.[0]?.toUpperCase()}</div>
                              <div className="bg-white/5 rounded-xl px-3 py-1.5 flex-1">
                                <p className="font-body text-[10px] font-bold text-white/70">{c.author_name}</p>
                                <p className="font-body text-xs text-white/60">{c.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {user && (
                          <div className="flex gap-2 px-4 pb-3">
                            <input value={newComment} onChange={e => setNewComment(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                              placeholder="Write a comment..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-pink-400" />
                            <button onClick={() => handleComment(post.id)} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                              <Send className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {['discover', 'my-groups'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl font-body font-bold text-sm transition-all ${tab === t ? 'text-white' : 'text-white/40 hover:text-white bg-white/5'}`}
                  style={tab === t ? { background: 'linear-gradient(135deg,#ec4899,#a855f7)' } : {}}>
                  {t === 'discover' ? <><Globe className="w-4 h-4 inline mr-1" /> Discover</> : <><Users className="w-4 h-4 inline mr-1" /> My Groups</>}
                </button>
              ))}
            </div>

            {/* Groups grid */}
            {displayGroups.length === 0 ? (
              <div className="text-center py-24">
                <Layers className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="font-body text-white/30 text-sm">{tab === 'my-groups' ? "You haven't joined any groups yet." : 'No approved groups yet. Create the first one!'}</p>
                {tab === 'discover' && user && (
                  <button onClick={() => setShowCreateGroup(true)} className="mt-4 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                    <Plus className="w-4 h-4 inline mr-1" /> Create Group
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayGroups.map(group => {
                  const isMember = myMemberships.includes(group.id) || group.creator_email === user?.email;
                  return (
                    <motion.div key={group.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                      style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(236,72,153,0.15)' }}
                      onClick={() => setSelectedGroup(group)}>
                      {group.cover_image ? (
                        <img src={group.cover_image} alt="" className="w-full h-24 object-cover" />
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(168,85,247,0.2))' }}>
                          <Layers className="w-8 h-8 text-pink-400/40" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-heading font-bold text-white text-sm leading-tight">{group.name}</h3>
                          {group.is_private ? <Lock className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" /> : <Globe className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" />}
                        </div>
                        {group.description && <p className="font-body text-[11px] text-white/40 mb-2 line-clamp-2">{group.description}</p>}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 font-body text-[10px] text-white/30"><Users className="w-3 h-3" />{group.member_count || 1}</span>
                          {isMember ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 font-body text-[10px] border border-green-500/25">Joined</span>
                          ) : (
                            <button onClick={e => { e.stopPropagation(); handleJoinGroup(group); }}
                              className="px-2.5 py-1 rounded-lg font-body text-[10px] font-bold text-white"
                              style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateGroup(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#0D1F3C', border: '1px solid rgba(236,72,153,0.3)' }}>
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">Create a Group</h3>
                <button onClick={() => setShowCreateGroup(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {!user && <p className="font-body text-sm text-amber-300 bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-500/20">Please log in to create a group.</p>}
                <p className="font-body text-xs text-white/40 bg-white/5 rounded-xl px-3 py-2 border border-white/8 flex items-center gap-2"><Hourglass className="w-4 h-4 text-amber-300" /> New groups require admin approval before they become visible.</p>
                <div>
                  <label className="block font-body text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Group Name *</label>
                  <input value={groupForm.name} onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Manila Sneakers Community"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-pink-400" />
                </div>
                <div>
                  <label className="block font-body text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Description</label>
                  <textarea value={groupForm.description} onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="What is this group about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-pink-400 resize-none" />
                </div>
                <div>
                  <label className="block font-body text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Category</label>
                  <input value={groupForm.category} onChange={e => setGroupForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Sneakers, Food, Cars..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-pink-400" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={groupForm.is_private} onChange={e => setGroupForm(f => ({ ...f, is_private: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="font-body text-sm text-white/60">Private group</span>
                </label>
                <button onClick={handleCreateGroup} disabled={saving || !groupForm.name.trim() || !user}
                  className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-white disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                  {saving ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}