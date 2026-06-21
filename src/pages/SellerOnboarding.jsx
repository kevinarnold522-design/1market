import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store, Building2, CheckCircle, ChevronRight, ChevronLeft,
  MapPin, Phone, Image, FileText, Package, Star, ArrowLeft,
  Camera, Upload, AlertCircle, Check, Users, Briefcase
} from 'lucide-react';
import OneCheckmark from '../components/OneCheckmark';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToR2 } from '@/lib/r2Upload';

const LOCATIONS = ['Manila', 'Cavite', 'Nationwide'];
const AREAS = {
  Manila: ['Ermita', 'Malate', 'Binondo', 'Quiapo', 'Sampaloc', 'Sta. Mesa', 'Tondo', 'Paco', 'Pandacan', 'San Miguel', 'Makati', 'BGC / Taguig', 'Pasig', 'Mandaluyong', 'San Juan', 'Quezon City', 'Caloocan', 'Las Piñas', 'Parañaque', 'Pasay', 'Valenzuela', 'Marikina', 'Malabon', 'Navotas', 'Pateros', 'Other'],
  Cavite: ['Bacoor', 'Imus', 'Dasmariñas', 'Gen. Trias', 'Trece Martires', 'Tagaytay', 'Silang', 'Kawit', 'Noveleta', 'Rosario', 'Tanza', 'Naic', 'Mendez', 'Alfonso', 'Amadeo', 'Other'],
  Nationwide: ['Multiple Locations'],
};

const SELLER_TYPES = [
  { value: 'products', label: 'Products & Goods', desc: 'Sell physical items — new or used', color: '#8b5cf6', emoji: 'AI' },
  { value: 'food', label: 'Food & Beverages', desc: 'Home cooking, baked goods, drinks', color: '#f97316', emoji: 'AI' },
  { value: 'services', label: 'Services', desc: 'Skills, trades, professional services', color: '#3b82f6', emoji: 'AI' },
  { value: 'travel', label: 'Travel & Hospitality', desc: 'Hotels, tours, vehicle rentals', color: '#0ea5e9', emoji: 'AI️' },
  { value: 'rent', label: 'Rooms & Spaces', desc: 'Rent/sell rooms, properties, commercial', color: '#10b981', emoji: 'AI' },
  { value: 'jobs', label: 'Job Postings', desc: 'Post hiring opportunities', color: '#f59e0b', emoji: 'AI' },
];

const BUSINESS_TYPES = [
  { value: 'food', label: 'Food & Restaurant', emoji: 'AI' },
  { value: 'retail', label: 'Retail Store', emoji: 'AI' },
  { value: 'services', label: 'Services Company', emoji: 'AI' },
  { value: 'hotel_travel', label: 'Hotel / Travel', emoji: 'AI️' },
  { value: 'real_estate', label: 'Real Estate', emoji: 'AI' },
  { value: 'tech', label: 'Tech / Digital', emoji: 'AI' },
  { value: 'healthcare', label: 'Healthcare', emoji: 'AI' },
  { value: 'events', label: 'Events & Entertainment', emoji: 'AI' },
  { value: 'other', label: 'Other Business', emoji: 'AI' },
];

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountMode, setAccountMode] = useState(null); // 'seller' | 'business'
  const [step, setStep] = useState(0); // 0=choose mode, 1=type, 2=profile, 3=done
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    seller_type: '',
    business_type: '',
    channel_name: '',
    location: 'Manila',
    area: '',
    phone: '',
    profile_picture: '',
    bio: '',
    business_name: '',
  });

  useEffect(() => {
    base44.auth.me()
      .then(u => { setUser(u); setForm(f => ({ ...f, channel_name: u?.full_name || '', phone: u?.phone || '' })); setLoading(false); })
      .catch(() => { navigate('/'); });
  }, []);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    const { file_url } = await uploadMediaFileToR2(file);
    set('profile_picture', file_url);
    setUploadingImg(false);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!form.channel_name.trim()) { setError('Channel/Business name is required.'); return; }
    if (!form.location) { setError('Location is required.'); return; }
    setSaving(true);
    const isBusiness = accountMode === 'business';
    const updateData = {
      user_type: isBusiness ? 'business' : 'seller',
      is_seller: true,
      account_type: isBusiness ? 'business_owner' : 'business_owner',
      member_type: isBusiness ? 'business' : 'seller',
      seller_type: form.seller_type || form.business_type,
      seller_location: form.location,
      seller_area: form.area,
      phone: form.phone,
      bio: form.bio,
      ...(isBusiness ? { business_name: form.business_name || form.channel_name, business_type: form.business_type } : {}),
      ...(form.profile_picture ? { profile_picture: form.profile_picture } : {}),
    };
    await base44.auth.updateMe(updateData);
    try {
      if (isBusiness) {
        await base44.functions.invoke('sendBusinessWelcomeEmail', { email: user.email, name: user.full_name, business_name: form.business_name || form.channel_name });
      } else {
        await base44.functions.invoke('sendSellerWelcomeEmail', { email: user.email, name: user.full_name });
      }
    } catch (e) {}
    setSaving(false);
    setStep(3);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  const progress = step === 0 ? 10 : step === 1 ? 40 : step === 2 ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg,#070F1A,#0D1F3C,#0A192F)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/8 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(90deg,#10b981,#00D4FF)' }} />
        </div>
        <span className="font-body text-xs text-white/40">{progress}%</span>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Choose mode */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-8">
                  <p className="font-body text-sm text-[#00D4FF]/70 mb-1">Welcome, {user?.full_name?.split(' ')[0] || 'there'}!</p>
                  <h1 className="font-heading font-black text-3xl text-white mb-2">Start Selling on<br />1MarketPH</h1>
                  <p className="font-body text-sm text-white/50">Choose how you want to sell — you can always upgrade later.</p>
                </div>

                <div className="space-y-3">
                  <motion.button whileTap={{ scale: 0.98 }}
                    onClick={() => { setAccountMode('seller'); setStep(1); }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(0,212,255,0.06))', border: '1.5px solid rgba(16,185,129,0.3)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      AI
                    </div>
                    <div className="flex-1">
                       <p className="font-heading font-bold text-white text-lg">Individual Seller</p>
                       <p className="font-body text-sm text-white/50 mt-0.5">For individuals acting as sole proprietorships, referees, or third-party resellers. List products, services, food & jobs under your personal name.</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['Free to list', 'No fees', 'Instant setup'].map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full font-body text-[10px] font-bold text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                  </motion.button>

                  <motion.button whileTap={{ scale: 0.98 }}
                    onClick={() => { setAccountMode('business'); setStep(1); }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(0,212,255,0.08))', border: '1.5px solid rgba(37,99,235,0.3)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.25)' }}>
                      AI
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-white text-lg">Business Account</p>
                      <p className="font-body text-sm text-white/50 mt-0.5">For massive corporations or entities operating as more than one person. Business accounts can have multiple emails and list under a shared business name. Eligible for the <OneCheckmark size="xs" label="1Checkmark" /> badge.</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['Business profile', 'Verified badge', 'Priority listing'].map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full font-body text-[10px] font-bold text-[#60a5fa]" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                  </motion.button>
                </div>

                <p className="text-center font-body text-xs text-white/25 mt-6">
                  Already set up? <Link to="/profile" className="text-[#00D4FF] hover:underline">Go to your profile →</Link>
                </p>
              </motion.div>
            )}

            {/* STEP 1 — Seller/Business type */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-white/50 hover:text-white font-body text-sm mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  {accountMode === 'business' ? 'What type of business?' : 'What do you sell?'}
                </h2>
                <p className="font-body text-sm text-white/50 mb-6">Pick the option that best describes you.</p>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  {(accountMode === 'business' ? BUSINESS_TYPES : SELLER_TYPES).map(type => {
                    const isSelected = accountMode === 'business' ? form.business_type === type.value : form.seller_type === type.value;
                    const color = accountMode === 'business' ? '#60a5fa' : (type.color || '#00D4FF');
                    return (
                      <motion.button key={type.value} whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (accountMode === 'business') set('business_type', type.value);
                          else set('seller_type', type.value);
                          setError('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all"
                        style={{
                          borderColor: isSelected ? color : 'rgba(255,255,255,0.1)',
                          background: isSelected ? `${color}15` : 'rgba(255,255,255,0.03)',
                        }}>
                        <span className="text-xl flex-shrink-0">{type.emoji}</span>
                        <div className="flex-1">
                          <p className="font-body font-bold text-sm text-white">{type.label}</p>
                          {type.desc && <p className="font-body text-[10px] text-white/40">{type.desc}</p>}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all`}
                          style={{ borderColor: isSelected ? color : 'rgba(255,255,255,0.2)', background: isSelected ? color : 'transparent' }}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {error && <p className="text-red-400 font-body text-xs mb-3 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}

                <button
                  onClick={() => {
                    const hasType = accountMode === 'business' ? !!form.business_type : !!form.seller_type;
                    if (!hasType) { setError('Please select a type to continue.'); return; }
                    setError(''); setStep(2);
                  }}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 24px rgba(0,212,255,0.2)' }}>
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Profile setup */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-white/50 hover:text-white font-body text-sm mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <h2 className="font-heading font-bold text-2xl text-white mb-1">Set up your profile</h2>
                <p className="font-body text-sm text-white/50 mb-6">This is how buyers will find and know you.</p>

                <div className="space-y-4">
                  {/* Profile photo */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <label className="relative w-16 h-16 rounded-xl flex-shrink-0 cursor-pointer group">
                      {form.profile_picture ? (
                        <img src={form.profile_picture} alt="profile" className="w-full h-full rounded-xl object-cover border-2 border-[#00D4FF]/30" />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadingImg ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4 text-white" />}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                    </label>
                    <div>
                      <p className="font-body font-bold text-sm text-white">Profile Photo</p>
                      <p className="font-body text-xs text-white/40">Upload a clear photo or logo</p>
                    </div>
                  </div>

                  {/* Channel / Business name */}
                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                      {accountMode === 'business' ? 'Business Name *' : 'Channel / Seller Name *'}
                    </label>
                    <input value={form.channel_name} onChange={e => set('channel_name', e.target.value)}
                      placeholder={accountMode === 'business' ? 'e.g. Juan\'s Bakeshop' : 'e.g. JuanSells'}
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  </div>

                  {accountMode === 'business' && (
                    <div>
                      <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">Official Business Name</label>
                      <input value={form.business_name} onChange={e => set('business_name', e.target.value)}
                        placeholder="Registered business name (for verification)"
                        className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                    </div>
                  )}

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">Location *</label>
                      <select value={form.location} onChange={e => { set('location', e.target.value); set('area', ''); }}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none bg-transparent transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">Area</label>
                      <select value={form.area} onChange={e => set('area', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none bg-transparent transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <option value="" className="bg-[#0D1F3C]">Select area</option>
                        {(AREAS[form.location] || []).map(a => <option key={a} value={a} className="bg-[#0D1F3C]">{a}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">Phone / Contact</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+63 9xx-xxx-xxxx"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 mb-1.5 uppercase tracking-wider">Short Bio / Description</label>
                    <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                      placeholder="Tell buyers a bit about you or your business..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] transition-colors resize-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  </div>
                </div>

                {error && <p className="text-red-400 font-body text-xs mt-3 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}

                <button onClick={handleSubmit} disabled={saving}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 mt-6 transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 24px rgba(0,212,255,0.2)' }}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Store className="w-4 h-4" />}
                  {saving ? 'Activating...' : accountMode === 'business' ? 'Activate Business Account' : 'Activate Seller Account'}
                </button>
                <p className="text-center font-body text-[10px] text-white/25 mt-2">Free forever · No listing fees · DPA 2012 compliant</p>
              </motion.div>
            )}

            {/* STEP 3 — Done */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl"
                  style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(0,212,255,0.15))', border: '2px solid rgba(16,185,129,0.4)' }}>
                  AI
                </motion.div>
                <h2 className="font-heading font-black text-3xl text-white mb-2">
                  {accountMode === 'business' ? 'Business Account Active!' : 'Seller Account Active!'}
                </h2>
                <p className="font-body text-sm text-white/60 mb-6 max-w-xs mx-auto leading-relaxed">
                  {accountMode === 'business'
                    ? 'Your business account is set up. Post listings, manage your profile, and apply for the Verified AI badge anytime.'
                    : 'You can now post listings, manage orders, and build your seller presence on 1MarketPH.'}
                </p>

                <div className="grid grid-cols-1 gap-3 mb-6 max-w-xs mx-auto text-left">
                  {[
                    { icon: 'AI', label: 'Post your first listing', href: '/profile?tab=listings' },
                    { icon: 'AI', label: 'Complete your profile', href: '/profile' },
                    { icon: 'AI', label: accountMode === 'business' ? 'Apply for Verified badge' : 'Apply for Verified Partner', href: '/profile?tab=sellerpage' },
                  ].map((item, i) => (
                    <Link key={i} to={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/70 hover:text-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-white/30" />
                    </Link>
                  ))}
                </div>

                <Link to="/"
                  className="inline-block px-8 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  Back to Homepage
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}