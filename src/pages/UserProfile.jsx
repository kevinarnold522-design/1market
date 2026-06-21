import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, MapPin, Phone, Save, User, Facebook, Instagram, Youtube, LogOut } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import { useAuth } from '@/lib/AuthContext';
import { clearGhostSession, getGhostSession, saveGhostSession } from '@/lib/ghostAccounts';

function RotatingImage({ images, fallback, alt, className }) {
  const [index, setIndex] = useState(0);
  const clean = images.filter(Boolean);
  useEffect(() => {
    if (clean.length < 2) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % clean.length), 3500);
    return () => clearInterval(timer);
  }, [clean.length]);
  const src = clean[index] || fallback;
  return src ? <AnimatePresence mode="wait"><motion.img key={src} src={src} alt={alt} className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} /></AnimatePresence> : null;
}

export default function UserProfile() {
  const { user: authUser, logout } = useAuth();
  const ghost = getGhostSession();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ full_name: '', username: '', email: '', bio: '', phone: '', location: '', channel_name: '', social_facebook: '', social_instagram: '', social_youtube: '', social_tiktok: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [toast, setToast] = useState('');

  const loadUser = async () => {
    const me = ghost || await base44.auth.me();
    setUser(me);
    setForm({
      full_name: me.full_name || '',
      username: me.username || '',
      email: me.email || '',
      bio: me.bio || '',
      phone: me.phone || '',
      location: me.location || me.seller_location || '',
      channel_name: me.channel_name || '',
      social_facebook: me.social_facebook || '',
      social_instagram: me.social_instagram || '',
      social_youtube: me.social_youtube || '',
      social_tiktok: me.social_tiktok || '',
    });
  };

  useEffect(() => { loadUser().catch(() => {}); }, []);

  const updateUser = async (data) => {
    if (ghost) {
      const updated = { ...ghost, ...data };
      if (!String(ghost.id || '').startsWith('ghost_')) {
        await base44.entities.User.update(ghost.id, data).catch(() => null);
      }
      const savedGhost = saveGhostSession({ ...updated, linked_email: updated.email, ghost_linked: !!updated.email });
      const localKey = `1m_ghost_${savedGhost.ghost_id || savedGhost.id}`;
      localStorage.setItem(localKey, JSON.stringify(savedGhost));
      setUser(savedGhost);
      window.dispatchEvent(new CustomEvent('active-user-changed', { detail: savedGhost }));
      return;
    }
    const updated = await base44.auth.updateMe(data);
    const merged = { ...(user || {}), ...(updated || data) };
    setUser(merged);
    window.dispatchEvent(new CustomEvent('active-user-changed', { detail: merged }));
    window.dispatchEvent(new CustomEvent('supabase-auth-changed', { detail: merged }));
  };

  const saveProfile = async () => {
    setSaving(true);
    const { email, ...regularProfile } = form;
    await updateUser(ghost ? { ...form, email: email.trim() } : regularProfile);
    setSaving(false);
    setToast('Profile saved');
    setTimeout(() => setToast(''), 1800);
  };

  const uploadImage = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(type);
    try {
      const { file_url } = await uploadMediaFileToSupabase(file, type === 'cover' ? 'profiles/covers' : 'profiles/avatars');
      const patch = type === 'cover'
        ? { cover_photo: file_url }
        : { profile_picture: file_url };
      await updateUser(patch);
      setToast(type === 'cover' ? 'Cover photo uploaded' : 'Profile photo uploaded');
      setTimeout(() => setToast(''), 1800);
    } catch (error) {
      setToast(error.message || 'Upload failed');
      setTimeout(() => setToast(''), 2200);
    }
    setUploading('');
    e.target.value = '';
  };

  if (!authUser && !ghost) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold">Sign in</button></div>;
  }
  if (!user) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" /></div>;

  const initials = (user.full_name || user.email || 'U').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const profileImages = [user.profile_picture, ...(user.profile_photos || [])].filter(Boolean);
  const coverImages = [user.cover_photo, ...(user.cover_photos || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-sm mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="relative h-56 bg-gradient-to-br from-blue-700 to-sky-400 overflow-hidden">
            <RotatingImage images={coverImages} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/45 to-transparent" />
            <label className="absolute right-4 bottom-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-sm cursor-pointer shadow-lg">
              <Camera className="w-4 h-4" /> {uploading === 'cover' ? 'Uploading...' : 'Add cover photo'}
              <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'cover')} disabled={uploading === 'cover'} />
            </label>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-20 mb-8">
              <div className="relative w-32 h-32 rounded-3xl border-4 border-white bg-blue-600 shadow-xl overflow-hidden flex items-center justify-center text-white text-4xl font-bold">
                {profileImages.length ? <RotatingImage images={profileImages} alt="Profile" className="absolute inset-0 w-full h-full object-cover" /> : initials}
                <label className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center cursor-pointer border-2 border-white">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'profile')} disabled={uploading === 'profile'} />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-slate-950">{form.full_name || 'My Profile'}</h1>
                <p className="text-blue-700 font-semibold text-sm">{ghost ? (form.email || 'No linked email') : user.email}</p>
              </div>
              <button onClick={() => { if (ghost) { clearGhostSession(); window.location.href = '/'; } else { logout(true); } }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 font-semibold text-sm"><LogOut className="w-4 h-4" /> Sign out</button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[['full_name','Full name', User], ['username','Username', User], ['channel_name','Public display name', User], ['email','Email', Mail], ['phone','Phone', Phone], ['location','Location', MapPin]].map(([key, label, Icon]) => (
                <div key={key}>
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <input disabled={key === 'email' && !ghost} value={key === 'email' ? (ghost ? form.email || '' : user.email || '') : form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={key === 'email' && ghost ? 'Link any email address' : ''} className="w-full pl-10 pr-3 py-3 rounded-xl border border-blue-100 bg-blue-50/40 text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-70" />
                  </div>
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} className="w-full px-3 py-3 rounded-xl border border-blue-100 bg-blue-50/40 text-slate-900 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              {[['social_facebook','Facebook', Facebook], ['social_instagram','Instagram', Instagram], ['social_youtube','YouTube', Youtube], ['social_tiktok','TikTok', TikTokIcon]].map(([key, label, Icon]) => (
                <div key={key}>
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1 block">{label}</label>
                  <div className="relative"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" /><input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="https://" className="w-full pl-10 pr-3 py-3 rounded-xl border border-blue-100 bg-blue-50/40 text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-3">
              <button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save profile'}</button>
              {toast && <span className="text-blue-700 font-semibold text-sm">{toast}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}