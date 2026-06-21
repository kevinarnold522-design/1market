import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import { isOwnerAccount } from '@/lib/adminAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft, Building2, ShoppingBag, Search, Upload, User, Users, BadgeCheck, Shield, Flag, CheckCircle, XCircle, Ghost, Link2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { saveGhostSession } from '@/lib/ghostAccounts';

const ROLES = ['user', 'moderator', 'admin'];

const SECTIONS = ['food', 'travel', 'buysell'];
const TYPES = ['chain', 'carinderia', 'home-kitchen', 'home-baker', 'coffee', 'hotel', 'vehicle-rental', 'shop', 'service'];
const LOCATIONS = ['Manila', 'Cavite', 'Nationwide'];

const EMPTY_BIZ = {
  name: '', category: '', type: 'carinderia', section: 'food',
  location: 'Manila', area: '', address: '', hours: '', tag: '',
  logo_url: '', image_url: '', extra_images: [], menu: [],
  phone: '', description: '', is_active: true,
};

const EMPTY_LISTING = {
  title: '', type: 'shoes', location: 'Manila', area: '', seller_name: '',
  phone: '', description: '', image_url: '', extra_images: [],
  price: '', price_label: '', condition: 'Brand New', brand: '', model: '',
  year: '', mileage: '', transmission: '', size: '',
  property_type: '', lot_size: '', bedrooms: '', bathrooms: '',
  status: '', service_area: '', business_id: '', is_active: true,
};

function FieldInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] resize-none h-20" />
      ) : type === 'select' ? null : (
        <input type={type === 'number' ? 'number' : 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] bg-white">
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function ArrayField({ label, value, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => { if (input.trim()) { onChange([...(value || []), input.trim()]); setInput(''); } };
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
        <button onClick={add} className="px-3 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-semibold hover:bg-[#2563EB] transition-colors">Add</button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(value || []).map((item, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#F8FAFC] border border-[#0A192F]/10 rounded-full text-xs text-[#0A192F]/70">
            {item.length > 40 ? item.slice(0, 40) + '…' : item}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}><X className="w-3 h-3 text-red-400 hover:text-red-600" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

// Reusable image uploader for Admin forms
function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = React.useRef(null);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadMediaFileToSupabase(file);
    onChange(file_url);
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="preview" className="h-24 rounded-xl object-cover border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />
          <button onClick={() => onChange('')} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600">AI</button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/*" className="hidden" onChange={handle} />
      <button onClick={() => inputRef.current?.click()} disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#2563EB]/30 hover:border-[#2563EB]/70 rounded-xl text-[#2563EB] font-body text-xs font-semibold transition-colors disabled:opacity-50">
        {uploading ? <><div className="w-3.5 h-3.5 border border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin"/> Uploading...</> : <><Upload className="w-3.5 h-3.5"/> Upload Image from Device</>}
      </button>
    </div>
  );
}

// Multi-image uploader (replaces URL-only extra images)
function MultiImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = React.useRef(null);

  const handle = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(f => uploadMediaFileToSupabase(f).then(r => r.file_url)));
    onChange([...(value || []), ...urls]);
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {(value || []).map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center hover:bg-red-600">AI</button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/*" multiple className="hidden" onChange={handle} />
      <button onClick={() => inputRef.current?.click()} disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#0A192F]/15 hover:border-[#2563EB]/50 rounded-xl text-[#0A192F]/50 font-body text-xs font-semibold transition-colors disabled:opacity-50">
        {uploading ? <><div className="w-3.5 h-3.5 border border-[#0A192F]/20 border-t-[#2563EB] rounded-full animate-spin"/> Uploading...</> : <><Upload className="w-3.5 h-3.5"/> Add More Photos from Device</>}
      </button>
    </div>
  );
}

function BusinessForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_BIZ);
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="bg-white rounded-2xl border border-[#0A192F]/10 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldInput label="Business Name *" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Jollibee – Bacoor" />
        <FieldInput label="Category" value={form.category} onChange={v => set('category', v)} placeholder="e.g. Fast Food" />
        <SelectField label="Section *" value={form.section} onChange={v => set('section', v)} options={SECTIONS} />
        <SelectField label="Type" value={form.type} onChange={v => set('type', v)} options={TYPES} />
        <SelectField label="Location *" value={form.location} onChange={v => set('location', v)} options={LOCATIONS} />
        <FieldInput label="Area / District" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <FieldInput label="Address" value={form.address} onChange={v => set('address', v)} placeholder="Full address" />
        <FieldInput label="Business Hours" value={form.hours} onChange={v => set('hours', v)} placeholder="e.g. 6:00 AM – 10:00 PM" />
        <FieldInput label="Tag / Badge" value={form.tag} onChange={v => set('tag', v)} placeholder="e.g. Open Now" />
        <FieldInput label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageUploadField label="Logo (upload from device)" value={form.logo_url} onChange={v => set('logo_url', v)} />
        <ImageUploadField label="Main Establishment Photo" value={form.image_url} onChange={v => set('image_url', v)} />
      </div>
      <MultiImageUploadField label="Additional Establishment Photos" value={form.extra_images} onChange={v => set('extra_images', v)} />
      <ArrayField label="Menu Items / Key Offerings" value={form.menu} onChange={v => set('menu', v)} placeholder="e.g. Chickenjoy" />
      <FieldInput label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" placeholder="Short description of the business..." />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
        <label htmlFor="active" className="font-body text-sm text-[#0A192F]/70">Active / Visible on site</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
          <Save className="w-4 h-4" /> Save Business
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-sm hover:bg-[#F8FAFC] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ListingForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_LISTING);
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="bg-white rounded-2xl border border-[#0A192F]/10 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldInput label="Title *" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Nike Air Force 1 Low" />
        <SelectField label="Type *" value={form.type} onChange={v => set('type', v)}
          options={['shoes', 'cars', 'houses', 'services', 'product']} />
        <SelectField label="Location *" value={form.location} onChange={v => set('location', v)} options={['Manila', 'Cavite']} />
        <FieldInput label="Area" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <FieldInput label="Seller Name" value={form.seller_name} onChange={v => set('seller_name', v)} placeholder="e.g. Direct Owner" />
        <FieldInput label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
        <FieldInput label="Price (number)" value={form.price} onChange={v => set('price', v)} type="number" placeholder="e.g. 3500" />
        <FieldInput label="Price Label (display)" value={form.price_label} onChange={v => set('price_label', v)} placeholder="e.g. ₱3,500 or ₱500/hour" />
      </div>

      {form.type === 'cars' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FieldInput label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="Toyota" />
          <FieldInput label="Model" value={form.model} onChange={v => set('model', v)} placeholder="Vios" />
          <FieldInput label="Year" value={form.year} onChange={v => set('year', v)} type="number" placeholder="2019" />
          <FieldInput label="Mileage" value={form.mileage} onChange={v => set('mileage', v)} placeholder="48,000 KM" />
          <FieldInput label="Transmission" value={form.transmission} onChange={v => set('transmission', v)} placeholder="Automatic" />
        </div>
      )}
      {form.type === 'shoes' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <FieldInput label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="Nike" />
          <FieldInput label="Model" value={form.model} onChange={v => set('model', v)} placeholder="Air Force 1" />
          <FieldInput label="Size" value={form.size} onChange={v => set('size', v)} placeholder="US 10" />
        </div>
      )}
      {form.type === 'houses' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FieldInput label="Property Type" value={form.property_type} onChange={v => set('property_type', v)} placeholder="Townhouse" />
          <FieldInput label="Lot Size" value={form.lot_size} onChange={v => set('lot_size', v)} placeholder="48 sqm" />
          <FieldInput label="Bedrooms" value={form.bedrooms} onChange={v => set('bedrooms', v)} type="number" />
          <FieldInput label="Bathrooms" value={form.bathrooms} onChange={v => set('bathrooms', v)} type="number" />
          <FieldInput label="Status" value={form.status} onChange={v => set('status', v)} placeholder="Ready For Occupancy" />
        </div>
      )}
      {form.type === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldInput label="Service Area" value={form.service_area} onChange={v => set('service_area', v)} placeholder="Both / Manila Only / Cavite Only" />
        </div>
      )}

      <SelectField label="Condition" value={form.condition} onChange={v => set('condition', v)}
        options={['Brand New', 'Like New', 'Used', 'N/A']} />

      <ImageUploadField label="Main Image" value={form.image_url} onChange={v => set('image_url', v)} />
      <MultiImageUploadField label="Additional Photos" value={form.extra_images} onChange={v => set('extra_images', v)} />
      <FieldInput label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="list-active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
        <label htmlFor="list-active" className="font-body text-sm text-[#0A192F]/70">Active / Visible on site</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
          <Save className="w-4 h-4" /> Save Listing
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('approvals');
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [adminMessages, setAdminMessages] = useState([]);
  const [msgUserEmail, setMsgUserEmail] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  // Created user accounts
  const [ghostForm, setGhostForm] = useState({ full_name: '', user_type: 'seller', business_name: '', location: 'Manila' });
  const [ghostSaving, setGhostSaving] = useState(false);
  const [ghostLinkEmail, setGhostLinkEmail] = useState({});
  const [ghostUsers, setGhostUsers] = useState([]);

  useEffect(() => {
    base44.auth.me().then(user => {
      setIsOwner(isOwnerAccount(user, null));
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);
  const [businesses, setBusinesses] = useState([]);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBizForm, setShowBizForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [transferTargetByListing, setTransferTargetByListing] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const approveListing = async (listingId) => {
    await base44.entities.Listing.update(listingId, { approval_status: 'approved', is_active: true });
    try { await base44.functions.invoke('listingApprovalNotify', { listing_id: listingId, status: 'approved' }); } catch(e) {}
    showToast('Listing approved! Seller notified by email.');
    loadAll();
  };

  const rejectListing = async (listingId, note = '') => {
    await base44.entities.Listing.update(listingId, { approval_status: 'rejected', is_active: false });
    try { await base44.functions.invoke('listingApprovalNotify', { listing_id: listingId, status: 'rejected', admin_note: note }); } catch(e) {}
    showToast('Listing rejected. Seller notified.');
    loadAll();
  };

  const loadAdminMessages = async (email) => {
    setLoadingMsgs(true);
    try {
      const res = await base44.functions.invoke('adminViewMessages', { user_email: email || undefined });
      setAdminMessages(res.data?.messages || []);
    } catch(e) { setAdminMessages([]); }
    setLoadingMsgs(false);
  };

  const loadAll = async () => {
    setLoading(true);
    // Load critical data first
    const [bizs, lists] = await Promise.all([
      base44.entities.Business.list('-created_date', 200),
      base44.entities.Listing.list('-created_date', 200),
    ]);
    setBusinesses(bizs);
    setListings(lists);
    
    // Load other data in parallel but non-blocking
    Promise.all([
      base44.entities.Report.list('-created_date', 200),
      base44.entities.VerificationApplication.list('-created_date', 200),
      base44.entities.Listing.filter({ type: 'jobs' }, '-created_date', 200),
    ]).then(([rpts, verifs, jobs]) => {
      setReports(rpts);
      setVerifications(verifs);
      const allPending = lists.filter(j => !j.approval_status || j.approval_status === 'pending').sort((a,b) => new Date(b.created_date) - new Date(a.created_date));
      setPendingListings(allPending);
      setPendingJobs(allPending.filter(j => j.type === 'jobs'));
    });
    
    // Load users separately - increase limit to ensure we get all ghost accounts
    base44.entities.User.list('-created_date', 500).then(userList => {
      console.log('AI Loaded users:', userList.length);
      setUsers(userList);
      // Filter for ghost accounts using multiple checks
      const ghosts = userList.filter(u => {
        const isGhostEmail = u.email?.includes('@1marketph-ghost.internal');
        const isGhostFlag = u.is_ghost_account === true;
        const isGhostId = u.ghost_id?.startsWith('ghost_');
        return isGhostEmail || isGhostFlag || isGhostId;
      });
      console.log('AI Created users found:', ghosts.length, 'Total users:', userList.length);
      setGhostUsers(ghosts);
      
      // Update stats with total user count (ghosts count as regular users)
      setTotalUsers(userList.length);
      
      setLoading(false);
    }).catch(err => {
      console.error('AI Failed to load users:', err);
      setLoading(false);
    });
  };

  const toggleVerified = async (u) => {
    const newStatus = !u.is_verified_seller;
    await base44.entities.User.update(u.id, { is_verified_seller: newStatus });
    // Send verified partner email when granting verification
    if (newStatus) {
      try {
        await base44.functions.invoke('sendVerifiedPartnerEmail', {
          email: u.email,
          name: u.full_name || u.email,
          business_name: u.full_name || 'Your Business'
        });
      } catch (e) {}
    }
    showToast(newStatus ? 'Verified badge granted! Email sent.' : 'Verified badge removed.');
    loadAll();
  };

  const setUserRole = async (u, role) => {
    await base44.entities.User.update(u.id, { role });
    showToast(`Role updated to ${role}`);
    loadAll();
  };

  useEffect(() => { loadAll(); }, []);

  const saveBiz = async (form) => {
    if (!form.name) return;
    const data = { ...form, menu: form.menu || [], extra_images: form.extra_images || [] };
    if (editingBiz) {
      await base44.entities.Business.update(editingBiz.id, data);
      showToast('Business updated!');
    } else {
      await base44.entities.Business.create(data);
      showToast('Business added!');
    }
    setShowBizForm(false); setEditingBiz(null);
    loadAll();
  };

  const deleteBiz = async (id) => {
    if (!window.confirm('Delete this business?')) return;
    await base44.entities.Business.delete(id);
    showToast('Business deleted.');
    loadAll();
  };

  const saveList = async (form) => {
    if (!form.title) return;
    const data = { ...form, price: Number(form.price) || 0, extra_images: form.extra_images || [] };
    if (editingList) {
      await base44.entities.Listing.update(editingList.id, data);
      showToast('Listing updated!');
    } else {
      await base44.entities.Listing.create(data);
      showToast('Listing added!');
    }
    setShowListForm(false); setEditingList(null);
    loadAll();
  };

  const deleteList = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await base44.entities.Listing.delete(id);
    showToast('Listing deleted.');
    loadAll();
  };

  const transferListingOwner = async (listing, userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) { showToast('Select a user first.'); return; }
    await base44.entities.Listing.update(listing.id, {
      created_by_id: target.id,
      owner_user_id: target.id,
      owner_email: target.email || '',
      seller_name: target.channel_name || target.business_name || target.full_name || target.email || listing.seller_name,
      email_contact: target.email || listing.email_contact || '',
      approved_channel_name: target.channel_name || target.business_name || target.full_name || '',
    });
    setTransferTargetByListing(prev => ({ ...prev, [listing.id]: '' }));
    showToast('Listing transferred to the selected user.');
    loadAll();
  };

  const createGhostAccount = async () => {
    if (!ghostForm.full_name.trim()) { showToast('Name is required'); return; }
    setGhostSaving(true);
    try {
      const response = await base44.functions.invoke('createGhostAccount', {
        full_name: ghostForm.full_name.trim(),
        channel_name: ghostForm.business_name.trim() || ghostForm.full_name.trim(),
        user_type: ghostForm.user_type,
        business_name: ghostForm.business_name.trim() || ghostForm.full_name.trim(),
        location: ghostForm.location || 'Manila',
        bio: '',
        seller_area: '',
      });

      const newUser = response.data.user;
      localStorage.setItem('1m_ghost_' + (newUser.ghost_id || newUser.id), JSON.stringify(newUser));
      saveGhostSession(newUser);

      setGhostSaving(false);
      setGhostForm({ full_name: '', user_type: 'seller', business_name: '', location: 'Manila' });
      showToast('Created user account created. Signing in...');
      navigate('/profile');
    } catch (err) {
      console.error('AI Created user account creation failed:', err);
      setGhostSaving(false);
      showToast('Failed: ' + (err.message || 'Check console for details'));
    }
  };

  const linkGhostToEmail = async (ghostUser) => {
    const email = ghostLinkEmail[ghostUser.id];
    if (!email || !email.includes('@')) { showToast('Enter a valid email'); return; }
    await base44.entities.User.update(ghostUser.id, {
      email: email.trim().toLowerCase(),
      is_ghost_account: false,
      ghost_linked: true,
    });
    setGhostLinkEmail(prev => ({ ...prev, [ghostUser.id]: '' }));
    showToast('Created user account linked to real email!');
    loadAll();
  };

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070F1A' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!isOwner) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#070F1A' }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>AI</div>
        <h2 className="font-heading font-bold text-xl text-white mb-2">Access Restricted</h2>
        <p className="font-body text-sm text-white/50 mb-4">This dashboard is only accessible to the site owner.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-semibold text-[#0A192F] transition-colors"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );

  const filteredBiz = businesses.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase()) || b.area?.toLowerCase().includes(search.toLowerCase());
    const matchSection = sectionFilter === 'all' || b.section === sectionFilter;
    return matchSearch && matchSection;
  });

  const filteredList = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) || l.area?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#070F1A 0%,#0a1940 100%)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-body">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white block text-sm">CEO Admin Dashboard</span>
                <span className="font-body text-[10px] text-[#00D4FF]/60">1MarketPH Control Panel</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/connected-accounts"
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm text-white transition-colors"
              style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
              <Users className="w-4 h-4" /> Manage Created User Accounts
            </Link>
            <button onClick={() => { setShowBizForm(true); setEditingBiz(null); setTab('businesses'); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
              <Plus className="w-4 h-4" /> Add Business
            </button>
            <button onClick={() => { setShowListForm(true); setEditingList(null); setTab('listings'); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-body font-bold text-sm hover:bg-white/20 transition-colors">
              <Plus className="w-4 h-4" /> Add Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Businesses', value: businesses.length, color: '#00D4FF', border: 'rgba(0,212,255,0.25)' },
            { label: 'Total Users', value: totalUsers, color: '#34d399', border: 'rgba(52,211,153,0.25)' },
            { label: 'Created User Accounts', value: ghostUsers.length, color: '#a855f7', border: 'rgba(168,85,247,0.25)' },
            { label: 'All Listings', value: listings.length, color: '#c084fc', border: 'rgba(192,132,252,0.25)' },
            { label: 'Pending Approvals', value: pendingListings.length, color: '#fbbf24', border: 'rgba(251,191,36,0.35)' },
            { label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, color: '#f87171', border: 'rgba(248,113,113,0.25)' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.border}`, backdropFilter: 'blur(8px)' }}>
              <p className="font-heading font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p className="font-body text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4 flex-wrap">
          {[
            { key: 'approvals', label: `All Approvals (${pendingListings.length})`, icon: CheckCircle },
            { key: 'businesses', label: 'Businesses', icon: Building2 },
            { key: 'listings', label: 'All Listings', icon: ShoppingBag },
            { key: 'users', label: `Users (${users.length})`, icon: User },
            { key: 'reports', label: `Reports (${reports.filter(r=>r.status==='pending').length})`, icon: Flag },
            { key: 'verifications', label: `Verify (${verifications.filter(v=>v.status==='pending').length})`, icon: BadgeCheck },
            { key: 'messages', label: 'Messages', icon: Shield },
            { key: 'ghost', label: `Created Users (${ghostUsers.length})`, icon: Users },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body font-semibold text-xs transition-all ${tab === t.key ? 'text-[#0A192F]' : 'text-white/50 hover:text-white border border-white/10 hover:border-white/25'}`}
              style={tab === t.key ? { background: 'linear-gradient(135deg,#00D4FF,#2563EB)' } : { background: 'rgba(255,255,255,0.05)' }}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
          </div>
          {tab === 'businesses' && (
            <div className="flex gap-2 flex-wrap">
              {['all', ...SECTIONS].map(s => (
                <button key={s} onClick={() => setSectionFilter(s)}
                  className={`px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all capitalize ${sectionFilter === s ? 'text-[#0A192F]' : 'text-white/50 hover:text-white'}`}
                  style={sectionFilter === s ? { background: 'linear-gradient(135deg,#00D4FF,#2563EB)' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Forms */}
        <AnimatePresence>
          {(showBizForm || editingBiz) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
              <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-4">{editingBiz ? 'Edit Business' : 'Add New Business'}</h3>
              <BusinessForm initial={editingBiz || EMPTY_BIZ} onSave={saveBiz} onCancel={() => { setShowBizForm(false); setEditingBiz(null); }} />
            </motion.div>
          )}
          {(showListForm || editingList) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
              <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-4">{editingList ? 'Edit Listing' : 'Add New Listing'}</h3>
              <ListingForm initial={editingList || EMPTY_LISTING} onSave={saveList} onCancel={() => { setShowListForm(false); setEditingList(null); }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#0A192F]/10 border-t-[#2563EB] rounded-full animate-spin" />
          </div>
        ) : tab === 'businesses' ? (
          <div className="space-y-3">
            {filteredBiz.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">
                No businesses yet. Click "Add Business" to get started.
              </div>
            )}
            {filteredBiz.map(biz => (
              <motion.div key={biz.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {biz.logo_url ? (
                    <img src={biz.logo_url} alt="logo" className="w-12 h-12 rounded-xl object-contain border border-[#0A192F]/10 bg-[#F8FAFC] flex-shrink-0"
                      onError={e => { e.target.style.display='none'; }} />
                  ) : biz.image_url ? (
                    <img src={biz.image_url} alt={biz.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#0A192F]/20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-bold text-sm text-white truncate">{biz.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${biz.section === 'food' ? 'bg-emerald-100 text-emerald-700' : biz.section === 'travel' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {biz.section}
                      </span>
                      {!biz.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Hidden</span>}
                    </div>
                    <p className="font-body text-xs text-white/40 truncate">{biz.location} · {biz.area} · {biz.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingBiz(biz); setShowBizForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#0A192F]/10 transition-colors">
                    <Pencil className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <button onClick={() => deleteBiz(biz.id)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : tab === 'listings' ? (
          <div className="space-y-3">
            {filteredList.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">
                No listings yet. Click "Add Listing" to get started.
              </div>
            )}
            {filteredList.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      onError={e => e.target.style.display='none'} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#0A192F]/20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-bold text-sm text-white truncate">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 capitalize">{item.type}</span>
                      {!item.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Hidden</span>}
                    </div>
                    <p className="font-body text-xs text-white/40">{item.location} · {item.area} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap items-center">
                  <select value={transferTargetByListing[item.id] || ''} onChange={e => setTransferTargetByListing(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="border border-[#0A192F]/10 rounded-xl px-2 py-1.5 font-body text-xs text-[#0A192F] bg-white focus:outline-none focus:border-[#2563EB] max-w-[190px]">
                    <option value="">Transfer owner...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
                  </select>
                  <button onClick={() => transferListingOwner(item, transferTargetByListing[item.id])}
                    className="px-3 py-1.5 rounded-xl bg-[#00D4FF] text-[#0A192F] font-body text-xs font-bold hover:bg-white transition-colors">
                    Transfer
                  </button>
                  <button onClick={() => { setEditingList(item); setShowListForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#0A192F]/10 transition-colors">
                    <Pencil className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <button onClick={() => deleteList(item.id)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : tab === 'users' ? (
          /* USERS TAB */
          <div className="space-y-3">
            {users.filter(u =>
              u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
              u.email?.toLowerCase().includes(search.toLowerCase())
            ).map(u => (
              <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0">
                  {(u.full_name || u.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-bold text-sm text-white truncate">{u.full_name || 'No Name'}</p>
                    {u.is_verified_seller && <BadgeCheck className="w-4 h-4 text-[#2563EB]" title="Verified Seller" />}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : u.role === 'moderator' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role || 'user'}
                    </span>
                    {(u.user_type === 'seller' || u.user_type === 'business' || u.is_seller) && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.user_type === 'business' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {u.user_type === 'business' ? `AI ${u.business_name || 'Business'}` : 'AI Seller'}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-white/40 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                 <select value={u.role || 'user'} onChange={e => setUserRole(u, e.target.value)}
                   className="border border-[#0A192F]/10 rounded-xl px-2 py-1.5 font-body text-xs text-[#0A192F] bg-white focus:outline-none focus:border-[#2563EB]">
                   {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                 </select>
                 <select value={u.user_type || 'customer'} onChange={async e => {
                     const newType = e.target.value;
                     const updateData = { user_type: newType };
                     if (newType === 'seller' || newType === 'business') {
                       updateData.is_seller = true;
                       updateData.account_type = 'business_owner';
                     }
                     await base44.entities.User.update(u.id, updateData);
                     // Send transition email
                     if (newType === 'seller') {
                       try { await base44.functions.invoke('sendSellerWelcomeEmail', { email: u.email, name: u.full_name || u.email }); } catch(e) {}
                     } else if (newType === 'business') {
                       try { await base44.functions.invoke('sendBusinessWelcomeEmail', { email: u.email, name: u.full_name || u.email, business_name: u.business_name || u.full_name }); } catch(e) {}
                     }
                     showToast(`User type changed to ${newType}${(newType==='seller'||newType==='business') ? ' — Email sent!' : ''}`);
                     loadAll();
                   }}
                   className="border border-[#0A192F]/10 rounded-xl px-2 py-1.5 font-body text-xs text-[#0A192F] bg-white focus:outline-none focus:border-[#2563EB]">
                   <option value="customer">Customer</option>
                   <option value="seller">Seller</option>
                   <option value="business">Business</option>
                 </select>
                 <button onClick={() => toggleVerified(u)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold transition-colors border ${u.is_verified_seller ? 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' : 'bg-[#F8FAFC] text-[#0A192F]/50 border-[#0A192F]/10 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200'}`}
                    title={u.is_verified_seller ? 'Remove Verified Badge' : 'Grant Verified Badge'}>
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {u.is_verified_seller ? 'Verified AI' : 'Verify'}
                  </button>
                </div>
              </motion.div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">No users found.</div>
            )}
          </div>
        ) : tab === 'reports' ? (
          /* REPORTS TAB */
          <div className="space-y-3">
            {reports.filter(r =>
              r.listing_title?.toLowerCase().includes(search.toLowerCase()) ||
              r.reporter_email?.toLowerCase().includes(search.toLowerCase())
            ).map(r => (
              <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-start gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Flag className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-heading font-bold text-sm text-[#0A192F] truncate">{r.listing_title || r.listing_id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${r.status === 'pending' ? 'bg-amber-100 text-amber-700' : r.status === 'removed' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 capitalize">{r.reason?.replace('_',' ')}</span>
                  </div>
                  <p className="font-body text-xs text-[#0A192F]/50">Reported by: {r.reporter_email}</p>
                  {r.details && <p className="font-body text-xs text-[#0A192F]/40 mt-0.5 italic">"{r.details}"</p>}
                  <a href={`/listing/${r.listing_id}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-1.5 font-body text-xs text-[#2563EB] hover:underline">View Listing →</a>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={async () => {
                          await base44.entities.Report.update(r.id, { status: 'dismissed' });
                          await base44.entities.Listing.update(r.listing_id, { is_active: true, status: 'active' });
                          showToast('Report dismissed — listing restored.');
                          loadAll();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-body text-xs font-bold hover:bg-green-100 transition-colors">
                        AI Restore
                      </button>
                      <button onClick={async () => {
                          if (!window.confirm('Permanently remove this listing? This cannot be undone.')) return;
                          await base44.entities.Report.update(r.id, { status: 'removed' });
                          await base44.entities.Listing.delete(r.listing_id);
                          showToast('Listing permanently removed.');
                          loadAll();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-body text-xs font-bold hover:bg-red-100 transition-colors">
                        AI Remove
                      </button>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <span className="font-body text-xs text-[#0A192F]/30 italic">Reviewed</span>
                  )}
                </div>
              </motion.div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">No reports yet.</div>
            )}
          </div>
        ) : tab === 'verifications' ? (
          <div className="space-y-3">
            {verifications.filter(v =>
              v.user_name?.toLowerCase().includes(search.toLowerCase()) ||
              v.user_email?.toLowerCase().includes(search.toLowerCase())
            ).map(v => (
              <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-start gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BadgeCheck className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-heading font-bold text-sm text-[#0A192F]">{v.user_name || v.user_email}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${v.status === 'pending' ? 'bg-amber-100 text-amber-700' : v.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {v.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] capitalize">{v.account_type?.replace('_', ' ')}</span>
                  </div>
                  <p className="font-body text-xs text-[#0A192F]/50">{v.user_email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[{ url: v.doc1_url, label: v.doc1_label || 'Doc 1' }, { url: v.doc2_url, label: v.doc2_label || 'Doc 2' }, { url: v.doc3_url, label: v.doc3_label || 'Doc 3' }]
                      .filter(d => d.url)
                      .map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] border border-[#0A192F]/10 rounded-lg font-body text-[10px] text-[#2563EB] hover:underline">
                          AI {doc.label}
                        </a>
                      ))}
                  </div>
                </div>
                {v.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <button onClick={async () => {
                       await base44.entities.VerificationApplication.update(v.id, { status: 'approved', reviewed_by: 'admin' });
                       const targetUser = users.find(u => u.email === v.user_email);
                       if (targetUser) {
                         const isBizApp = v.account_type === 'business_owner';
                         const updateData = {
                           is_verified_seller: true,
                           ...(isBizApp ? {
                             user_type: 'business',
                             is_seller: true,
                             account_type: 'business_owner',
                             business_pending: false,
                             member_type: 'business',
                           } : {})
                         };
                         await base44.entities.User.update(targetUser.id, updateData);
                         try {
                           if (isBizApp) {
                             await base44.functions.invoke('sendBusinessWelcomeEmail', {
                               email: v.user_email,
                               name: v.user_name,
                               business_name: targetUser.business_name || v.user_name,
                             });
                           } else {
                             await base44.functions.invoke('sendVerifiedPartnerEmail', {
                               email: v.user_email, name: v.user_name, business_name: v.user_name
                             });
                           }
                         } catch(e) {}
                       }
                       showToast('Verification approved & badge granted! Email sent.');
                       loadAll();
                     }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-body text-xs font-bold hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={async () => {
                        await base44.entities.VerificationApplication.update(v.id, { status: 'rejected', reviewed_by: 'admin' });
                        showToast('Application rejected.');
                        loadAll();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-body text-xs font-bold hover:bg-red-100 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
                {v.status !== 'pending' && (
                  <span className="font-body text-xs text-[#0A192F]/30 italic self-center">Reviewed</span>
                )}
              </motion.div>
            ))}
            {verifications.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">No verification applications yet.</div>
            )}
          </div>
        ) : tab === 'approvals' ? (
          /* ALL LISTINGS APPROVALS TAB */
          <div className="space-y-3">
            {pendingListings.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                No listings pending approval.
              </div>
            )}
            {pendingListings.filter(j =>
              j.title?.toLowerCase().includes(search.toLowerCase()) ||
              j.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
              j.email_contact?.toLowerCase().includes(search.toLowerCase())
            ).map(listing => (
              <motion.div key={listing.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-start gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-[#0A192F]/20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-heading font-bold text-sm text-[#0A192F] truncate">{listing.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Pending</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 capitalize">{listing.type?.replace('_',' ')}</span>
                    </div>
                    <p className="font-body text-xs text-[#0A192F]/50">{listing.seller_name} · {listing.location}{listing.area ? ` · ${listing.area}` : ''}</p>
                    {listing.email_contact && <p className="font-body text-[10px] text-[#2563EB]">{listing.email_contact}</p>}
                    {listing.description && <p className="font-body text-xs text-[#0A192F]/40 mt-1 line-clamp-2">{listing.description}</p>}
                    <a href={`/listing/${listing.id}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 font-body text-[10px] text-[#2563EB] hover:underline">Preview Listing</a>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <button onClick={() => approveListing(listing.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-body text-xs font-bold hover:bg-green-100 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => {
                      const note = window.prompt('Reason for rejection (optional):') || '';
                      rejectListing(listing.id, note);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-body text-xs font-bold hover:bg-red-100 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button onClick={() => deleteList(listing.id)}
                    className="p-1.5 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : tab === 'messages' ? (
          /* ADMIN MESSAGES VIEWER */
          <div>
            <div className="mb-4 flex gap-2">
              <input value={msgUserEmail} onChange={e => setMsgUserEmail(e.target.value)}
                placeholder="Enter user email to view their messages..."
                className="flex-1 border border-[#0A192F]/10 rounded-xl px-3 py-2.5 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
              <button onClick={() => loadAdminMessages(msgUserEmail)}
                className="px-4 py-2.5 bg-[#0A192F] text-white rounded-xl font-body text-xs font-bold hover:bg-[#2563EB] transition-colors">
                {loadingMsgs ? 'Loading...' : 'View Messages'}
              </button>
              <button onClick={() => loadAdminMessages('')}
                className="px-4 py-2.5 bg-white border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-xs font-semibold hover:bg-[#F8FAFC] transition-colors">
                All Recent
              </button>
            </div>
            <p className="font-body text-[10px] text-[#0A192F]/30 mb-3">Admin view — message history is read silently. Users are not notified.</p>
            <div className="space-y-2">
              {adminMessages.length === 0 && !loadingMsgs && (
                <div className="text-center py-12 text-[#0A192F]/30 font-body text-sm">Enter a user email and click View Messages, or click All Recent.</div>
              )}
              {adminMessages.map(m => (
                <div key={m.id} className="rounded-xl p-3" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${m.chat_type === 'business' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{m.chat_type || 'listing'}</span>
                      <span className="font-body text-xs font-bold text-white">{m.sender_name || m.sender_email}</span>
                      <span className="font-body text-[9px] text-white/40">to {m.buyer_email === m.sender_email ? m.seller_email : m.buyer_email}</span>
                    </div>
                    <span className="font-body text-[9px] text-[#0A192F]/30">{new Date(m.created_date).toLocaleString('en-PH')}</span>
                  </div>
                  <p className="font-body text-xs text-[#0A192F]/70">{m.message}</p>
                  {m.listing_title && <p className="font-body text-[9px] text-[#2563EB] mt-0.5">Re: {m.listing_title}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : tab === 'ghost' ? (
          /* CREATED USER ACCOUNTS TAB */
          <div className="space-y-6">
            {/* Create ghost account form */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Ghost className="w-4 h-4 text-purple-500" />
                <h3 className="font-heading font-bold text-sm text-[#0A192F]">Create User Account</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-700">Admin-created account</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Display Name *</label>
                  <input value={ghostForm.full_name} onChange={e => setGhostForm(f => ({...f, full_name: e.target.value}))}
                    placeholder="e.g. Juan Dela Cruz" className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Business / Channel Name</label>
                  <input value={ghostForm.business_name} onChange={e => setGhostForm(f => ({...f, business_name: e.target.value}))}
                    placeholder="Optional" className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Account Type</label>
                  <select value={ghostForm.user_type} onChange={e => setGhostForm(f => ({...f, user_type: e.target.value}))}
                    className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] bg-white focus:outline-none focus:border-[#2563EB]">
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Location</label>
                  <select value={ghostForm.location} onChange={e => setGhostForm(f => ({...f, location: e.target.value}))}
                    className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] bg-white focus:outline-none focus:border-[#2563EB]">
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={createGhostAccount} disabled={ghostSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-body text-sm font-bold transition-colors disabled:opacity-50">
                {ghostSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Ghost className="w-4 h-4" />}
                Create User Account
              </button>
            </div>

            {/* List ghost accounts */}
            <div>
              <h4 className="font-heading font-bold text-sm text-[#0A192F] mb-3">Created User Accounts ({ghostUsers.length})</h4>
              {ghostUsers.length === 0 && (
                <div className="text-center py-12 text-[#0A192F]/30 font-body text-sm">No created user accounts yet.</div>
              )}
              <div className="space-y-3">
                {ghostUsers.map(u => (
                  <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-4 flex items-center gap-4 flex-wrap" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Ghost className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-heading font-bold text-sm text-[#0A192F]">{u.full_name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-700 capitalize">{u.user_type || 'customer'}</span>
                        {u.ghost_linked && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700">Linked</span>}
                      </div>
                      <p className="font-body text-xs text-[#0A192F]/40">{u.seller_location} · {u.business_name || '—'}</p>
                    </div>
                    {/* Link to real email */}
                    {!u.ghost_linked && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          value={ghostLinkEmail[u.id] || ''}
                          onChange={e => setGhostLinkEmail(prev => ({...prev, [u.id]: e.target.value}))}
                          placeholder="Link real email..."
                          className="border border-[#0A192F]/10 rounded-xl px-3 py-1.5 font-body text-xs text-[#0A192F] focus:outline-none focus:border-[#2563EB] w-48"
                        />
                        <button onClick={() => linkGhostToEmail(u)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-body text-xs font-bold hover:bg-[#1d4ed8] transition-colors">
                          <Link2 className="w-3 h-3" /> Link
                        </button>
                      </div>
                    )}
                    <button onClick={async () => {
                        if (!window.confirm('Delete this created user account?')) return;
                        await base44.entities.User.delete(u.id);
                        showToast('Created user account deleted.');
                        loadAll();
                      }}
                      className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0A192F] text-white px-6 py-3 rounded-xl font-body text-sm shadow-2xl z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}