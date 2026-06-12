import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Shield, LogOut, Star, ShoppingBag, Package,
  Heart, Settings, Store, MapPin, Bell, ShoppingCart, CheckCircle,
  History, Edit2, Check, X, AlertCircle, BadgeCheck, Truck, FileText,
  Plus, Pencil, Trash2, Save, Upload, Eye, Globe, Search, BarChart2,
  Youtube, Instagram, Facebook, Camera, UserPlus, UserCheck, Building2, Gift
} from 'lucide-react';
import SellerAnalytics from '../components/seller/SellerAnalytics';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getImpersonatedUser } from '@/pages/ConnectedAccounts';
import ParticleBackground from '../components/ParticleBackground';
import OrdersTab from '../components/seller/OrdersTab';
import VerifiedPartnerBanner from '../components/VerifiedPartnerBanner';
import MetaVerifiedBadge from '../components/MetaVerifiedBadge';
import OneCheckmark from '../components/OneCheckmark';
import PaymentSettings from '../components/settings/PaymentSettings';
import BecomeSellerModal from '../components/BecomeSellerModal';
import BecomeBusinessModal from '../components/BecomeBusinessModal';
import DailyRewardsTracker from '../components/DailyRewardsTracker';
import FacebookLiveConnector from '../components/FacebookLiveConnector';
import MenuManager from '../components/seller/MenuManager';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const LISTING_TYPES = ['product','shoes','cars','houses','electronics','clothing','furniture','food','services','other'];
const SUBCATEGORIES_MAP = {
  electronics:['Smartphones','Laptops','Tablets','Cameras','Audio','Gaming','TV & Displays','Smart Devices','Accessories'],
  shoes:['Sneakers','Formal','Sandals','Boots','Sports','Kids'],
  clothing:["Men's Tops","Women's Tops",'Bottoms','Outerwear','Formal','Activewear','Kids'],
  cars:['Sedan','SUV','Van','Pickup','Motorcycle','Truck'],
  houses:['House & Lot','Condominium','Townhouse','Vacant Lot','Commercial'],
  services:['Home Services','Tech & Digital','Beauty & Wellness','Events','Transport','Professional'],
  furniture:['Living Room','Bedroom','Office','Outdoor','Kitchen'],
  food:['Baked Goods','Meals','Beverages','Snacks','Ingredients'],
  product:['General','Health & Beauty','Sports','Toys','Books','Tools'],
  other:['Miscellaneous'],
};
const LOCATIONS = ['Manila','Cavite','Cebu','Davao','Nationwide'];
const CONDS = ['Brand New','Like New','Used','N/A'];
const EMPTY_FORM = {
  title:'',type:'product',subcategory:'',location:'Manila',area:'',
  seller_name:'',phone:'',description:'',image_url:'',
  extra_images:[],price:'',price_label:'',condition:'Brand New',
  brand:'',model:'',size:'',warranty:'',specs:'',is_active:true,
};

function Field({ label, value, onChange, type='text', placeholder='', required=false }) {
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {type==='textarea'
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-20 focus:outline-none focus:border-[#00D4FF] bg-white/5 text-white placeholder-white/20"/>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF] bg-white/5 placeholder-white/20"/>
      }
    </div>
  );
}

function ImageUploader({ images, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onAdd(file_url); setUploading(false); e.target.value='';
  };
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">Photos</label>
      <div className="flex flex-wrap gap-2">
        {images.map((url,i)=>(
          <div key={i} className="relative group">
            <img src={url} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10"/>
            <button onClick={()=>onRemove(i)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
        <label className={`w-14 h-14 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-[#00D4FF]/40 transition-colors ${uploading?'opacity-50':''}`}>
          {uploading ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin"/> : <><Upload className="w-3.5 h-3.5 text-white/25"/><span className="font-body text-[8px] text-white/25 mt-0.5">Add</span></>}
          <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={uploading}/>
        </label>
      </div>
    </div>
  );
}

// Quick inline image-swap button on listing thumbnail
function QuickImageUpload({ itemId, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const ref = React.useRef(null);
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Listing.update(itemId, { image_url: file_url });
    onUploaded(file_url);
    setUploading(false);
    e.target.value = '';
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle}/>
      <button onClick={() => ref.current?.click()} disabled={uploading}
        className="absolute bottom-0 left-0 w-11 h-11 rounded-xl flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Change photo">
        {uploading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-[#00D4FF] rounded-full animate-spin"/> : <Upload className="w-3.5 h-3.5 text-white"/>}
      </button>
    </>
  );
}

function ListingForm({ form, setF, onSave, onSaveDraft, onCancel, editing }) {
  const isElec = form.type === 'electronics';
  const subcatOpts = SUBCATEGORIES_MAP[form.type] || ['General'];
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceResults, setPriceResults] = useState(null);

  const runPriceSearch = async () => {
    if (!form.title) return;
    setPriceLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Find current Philippine prices for: "${form.title}"${form.brand?` by ${form.brand}`:''}.`,
      add_context_from_internet: true,
      response_json_schema: { type:'object', properties:{ suggested_price_php:{type:'string'}, market_insight:{type:'string'} } },
    });
    setPriceResults(res); setPriceLoading(false);
  };

  const handleAddImage = (url) => {
    const imgs = [...(form.extra_images||[]), url];
    setF('extra_images', imgs);
    if (!form.image_url) setF('image_url', url);
  };
  const handleRemoveImage = (idx) => {
    const imgs = (form.extra_images||[]).filter((_,i)=>i!==idx);
    setF('extra_images', imgs);
    if (form.image_url===(form.extra_images||[])[idx]) setF('image_url', imgs[0]||'');
  };

  return (
    <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
      className="mb-5 rounded-2xl border border-white/10 p-4 space-y-3" style={{background:'rgba(13,31,60,0.9)'}}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-white text-sm">{editing?'Edit Listing':'Add New Listing'}</h3>
        <button onClick={onCancel}><X className="w-4 h-4 text-white/40 hover:text-white"/></button>
      </div>
      <ImageUploader images={form.extra_images||(form.image_url?[form.image_url]:[])} onAdd={handleAddImage} onRemove={handleRemoveImage}/>
      <Field label="Or Paste Image URL" value={form.image_url} onChange={v=>setF('image_url',v)} placeholder="https://..."/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1"><Field label="Title" value={form.title} onChange={v=>setF('title',v)} placeholder="e.g. Samsung S24" required/></div>
        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Category <span className="text-red-400">*</span></label>
          <select value={form.type} onChange={e=>{setF('type',e.target.value);setF('subcategory','');}}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {LISTING_TYPES.map(t=><option key={t} value={t} className="bg-[#0D1F3C] capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Subcategory</label>
          <select value={form.subcategory} onChange={e=>setF('subcategory',e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            <option value="" className="bg-[#0D1F3C]">— Select —</option>
            {subcatOpts.map(s=><option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Location</label>
          <select value={form.location} onChange={e=>setF('location',e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {LOCATIONS.map(l=><option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Condition</label>
          <select value={form.condition} onChange={e=>setF('condition',e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {CONDS.map(c=><option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
          </select>
        </div>
        <Field label="Area" value={form.area} onChange={v=>setF('area',v)} placeholder="e.g. BGC"/>
        <Field label="Price (₱)" value={form.price} onChange={v=>setF('price',v)} type="number" placeholder="0"/>
        <Field label="Price Display" value={form.price_label} onChange={v=>setF('price_label',v)} placeholder="₱3,500 neg"/>
        <Field label="Brand" value={form.brand} onChange={v=>setF('brand',v)} placeholder="e.g. Samsung"/>
        <Field label="Model / Size" value={form.model||form.size} onChange={v=>{setF('model',v);setF('size',v);}} placeholder="256GB / US10"/>
        <Field label="Contact #" value={form.phone} onChange={v=>setF('phone',v)} placeholder="+63 9xx"/>
      </div>
      {isElec && (
        <div className="rounded-xl p-3 space-y-2.5" style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.2)'}}>
          <p className="font-body text-[10px] text-[#00D4FF] font-semibold">📱 Electronics — Warranty & Specs Required</p>
          <Field label="Warranty" value={form.warranty} onChange={v=>setF('warranty',v)} placeholder="1 Year PH Warranty" required/>
          <Field label="Full Specifications" value={form.specs} onChange={v=>setF('specs',v)} type="textarea" placeholder="Specs..." required/>
        </div>
      )}
      <Field label="Description" value={form.description} onChange={v=>setF('description',v)} type="textarea" placeholder="Describe your item..."/>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="item-active" checked={form.is_active} onChange={e=>setF('is_active',e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]"/>
        <label htmlFor="item-active" className="font-body text-xs text-white/50">Publish publicly</label>
      </div>
      {priceResults && (
        <div className="rounded-xl p-3" style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.15)'}}>
          <p className="font-body text-[10px] text-[#00D4FF] font-bold">💡 Suggested: {priceResults.suggested_price_php}</p>
          {priceResults.market_insight && <p className="font-body text-[9px] text-white/40">{priceResults.market_insight}</p>}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-semibold text-xs transition-colors">
          <Save className="w-3.5 h-3.5"/> {editing?'Update':'Publish'}
        </button>
        <button onClick={onSaveDraft} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
          <FileText className="w-3.5 h-3.5"/> Save as Draft
        </button>
        {form.title && (
          <button onClick={runPriceSearch} disabled={priceLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body text-xs font-semibold disabled:opacity-50">
            {priceLoading ? <div className="w-3 h-3 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin"/> : <Search className="w-3 h-3"/>}
            AI Price Check
          </button>
        )}
        <button onClick={onCancel} className="px-4 py-2 border border-white/10 text-white/40 rounded-xl font-body text-xs hover:bg-white/5 transition-colors">Cancel</button>
      </div>
    </motion.div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────
function TabBtn({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-body text-xs font-semibold transition-all whitespace-nowrap relative ${active ? 'bg-[#2563EB] text-white' : 'text-white/40 hover:text-white'}`}>
      <Icon className="w-3.5 h-3.5"/>
      <span className="hidden sm:inline">{label}</span>
      {badge > 0 && <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center">{badge}</span>}
    </button>
  );
}

// ─── Username edit inline ─────────────────────────────────────────────────────
function UsernameEditor({ user, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(user.username || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = (v) => {
    if (v.length < 3) return 'At least 3 characters';
    if (v.length > 24) return 'Max 24 characters';
    if (!/^[a-zA-Z0-9_.-]+$/.test(v)) return 'Letters, numbers, _ . - only';
    return '';
  };

  const save = async () => {
    const err = validate(val);
    if (err) { setError(err); return; }
    setSaving(true);
    const existing = await base44.entities.User.filter({ username: val.toLowerCase() });
    if (existing.some(u => u.id !== user.id)) {
      setError('Username already taken.'); setSaving(false); return;
    }
    await base44.auth.updateMe({ username: val.toLowerCase(), username_set: true });
    setSaving(false); setEditing(false); setError('');
    onSaved();
  };

  return editing ? (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span className="font-body text-sm text-white/30">@</span>
        <input value={val} onChange={e=>{setVal(e.target.value.replace(/\s/g,''));setError('');}}
          className="flex-1 bg-white/5 border border-[#00D4FF]/40 rounded-lg px-2 py-1 text-white font-body text-xs focus:outline-none"
          autoFocus onKeyDown={e=>{if(e.key==='Enter')save();if(e.key==='Escape')setEditing(false);}}/>
        <button onClick={save} disabled={saving} className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center">
          {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"/> : <Check className="w-3 h-3 text-[#0A192F]"/>}
        </button>
        <button onClick={()=>setEditing(false)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-3 h-3 text-white/50"/>
        </button>
      </div>
      {error && <p className="font-body text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{error}</p>}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <span className="font-heading font-bold text-base text-white">
        {user.username ? `@${user.username}` : user.full_name || 'Set Username'}
      </span>
      <button onClick={()=>{setVal(user.username||'');setEditing(true);}}
        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
        <Edit2 className="w-3 h-3 text-white/50"/>
      </button>
    </div>
  );
}

// ─── Helpers to update ghost user data ───────────────────────────────────────
const updateGhostUser = async (ghostId, data) => {
  // Update in sessionStorage
  const session = JSON.parse(sessionStorage.getItem('1m_ghost_session') || 'null');
  if (session) {
    const updated = { ...session, ...data };
    sessionStorage.setItem('1m_ghost_session', JSON.stringify(updated));
  }
  // Update in DB if this ghost exists as a real User record
  try {
    const users = await base44.entities.User.filter({ ghost_id: ghostId });
    if (users.length > 0) {
      await base44.entities.User.update(users[0].id, data);
    } else {
      // Try by ID directly
      const byId = await base44.entities.User.filter({ id: ghostId });
      if (byId.length > 0) await base44.entities.User.update(byId[0].id, data);
    }
  } catch (e) {}
};

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function UserProfile() {
  const { user: authUser, logout } = useAuth();
  const ghostSession = getImpersonatedUser();
  const isGhostMode = !!ghostSession;
  const [user, setUser] = useState(null);
  const urlTab = new URLSearchParams(window.location.search).get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(urlTab);
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showFBLive, setShowFBLive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [listings, setListings] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seller form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setFormState] = useState(EMPTY_FORM);
  const setF = (field, val) => setFormState(f => ({ ...f, [field]: val }));

  // Settings
  const [locationVal, setLocationVal] = useState('Manila');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [sellerBio, setSellerBio] = useState('');
  const [sellerPageEnabled, setSellerPageEnabled] = useState(false);
  const [toast, setToast] = useState('');
  // Profile extras
  const [bio, setBio] = useState('');
  const [channelName, setChannelName] = useState('');
  const [socialFb, setSocialFb] = useState('');
  const [socialIg, setSocialIg] = useState('');
  const [socialYt, setSocialYt] = useState('');
  const [socialTt, setSocialTt] = useState('');
  const [showPhonePublic, setShowPhonePublic] = useState(false);
  const [showEmailPublic, setShowEmailPublic] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPfp, setUploadingPfp] = useState(false);

  const showSaved = (msg) => { setSavedMsg(msg); setTimeout(() => setSavedMsg(''), 2500); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const refresh = async (me) => {
    const listingId = me.id;
    const [o, so, c, f, items, draftItems] = await Promise.all([
      base44.entities.Order.filter({ buyer_email: me.email }),
      base44.entities.Order.filter({ seller_email: me.email }),
      base44.entities.Cart.filter({ user_email: me.email }),
      base44.entities.Favourite.filter({ user_email: me.email }),
      base44.entities.Listing.filter({ created_by_id: listingId }),
      base44.entities.DraftListing.filter({ created_by_id: listingId }),
    ]);
    setOrders(o); setSellerOrders(so); setCart(c); setFavourites(f);
    setListings(items); setDrafts(draftItems);
  };

  useEffect(() => {
    const init = async () => {
      try {
        let me;
        if (isGhostMode) {
          // Use ghost session data — try to load fresh from DB if available
          const ghost = ghostSession;
          try {
            const dbUsers = await base44.entities.User.filter({ ghost_id: ghost.id || ghost.ghost_id });
            me = dbUsers.length > 0 ? { ...ghost, ...dbUsers[0] } : ghost;
          } catch {
            me = ghost;
          }
        } else {
          me = await base44.auth.me();
        }
        setUser(me);
        setLocationVal(me.location || me.seller_location || 'Manila');
        setSellerBio(me.seller_bio || '');
        setSellerPageEnabled(me.seller_page_enabled || false);
        setBio(me.bio || '');
        setChannelName(me.channel_name || '');
        setSocialFb(me.social_facebook || '');
        setSocialIg(me.social_instagram || '');
        setSocialYt(me.social_youtube || '');
        setSocialTt(me.social_tiktok || '');
        setShowPhonePublic(me.show_phone_public || false);
        setShowEmailPublic(me.show_email_public || false);
        await refresh(me);
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  const reloadUser = async () => {
    if (isGhostMode) {
      const ghost = getImpersonatedUser();
      try {
        const dbUsers = await base44.entities.User.filter({ ghost_id: ghost.id || ghost.ghost_id });
        const me = dbUsers.length > 0 ? { ...ghost, ...dbUsers[0] } : ghost;
        setUser(me);
        return me;
      } catch {
        setUser(ghost);
        return ghost;
      }
    }
    const me = await base44.auth.me();
    setUser(me);
    return me;
  };

  if (!authUser && !loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6">
          <User className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-white mb-2">Sign In Required</h2>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  const initials = user ? (user.full_name || user.username || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '..';
  const memberSince = user?.created_date ? new Date(user.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';
  const completedOrders = orders.filter(o => o.status === 'completed');
  const isVerified = user?.is_verified_seller;
  const isSeller = user?.user_type === 'seller' || user?.user_type === 'business' || user?.is_seller || user?.account_type === 'business_owner';
  const isBusiness = user?.user_type === 'business';
  const isSellerOnly = user?.user_type === 'seller';
  const isCustomer = !isSeller && !isBusiness;
  const isPendingBusiness = user?.business_pending === true;
  const isAdmin = !isGhostMode && user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const pendingSellerOrders = sellerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  const updateUser = async (data) => {
    if (isGhostMode) {
      await updateGhostUser(ghostSession.id || ghostSession.ghost_id, data);
    } else {
      await base44.auth.updateMe(data);
    }
  };

  const uploadCover = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingCover(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await updateUser({ cover_photo: file_url });
    await reloadUser();
    setUploadingCover(false);
    showToast('Cover photo updated!');
    e.target.value = '';
  };

  const uploadPfp = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingPfp(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await updateUser({ profile_picture: file_url });
    await reloadUser();
    setUploadingPfp(false);
    showToast('Profile picture updated!');
    e.target.value = '';
  };

  const saveProfileInfo = async () => {
    setSaving(true);
    await updateUser({
      bio,
      channel_name: channelName,
      social_facebook: socialFb,
      social_instagram: socialIg,
      social_youtube: socialYt,
      social_tiktok: socialTt,
      show_phone_public: showPhonePublic,
      show_email_public: showEmailPublic,
    });
    await reloadUser();
    setSaving(false);
    showSaved('Profile saved!');
  };

  // Build tabs based on account type
  const TABS = [
    { key: 'profile',    label: 'Profile',      icon: User },
    { key: 'orders',     label: 'My Orders',    icon: History },
    { key: 'cart',       label: 'Cart',         icon: ShoppingCart },
    { key: 'favourites', label: 'Favourites',   icon: Heart },
    ...(isSeller ? [
      { key: 'listings',   label: 'Listings',   icon: Package },
      { key: 'drafts',     label: 'Drafts',     icon: FileText },
      { key: 'sellerorders', label: 'Seller Orders', icon: Truck, badge: pendingSellerOrders.length },
      { key: 'sellerpage', label: 'Seller Page', icon: Globe },
      { key: 'analytics',  label: 'Analytics',  icon: BarChart2 },
    ] : []),
    { key: 'settings',   label: 'Settings',     icon: Settings },
  ];

  // Seller actions
  const openAdd = () => {
    setFormState({ ...EMPTY_FORM, seller_name: user?.full_name || '', area: user?.seller_area || '', location: user?.seller_location || 'Manila' });
    setEditing(null); setShowForm(true);
  };
  const openEdit = (item) => {
    setFormState({ ...EMPTY_FORM, ...item, price: String(item.price || ''), year: String(item.year || '') });
    setEditing(item); setShowForm(true);
  };

  const saveListing = async () => {
    if (!form.title) return showToast('Please add a title');
    const imgs = form.extra_images || [];
    const mainImage = form.image_url || imgs[0] || '';
    const extras = mainImage && imgs[0] === mainImage ? imgs.slice(1) : imgs;
    const channelDisplayName = user?.channel_name || user?.full_name || form.seller_name;
    const data = { ...form, price: Number(form.price) || 0, image_url: mainImage, extra_images: extras, seller_name: channelDisplayName, approval_status: 'pending' };
    // For ghost accounts, explicitly set created_by_id so listings are tied to the ghost
    if (isGhostMode && user?.id) data.created_by_id = user.id;
    if (editing) { await base44.entities.Listing.update(editing.id, data); showToast('Updated! Pending re-review.'); }
    else { await base44.entities.Listing.create(data); showToast('Submitted for review!'); }
    setShowForm(false); setEditing(null);
    const items = await base44.entities.Listing.filter({ created_by_id: user.id });
    setListings(items);
  };

  const saveDraft = async () => {
    if (!form.title) return showToast('Add a title first');
    await base44.entities.DraftListing.create({ ...form, price: Number(form.price) || 0, seller_name: user?.full_name || form.seller_name });
    showToast('Saved as draft!'); setShowForm(false); setEditing(null);
    const draftItems = await base44.entities.DraftListing.filter({ created_by_id: user.id });
    setDrafts(draftItems);
  };

  const removeListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await base44.entities.Listing.delete(id);
    setListings(prev => prev.filter(i => i.id !== id)); showToast('Deleted.');
  };

  const deleteDraft = async (id) => {
    await base44.entities.DraftListing.delete(id);
    setDrafts(prev => prev.filter(d => d.id !== id)); showToast('Draft deleted.');
  };

  const publishDraft = async (draft) => {
    const { id, created_date, updated_date, created_by, ...data } = draft;
    await base44.entities.Listing.create({ ...data, is_active: true });
    await base44.entities.DraftListing.delete(id);
    showToast('Published!');
    const [items, draftItems] = await Promise.all([
      base44.entities.Listing.filter({ created_by_id: user.id }),
      base44.entities.DraftListing.filter({ created_by_id: user.id }),
    ]);
    setListings(items); setDrafts(draftItems);
  };

  const confirmDelivery = async (order) => {
    const updated = await base44.entities.Order.update(order.id, {
      seller_confirmed_delivery: true,
      status: order.buyer_confirmed_received ? 'completed' : 'seller_confirmed',
    });
    setSellerOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updated } : o));
  };

  const confirmReceived = async (order) => {
    const updated = await base44.entities.Order.update(order.id, {
      buyer_confirmed_received: true,
      status: order.seller_confirmed_delivery ? 'completed' : 'buyer_confirmed',
    });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updated } : o));
  };

  const saveSettings = async (data) => {
    setSaving(true);
    await updateUser(data);
    await reloadUser();
    setSaving(false); showSaved('Saved!');
  };

  const saveSellerPage = async () => {
    await updateUser({ seller_bio: sellerBio, seller_page_enabled: sellerPageEnabled });
    await reloadUser(); showToast('Seller page updated!');
  };

  const submitVerification = async (docs) => {
    await base44.entities.VerificationApplication.create({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name || user.username || user.email,
      account_type: user.account_type || 'seller',
      doc1_url: docs[0]?.url || '',
      doc1_label: docs[0]?.label || 'Document 1',
      doc2_url: docs[1]?.url || '',
      doc2_label: docs[1]?.label || 'Document 2',
      doc3_url: docs[2]?.url || '',
      doc3_label: docs[2]?.label || 'Document 3',
      status: 'pending',
    });
    await base44.auth.updateMe({ verification_submitted: true });
    await reloadUser(); showToast('Verification request submitted! Admin will review within 24-48 hrs.');
  };

  const approveVerification = async (targetUser) => {
    await base44.auth.updateMe({ is_verified_seller: true });
    await reloadUser();
    // Trigger verified partner email
    try {
      await base44.functions.invoke('sendVerifiedPartnerEmail', {
        email: targetUser.email,
        name: targetUser.full_name,
        business_name: targetUser.full_name
      });
    } catch (e) {}
    showToast('Verification approved! Email sent.');
  };

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-3 py-6 pt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-4 font-body text-xs">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to 1Market.ph
        </Link>

        {/* Profile Header */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl mb-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.15)' }}>
            {/* Cover Photo */}
            <div className="relative h-28 w-full overflow-hidden"
              style={{ background: user.cover_photo ? 'none' : 'linear-gradient(135deg,#0D1F3C,#1e3a5f)' }}>
              {user.cover_photo && <img src={user.cover_photo} alt="cover" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/80 to-transparent pointer-events-none" />
              <label className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white/70 font-body text-[10px] cursor-pointer hover:bg-black/70 transition-colors">
                {uploadingCover ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-3 h-3" />}
                Cover
                <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={uploadingCover} />
              </label>
            </div>

            <div className="p-4 -mt-8 relative">
            <div className="flex items-end gap-3 mb-3">
              <div className="relative flex-shrink-0">
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt="pfp" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#070F1A]" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-heading font-bold text-2xl text-white border-2 border-[#070F1A]"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    {initials}
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center border-2 border-[#070F1A] cursor-pointer hover:bg-[#00D4FF] transition-colors">
                  {uploadingPfp ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-3 h-3 text-white" />}
                  <input type="file" accept="image/*" className="hidden" onChange={uploadPfp} disabled={uploadingPfp} />
                </label>
                {isVerified && isSeller && (
                  <div className="absolute -bottom-1 -right-1">
                    <MetaVerifiedBadge size="xs" label="" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <UsernameEditor user={user} onSaved={async () => { await reloadUser(); }}/>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="inline-flex items-center font-body font-bold uppercase tracking-wider"
                    style={{ fontSize: '9px', padding: '3px 10px', borderRadius: '5px',
                      background: isAdmin ? 'rgba(245,158,11,0.18)' : isBusiness ? 'rgba(37,99,235,0.18)' : user?.user_type === 'rider' ? 'rgba(245,158,11,0.13)' : isSeller ? 'rgba(16,185,129,0.15)' : isGhostMode ? 'rgba(168,85,247,0.13)' : 'rgba(37,99,235,0.13)',
                      border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.45)' : isBusiness ? 'rgba(37,99,235,0.45)' : user?.user_type === 'rider' ? 'rgba(245,158,11,0.4)' : isSeller ? 'rgba(16,185,129,0.42)' : isGhostMode ? 'rgba(168,85,247,0.35)' : 'rgba(37,99,235,0.35)'}`,
                      color: isAdmin ? '#fbbf24' : isBusiness ? '#93c5fd' : user?.user_type === 'rider' ? '#fde68a' : isSeller ? '#6ee7b7' : isGhostMode ? '#d8b4fe' : '#60a5fa' }}>
                    {isAdmin ? 'CEO & Founder' : isBusiness ? (user.business_name || 'Business Account') : user?.user_type === 'rider' ? 'Rider Delivery' : isSeller ? 'Sales Account' : isGhostMode ? 'Live Test Account' : 'Customer Account'}
                  </span>
                  {isVerified && isSeller && <MetaVerifiedBadge size="xs" label="" />}
                  {isPendingBusiness && !isBusiness && (
                    <span className="px-2 py-0.5 rounded-full font-body text-[9px] font-bold border bg-amber-500/15 text-amber-400 border-amber-500/20">⏳ Pending Business</span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-body text-[9px] border border-white/8">Since {memberSince}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-body text-[9px] font-bold border border-amber-500/30">
                      <Shield className="w-2.5 h-2.5 inline mr-0.5"/>Admin
                    </span>
                  )}
                  {!isVerified && isSeller && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-white/20 font-body text-[8px] border border-white/8">Independent Non-verified Partner</span>
                  )}
                </div>
                <p className="font-body text-[10px] text-white/35 mt-0.5 flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 text-[#00D4FF]"/> {user.email}
                </p>
              </div>
              <button onClick={() => logout(true)}
                className="flex-shrink-0 p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all">
                <LogOut className="w-3.5 h-3.5"/>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { icon: History, label: 'Orders', val: orders.length },
                { icon: CheckCircle, label: 'Done', val: completedOrders.length },
                { icon: ShoppingCart, label: 'Cart', val: cart.length },
                { icon: Heart, label: 'Saved', val: favourites.length },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Icon className="w-3.5 h-3.5 text-[#00D4FF] mx-auto mb-1"/>
                  <p className="font-heading font-bold text-sm text-white">{val}</p>
                  <p className="font-body text-[9px] text-white/35">{label}</p>
                </div>
              ))}
            </div>

            {/* Seller stats if seller */}
            {isSeller && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { icon: Package, label: 'Listings', val: listings.length },
                  { icon: Truck, label: 'Pending', val: pendingSellerOrders.length },
                  { icon: FileText, label: 'Drafts', val: drafts.length },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                    <Icon className="w-3.5 h-3.5 text-[#00D4FF] mx-auto mb-1"/>
                    <p className="font-heading font-bold text-sm text-white">{val}</p>
                    <p className="font-body text-[9px] text-white/35">{label}</p>
                  </div>
                ))}
              </div>
            )}
            </div>{/* end p-4 */}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <TabBtn key={tab.key} icon={tab.icon} label={tab.label} active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)} badge={tab.badge || 0}/>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

            {/* ANALYTICS */}
            {activeTab === 'analytics' && isSeller && (
              <SellerAnalytics listings={listings} user={user} />
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && user && (
              <div className="space-y-3">
                {/* Bio & Socials */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Public Profile</h2>

                  {/* Channel Name */}
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Channel / Display Name</label>
                    <input value={channelName} onChange={e => setChannelName(e.target.value)}
                      placeholder="e.g. Kevin's Tech Store, Lutong Bahay ni Ate..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                    <p className="font-body text-[9px] text-white/25 mt-1">This is what visitors see on your public profile instead of your real name.</p>
                  </div>

                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                      placeholder="Tell people about yourself..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none" />
                  </div>

                  {/* Privacy Toggles */}
                  <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                    <p className="font-body text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider">Privacy Settings</p>
                    <p className="font-body text-[9px] text-white/35">By default, your email and phone are hidden from public visitors. Enable below to show them on your profile.</p>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-body text-xs text-white font-semibold">Show Phone Number Publicly</p>
                        <p className="font-body text-[9px] text-white/35">Visitors can see and call your phone number</p>
                      </div>
                      <button onClick={() => setShowPhonePublic(v => !v)}
                        className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${showPhonePublic ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showPhonePublic ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-white/6">
                      <div>
                        <p className="font-body text-xs text-white font-semibold">Show Email Address Publicly</p>
                        <p className="font-body text-[9px] text-white/35">Visitors can see your email on your profile</p>
                      </div>
                      <button onClick={() => setShowEmailPublic(v => !v)}
                        className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${showEmailPublic ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showEmailPublic ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: 'Facebook URL', val: socialFb, setter: setSocialFb, icon: '📘' },
                      { label: 'Instagram URL', val: socialIg, setter: setSocialIg, icon: '📸' },
                      { label: 'YouTube URL', val: socialYt, setter: setSocialYt, icon: '▶️' },
                      { label: 'TikTok URL', val: socialTt, setter: setSocialTt, icon: '🎵' },
                    ].map(({ label, val, setter, icon }) => (
                      <div key={label}>
                        <label className="font-body text-[9px] text-white/35 uppercase tracking-wider mb-1 block">{icon} {label}</label>
                        <input value={val} onChange={e => setter(e.target.value)} placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                      </div>
                    ))}
                  </div>
                  <button onClick={saveProfileInfo} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50">
                    {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Profile
                  </button>
                </div>
                <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm mb-3">Account Information</h2>
                  {[
                    { label: 'Username', value: user.username ? `@${user.username}` : '—' },
                    { label: 'Full Name', value: user.full_name || '—' },
                    { label: 'Email', value: user.email },
                    { label: 'Account Type', value: isAdmin ? 'Admin' : isBusiness ? 'Business Account' : isSeller ? 'Sales Account' : user?.user_type === 'rider' ? 'Rider Delivery Account' : 'Customer Account' },
                    { label: 'Location', value: user.location || user.seller_location || '—' },
                    { label: 'Member Since', value: memberSince },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="font-body text-[10px] text-white/35 uppercase tracking-wider">{label}</span>
                      <span className="font-body text-xs text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Account type status cards */}
                {isCustomer && (
                  <div className="space-y-2">
                    {/* Become Seller */}
                    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(0,212,255,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <Store className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5"/>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-white text-sm">Become a Seller</p>
                          <p className="font-body text-[10px] text-white/40 mb-2">Post listings under your personal name. Free to join.</p>
                          <button onClick={() => setShowSellerModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl font-body font-bold text-xs hover:bg-emerald-400 transition-colors">
                            <Store className="w-3 h-3"/> Start Selling →
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Become Business */}
                    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.10),rgba(0,212,255,0.05))', border: '1px solid rgba(37,99,235,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-8 h-8 text-[#3E97F1] flex-shrink-0 mt-0.5"/>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-white text-sm">Register a Business</p>
                          <p className="font-body text-[10px] text-white/40 mb-2">Convert to a Business Account to list under your business name. Submit 3 documents for admin approval + Verified Partner badge.</p>
                           <button onClick={() => setShowBusinessModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#3E97F1] transition-colors">
                            <Building2 className="w-3 h-3"/> Convert To Business Account →
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Become Rider */}
                    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.10),rgba(251,191,36,0.05))', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(245,158,11,0.15)' }}>
                          <span className="text-amber-400 font-bold text-lg">🏍</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-white text-sm">Become a Rider</p>
                          <p className="font-body text-[10px] text-white/40 mb-2">Earn income by delivering orders in your area. ID verification required.</p>
                          <Link to="/rider-onboarding"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white rounded-xl font-body font-bold text-xs transition-colors"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#1a0a00' }}>
                            Apply as Rider →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isSellerOnly && (
                  <div className="space-y-2">
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}>
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-emerald-400"/>
                        <div>
                          <p className="font-heading font-bold text-white text-sm flex items-center gap-1">
                            ✅ Active Seller {isVerified && <OneCheckmark size="xs" label="" />}
                          </p>
                          <p className="font-body text-[10px] text-white/40">{user.seller_location || 'Location not set'} · {(user.seller_products || []).join(', ') || 'No categories set'}</p>
                        </div>
                        <button onClick={() => setActiveTab('listings')} className="ml-auto px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl font-body text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                          Manage →
                        </button>
                      </div>
                    </div>
                    {/* Upgrade to business */}
                    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.08),rgba(0,212,255,0.04))', border: '1px solid rgba(37,99,235,0.15)' }}>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-7 h-7 text-[#3E97F1] flex-shrink-0 mt-0.5"/>
                        <div className="flex-1">
                          <p className="font-heading font-bold text-white text-sm">Convert To Business Account</p>
                          <p className="font-body text-[10px] text-white/40 mb-2">List under your business name & get the Verified Partner badge after submitting 3 required documents.</p>
                          <button onClick={() => setShowBusinessModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#3E97F1] transition-colors">
                            <Building2 className="w-3 h-3"/> Convert To Business Account →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isBusiness && (
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)' }}>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#3E97F1]"/>
                      <div>
                        <p className="font-heading font-bold text-white text-sm flex items-center gap-1">
                          🏢 {user.business_name || 'Business Account'} {isVerified && <OneCheckmark size="xs" label="" />}
                        </p>
                        <p className="font-body text-[10px] text-white/40">Verified Business · Listings show as {user.business_name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {isPendingBusiness && !isBusiness && (
                  <div className="flex items-center gap-2 text-amber-400 font-body text-xs p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0"/> Business application for <strong className="mx-1">{user.business_name}</strong> is pending admin review (24–48 hrs)
                  </div>
                )}

                {isAdmin && (
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-amber-400"/>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-white text-sm">Admin Access</p>
                        <p className="font-body text-[10px] text-white/40">Full platform management. Edit any listing or business by clicking the ✏️ icon anywhere on the site.</p>
                      </div>
                      <Link to="/admin" className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-xl font-body text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                        Admin →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MY ORDERS (buyer) */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-white text-sm">My Orders / Transaction History</h3>
                {orders.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <History className="w-8 h-8 text-white/15 mx-auto mb-2"/>
                    <p className="font-body text-sm text-white/30">No orders yet.</p>
                    <Link to="/buysell" className="inline-block mt-3 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs">Browse Listings →</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map(order => (
                      <div key={order.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {order.listing_image && <img src={order.listing_image} alt={order.listing_title} className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"/>}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-sm text-white truncate">{order.listing_title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{order.price_label}</p>
                          <p className="font-body text-[10px] text-white/30">Seller: {order.seller_name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${order.status==='completed'?'bg-green-500/20 text-green-400':order.status==='cancelled'?'bg-red-500/20 text-red-400':'bg-amber-500/20 text-amber-400'}`}>
                            {order.status?.replace(/_/g,' ')}
                          </span>
                          {order.status !== 'completed' && order.status !== 'cancelled' && !order.buyer_confirmed_received && (
                            <button onClick={() => confirmReceived(order)}
                              className="mt-1 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] font-body text-[9px] font-bold hover:bg-[#00D4FF]/20 transition-colors">
                              <CheckCircle className="w-2.5 h-2.5"/> Confirm Received
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            {activeTab === 'cart' && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-white text-sm">Shopping Cart ({cart.length})</h3>
                {cart.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <ShoppingCart className="w-8 h-8 text-white/15 mx-auto mb-2"/>
                    <p className="font-body text-sm text-white/30">Your cart is empty.</p>
                    <Link to="/buysell" className="inline-block mt-3 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs">Browse Listings →</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {item.listing_image && <img src={item.listing_image} alt="" className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"/>}
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs font-bold text-white truncate">{item.listing_title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{item.price_label}</p>
                          <p className="font-body text-[9px] text-white/30">{item.seller_name}</p>
                        </div>
                        <button onClick={async () => { await base44.entities.Cart.delete(item.id); setCart(c => c.filter(i => i.id !== item.id)); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAVOURITES */}
            {activeTab === 'favourites' && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-white text-sm">Saved Items ({favourites.length})</h3>
                {favourites.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Heart className="w-8 h-8 text-white/15 mx-auto mb-2"/>
                    <p className="font-body text-sm text-white/30">No saved items yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {favourites.map(fav => (
                      <div key={fav.id} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {fav.image_url && <img src={fav.image_url} alt={fav.title} className="w-full aspect-video object-cover"/>}
                        <div className="p-2">
                          <p className="font-body text-xs font-bold text-white truncate">{fav.title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{fav.price_label}</p>
                          <button onClick={async () => { await base44.entities.Favourite.delete(fav.id); setFavourites(f => f.filter(i => i.id !== fav.id)); }}
                            className="mt-1 text-[9px] text-white/25 hover:text-red-400 font-body transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SELLER — LISTINGS */}
            {activeTab === 'listings' && isSeller && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-white text-sm">My Listings ({listings.length})</h3>
                  <button onClick={openAdd}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body text-xs font-bold hover:bg-white transition-colors">
                    <Plus className="w-3 h-3"/> New Listing
                  </button>
                </div>
                <AnimatePresence>
                  {showForm && (
                    <ListingForm form={form} setF={setF} onSave={saveListing} onSaveDraft={saveDraft}
                      onCancel={() => { setShowForm(false); setEditing(null); }} editing={editing}/>
                  )}
                </AnimatePresence>
                {listings.length === 0 && !showForm ? (
                  <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Package className="w-10 h-10 text-white/15 mx-auto mb-2"/>
                    <button onClick={openAdd} className="px-5 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-semibold text-xs hover:bg-white transition-colors mt-2">Add First Listing</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map(item => (
                      <div key={item.id}>
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-white/8 p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="relative flex-shrink-0 group">
                            {item.image_url
                              ? <img src={item.image_url} alt={item.title} className="w-11 h-11 rounded-xl object-cover border border-white/10" onError={e=>e.target.style.display='none'}/>
                              : <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><Package className="w-4 h-4 text-white/20"/></div>
                            }
                            <QuickImageUpload itemId={item.id} onUploaded={(url) => setListings(prev => prev.map(l => l.id === item.id ? { ...l, image_url: url } : l))} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-heading font-bold text-xs text-white">{item.title}</h4>
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB]/20 text-[#00D4FF] capitalize">{item.type}</span>
                              {item.approval_status === 'pending' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400">⏳ Pending Review</span>}
                              {item.approval_status === 'approved' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400">✅ Approved</span>}
                              {item.approval_status === 'rejected' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400">❌ Rejected</span>}
                              {!item.is_active && item.approval_status !== 'pending' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/30">Hidden</span>}
                            </div>
                            <p className="font-body text-[9px] text-white/35 mt-0.5">{item.location}{item.area ? ` · ${item.area}` : ''} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => openEdit(item)} className="p-1.5 rounded-xl bg-white/5 hover:bg-[#2563EB]/20 border border-white/10 transition-colors">
                              <Pencil className="w-3.5 h-3.5 text-[#00D4FF]"/>
                            </button>
                            <button onClick={() => removeListing(item.id)} className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-red-400"/>
                            </button>
                          </div>
                        </motion.div>
                        {/* Menu Manager for food, hotel, travel listings */}
                        {['food','hotel','flights','vehicle_rental'].includes(item.type) && (
                          <div className="mt-2">
                            <MenuManager
                              listingId={item.id}
                              listingType={item.type === 'food' ? 'food' : item.type === 'hotel' ? 'hotel' : 'travel'}
                              ownerId={user?.id}
                              isAdmin={isAdmin}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SELLER — DRAFTS */}
            {activeTab === 'drafts' && isSeller && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-white text-sm">Drafts ({drafts.length})</h3>
                  <button onClick={openAdd} className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
                    <Plus className="w-3 h-3"/> New Draft
                  </button>
                </div>
                {drafts.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <FileText className="w-8 h-8 text-white/15 mx-auto mb-2"/>
                    <p className="font-body text-sm text-white/30">No drafts.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drafts.map(draft => (
                      <div key={draft.id} className="rounded-xl border border-white/8 p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-white/25"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-xs text-white truncate">{draft.title || 'Untitled Draft'}</p>
                          <p className="font-body text-[9px] text-white/35">{draft.type} · {draft.location}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => publishDraft(draft)} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body text-[9px] font-bold hover:bg-[#00D4FF]/20 transition-colors">
                            <Eye className="w-2.5 h-2.5"/> Publish
                          </button>
                          <button onClick={() => deleteDraft(draft.id)} className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                            <Trash2 className="w-3 h-3 text-red-400"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <AnimatePresence>
                  {showForm && (
                    <ListingForm form={form} setF={setF} onSave={saveListing} onSaveDraft={saveDraft}
                      onCancel={() => { setShowForm(false); setEditing(null); }} editing={editing}/>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* SELLER — ORDERS */}
            {activeTab === 'sellerorders' && isSeller && (
              <OrdersTab orders={sellerOrders} setOrders={setSellerOrders} listings={listings}
                user={user} confirmDelivery={confirmDelivery} showToast={showToast}/>
            )}

            {/* SELLER PAGE */}
            {activeTab === 'sellerpage' && isSeller && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-white text-sm">Your Public Seller Page</h3>
                
                {/* Seller Tools - Daily Rewards & Facebook Live */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowRewards(true)}
                    className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="font-heading font-bold text-white text-xs">Daily Rewards</span>
                    </div>
                    <p className="font-body text-[9px] text-white/40">Earn points & rewards</p>
                  </button>
                  
                  <button onClick={() => setShowFBLive(true)}
                    className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,rgba(24,119,242,0.15),rgba(66,103,178,0.1))', border: '1px solid rgba(24,119,242,0.3)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="font-heading font-bold text-white text-xs">Facebook Live</span>
                    </div>
                    <p className="font-body text-[9px] text-white/40">Connect to sell via live</p>
                  </button>
                </div>
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {isVerified
                    ? <span className="flex items-center gap-1 w-fit"><OneCheckmark size="sm" label="Verified Partner" /></span>
                    : <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/30 font-body text-[10px] border border-white/10 w-fit block">Unverified · Independent Non-verified Partner</span>
                  }
                  <div>
                    <label className="font-body text-[10px] font-semibold text-white/45 uppercase tracking-wider mb-1.5 block">Bio / About</label>
                    <textarea value={sellerBio} onChange={e => setSellerBio(e.target.value)}
                      placeholder="Tell buyers about your business..."
                      className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-24 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]"/>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="font-body text-xs text-white font-semibold">Public Seller Page</p>
                      <p className="font-body text-[9px] text-white/35">Customers can visit your dedicated page</p>
                    </div>
                    <button onClick={() => setSellerPageEnabled(v => !v)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${sellerPageEnabled ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${sellerPageEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveSellerPage} className="px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors">Save</button>
                    <Link to={`/seller/${user.username || user.id}`}
                      className="px-4 py-2 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3"/> View Page
                    </Link>
                  </div>
                </div>
                {!isVerified && !user?.verification_submitted && (
                  <button
                    onClick={() => setShowVerifiedBanner(true)}
                    className="w-full rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,rgba(255,45,85,0.12),rgba(0,122,255,0.07))', border: '1px solid rgba(255,45,85,0.3)' }}
                  >
                    <div className="flex items-center gap-3">
                      <OneCheckmark size="lg" label="" />
                      <div>
                        <p className="font-heading font-bold text-white text-sm flex items-center gap-1.5">✨ Get the <OneCheckmark size="sm" label="1Checkmark" /></p>
                        <p className="font-body text-[10px] text-white/40">Get the color-changing 1checkmark badge, boosted listings & official Verified Partner status.</p>
                      </div>
                    </div>
                  </button>
                )}
                {user?.verification_submitted && !isVerified && (
                  <div className="flex items-center gap-2 text-amber-400 font-body text-xs p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <CheckCircle className="w-3.5 h-3.5"/> Verification request pending admin review (24–48 hrs)
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && user && (
              <div className="space-y-3">
                {savedMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 font-body text-xs">
                    <Check className="w-3.5 h-3.5"/> {savedMsg}
                  </motion.div>
                )}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Username</h2>
                  <UsernameEditor user={user} onSaved={async () => { await reloadUser(); showSaved('Username updated!'); }}/>
                  <p className="font-body text-[9px] text-white/25">Must be unique. Letters, numbers, _ . - allowed.</p>
                </div>
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Location</h2>
                  <select value={locationVal} onChange={e => setLocationVal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                    {['Manila','Cavite','Cebu','Davao','Nationwide'].map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                  </select>
                  <button onClick={() => saveSettings({ location: locationVal, seller_location: locationVal })} disabled={saving}
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    {saving ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> : <MapPin className="w-3 h-3"/>}
                    Save Location
                  </button>
                </div>
                <PaymentSettings user={user} onToast={showToast} />

                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm mb-3">Account</h2>
                  <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="font-body text-xs text-white font-semibold">Email Address</p>
                      <p className="font-body text-[10px] text-white/35">{user.email}</p>
                    </div>
                    <span className="text-[9px] text-[#00D4FF] font-bold px-2 py-0.5 rounded-full bg-[#00D4FF]/10">Verified ✓</span>
                  </div>
                  <button onClick={() => logout(true)}
                    className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-body font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                    <LogOut className="w-3.5 h-3.5"/> Sign Out
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-body text-xs shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerifiedBanner && user && (
          <VerifiedPartnerBanner user={user} onClose={() => setShowVerifiedBanner(false)} onSubmit={submitVerification} />
        )}
        {showSellerModal && user && (
          <BecomeSellerModal user={user} onClose={() => setShowSellerModal(false)} onSuccess={async () => { await reloadUser(); showToast('You are now a Seller! 🎉'); }} />
        )}
        {showBusinessModal && user && (
          <BecomeBusinessModal user={user} onClose={() => setShowBusinessModal(false)} onSuccess={async () => { await reloadUser(); showToast('Business application submitted! 📋'); }} />
        )}
        {showRewards && user && (
          <DailyRewardsTracker onClose={() => setShowRewards(false)} />
        )}
        {showFBLive && user && (
          <FacebookLiveConnector onClose={() => setShowFBLive(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}