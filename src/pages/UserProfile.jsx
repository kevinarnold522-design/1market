import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Shield, LogOut, Star, ShoppingBag, Package,
  Heart, Settings, Store, MapPin, Bell, ShoppingCart, CheckCircle,
  History, Edit2, Check, X, AlertCircle, BadgeCheck
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import UsernameSetupModal from '../components/UsernameSetupModal';

const TABS = [
  { key: 'profile',   label: 'Profile',     icon: User },
  { key: 'orders',    label: 'Orders',       icon: History },
  { key: 'cart',      label: 'Cart',         icon: ShoppingCart },
  { key: 'favourites',label: 'Favourites',   icon: Heart },
  { key: 'settings',  label: 'Settings',     icon: Settings },
];

function TabBtn({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={() => onClick(tab.key)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-body text-xs font-semibold transition-all whitespace-nowrap ${active ? 'bg-[#2563EB] text-white' : 'text-white/40 hover:text-white'}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{tab.label}</span>
    </button>
  );
}

export default function UserProfile() {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const urlTab = new URLSearchParams(window.location.search).get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(urlTab);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  // Settings edit states
  const [editEmail, setEditEmail] = useState(false);
  const [emailVal, setEmailVal] = useState('');
  const [editLocation, setEditLocation] = useState(false);
  const [locationVal, setLocationVal] = useState('Manila');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const showSaved = (msg) => { setSavedMsg(msg); setTimeout(() => setSavedMsg(''), 2500); };

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        setEmailVal(me.email || '');
        setLocationVal(me.location || 'Manila');
        if (!me.username_set) setShowUsernameSetup(true);
        const [o, c, f] = await Promise.all([
          base44.entities.Order.filter({ buyer_email: me.email }),
          base44.entities.Cart.filter({ user_email: me.email }),
          base44.entities.Favourite.filter({ user_email: me.email }),
        ]);
        setOrders(o);
        setCart(c);
        setFavourites(f);
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  if (!authUser && !loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6">
          <User className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-white mb-2">Sign In Required</h2>
          <p className="font-body text-sm text-white/40 mb-6">Please sign in to view your dashboard.</p>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const initials = user ? (user.full_name || user.username || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '..';
  const memberSince = user?.created_date ? new Date(user.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';
  const completedOrders = orders.filter(o => o.status === 'completed');
  const isVerified = user?.is_verified_seller;
  const isSeller = user?.is_seller || user?.account_type === 'business_owner';

  const saveSettings = async (data) => {
    setSaving(true);
    await base44.auth.updateMe(data);
    const me = await base44.auth.me();
    setUser(me);
    setSaving(false);
    showSaved('Saved!');
  };

  const toggleNotifications = () => saveSettings({ notifications_enabled: !user?.notifications_enabled });
  const toggleEmailUpdates = () => saveSettings({ email_updates: !user?.email_updates });

  const removeCartItem = async (id) => {
    await base44.entities.Cart.delete(id);
    setCart(c => c.filter(i => i.id !== id));
  };

  const removeFav = async (id) => {
    await base44.entities.Favourite.delete(id);
    setFavourites(f => f.filter(i => i.id !== id));
  };

  const confirmReceived = async (order) => {
    const updated = await base44.entities.Order.update(order.id, {
      buyer_confirmed_received: true,
      status: order.seller_confirmed_delivery ? 'completed' : 'buyer_confirmed',
    });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updated } : o));
  };

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />

      {showUsernameSetup && user && (
        <UsernameSetupModal user={user} onComplete={async () => {
          setShowUsernameSetup(false);
          const me = await base44.auth.me();
          setUser(me);
        }} />
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-3 py-6 pt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-4 font-body text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to 1Market.ph
        </Link>

        {/* Profile Header */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 mb-4"
            style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-heading font-bold text-xl text-white"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                  {initials}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center border-2 border-[#070F1A]">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-heading font-bold text-base text-white truncate">
                    {user.username ? `@${user.username}` : user.full_name || 'Your Account'}
                  </h1>
                  {isVerified && <BadgeCheck className="w-4 h-4 text-[#2563EB] flex-shrink-0" />}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className={`px-2 py-0.5 rounded-full font-body text-[9px] font-bold border ${isSeller ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/25' : 'bg-[#2563EB]/20 text-[#60a5fa] border-[#2563EB]/20'}`}>
                    {isSeller ? '🏪 Business Owner' : '🛍️ Customer'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-body text-[9px] border border-white/8">
                    Since {memberSince}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-body text-[9px] font-bold border border-amber-500/30">
                      <Shield className="w-2.5 h-2.5 inline mr-0.5" />Admin
                    </span>
                  )}
                  {!isVerified && isSeller && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-white/20 font-body text-[8px] border border-white/8">
                      Independent Non-verified Partner
                    </span>
                  )}
                </div>
                <p className="font-body text-[10px] text-white/35 mt-0.5 flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 text-[#00D4FF]" /> {user.email}
                </p>
              </div>
              <button onClick={() => logout(true)}
                className="flex-shrink-0 p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { icon: History, label: 'Orders', val: orders.length },
                { icon: CheckCircle, label: 'Completed', val: completedOrders.length },
                { icon: ShoppingCart, label: 'Cart', val: cart.length },
                { icon: Heart, label: 'Saved', val: favourites.length },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Icon className="w-3.5 h-3.5 text-[#00D4FF] mx-auto mb-1" />
                  <p className="font-heading font-bold text-sm text-white">{val}</p>
                  <p className="font-body text-[9px] text-white/35">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(tab => (
            <TabBtn key={tab.key} tab={tab} active={activeTab === tab.key} onClick={setActiveTab} />
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

            {/* PROFILE */}
            {activeTab === 'profile' && user && (
              <div className="space-y-3">
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Account Information</h2>
                  {[
                    { label: 'Username', value: user.username ? `@${user.username}` : '—' },
                    { label: 'Full Name', value: user.full_name || '—' },
                    { label: 'Email', value: user.email },
                    { label: 'Account Type', value: isSeller ? '🏪 Business Owner / Seller' : '🛍️ Customer' },
                    { label: 'Location', value: user.location || user.seller_location || '—' },
                    { label: 'Member Since', value: memberSince },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="font-body text-[10px] text-white/35 uppercase tracking-wider">{label}</span>
                      <span className="font-body text-xs text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Seller CTA */}
                {!isSeller ? (
                  <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.12),rgba(0,212,255,0.06))', border: '1px solid rgba(0,212,255,0.18)' }}>
                    <div className="flex items-center gap-3">
                      <Store className="w-8 h-8 text-[#00D4FF] flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-heading font-bold text-white text-sm">Start Selling on 1Market</p>
                        <p className="font-body text-[10px] text-white/40 mb-2">List products, services, or businesses for free.</p>
                        <Link to="/seller" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors">
                          <Store className="w-3 h-3" /> Start Selling →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-heading font-bold text-white text-sm flex items-center gap-1">
                            Active Seller {isVerified && <BadgeCheck className="w-4 h-4 text-[#2563EB]" />}
                          </p>
                          <p className="font-body text-[10px] text-white/40">{user.seller_location || 'Location not set'}</p>
                        </div>
                      </div>
                      <Link to="/seller" className="px-3 py-1.5 bg-green-500/10 border border-green-500/25 text-green-400 rounded-xl font-body text-xs font-semibold hover:bg-green-500/20 transition-colors">
                        Dashboard →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS / TRANSACTION HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-white text-sm">Transaction History</h3>
                {orders.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <History className="w-8 h-8 text-white/15 mx-auto mb-2" />
                    <p className="font-body text-sm text-white/30">No orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map(order => (
                      <div key={order.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {order.listing_image && <img src={order.listing_image} alt={order.listing_title} className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-sm text-white truncate">{order.listing_title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{order.price_label}</p>
                          <p className="font-body text-[10px] text-white/30">Seller: {order.seller_name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {order.status}
                          </span>
                          {order.status !== 'completed' && order.status !== 'cancelled' && !order.buyer_confirmed_received && (
                            <button onClick={() => confirmReceived(order)}
                              className="mt-1 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] font-body text-[9px] font-bold hover:bg-[#00D4FF]/20 transition-colors">
                              <CheckCircle className="w-2.5 h-2.5" /> Confirm Received
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Orders */}
                {completedOrders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-heading font-bold text-white/50 text-xs uppercase tracking-wider mb-2">✅ Successful Orders ({completedOrders.length})</h4>
                    <div className="space-y-2">
                      {completedOrders.map(order => (
                        <div key={order.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs text-white font-semibold truncate">{order.listing_title}</p>
                            <p className="font-body text-[9px] text-green-400">{order.price_label} · Completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    <ShoppingCart className="w-8 h-8 text-white/15 mx-auto mb-2" />
                    <p className="font-body text-sm text-white/30">Your cart is empty.</p>
                    <Link to="/buysell" className="inline-block mt-3 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
                      Browse Listings →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {item.listing_image && <img src={item.listing_image} alt="" className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs font-bold text-white truncate">{item.listing_title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{item.price_label}</p>
                          <p className="font-body text-[9px] text-white/30">{item.seller_name}</p>
                        </div>
                        <button onClick={() => removeCartItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                          <X className="w-3 h-3" />
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
                    <Heart className="w-8 h-8 text-white/15 mx-auto mb-2" />
                    <p className="font-body text-sm text-white/30">No saved items yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {favourites.map(fav => (
                      <div key={fav.id} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {fav.image_url && <img src={fav.image_url} alt={fav.title} className="w-full aspect-video object-cover" />}
                        <div className="p-2">
                          <p className="font-body text-xs font-bold text-white truncate">{fav.title}</p>
                          <p className="font-body text-[10px] text-[#00D4FF]">{fav.price_label}</p>
                          <button onClick={() => removeFav(fav.id)} className="mt-1 text-[9px] text-white/25 hover:text-red-400 font-body transition-colors">Remove</button>
                        </div>
                      </div>
                    ))}
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
                    <Check className="w-3.5 h-3.5" /> {savedMsg}
                  </motion.div>
                )}

                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Update Location</h2>
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Your Location</label>
                    <select
                      value={locationVal}
                      onChange={e => setLocationVal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] mb-2"
                    >
                      {['Manila', 'Cavite', 'Cebu', 'Davao', 'Nationwide'].map(l => (
                        <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>
                      ))}
                    </select>
                    <button onClick={() => saveSettings({ location: locationVal })} disabled={saving}
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors disabled:opacity-50 flex items-center gap-1.5">
                      {saving ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <MapPin className="w-3 h-3" />}
                      Save Location
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-sm">Notifications</h2>
                  {[
                    { label: 'Push Notifications', desc: 'Order updates, messages', key: 'notifications_enabled', icon: Bell, val: user?.notifications_enabled, toggle: toggleNotifications },
                    { label: 'Email Updates', desc: 'Deals, newsletters', key: 'email_updates', icon: Mail, val: user?.email_updates, toggle: toggleEmailUpdates },
                  ].map(s => (
                    <div key={s.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-2">
                        <s.icon className="w-3.5 h-3.5 text-[#00D4FF]" />
                        <div>
                          <p className="font-body text-xs text-white font-semibold">{s.label}</p>
                          <p className="font-body text-[9px] text-white/35">{s.desc}</p>
                        </div>
                      </div>
                      <button onClick={s.toggle}
                        className={`w-9 h-5 rounded-full relative transition-colors ${s.val ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.val ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>

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
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}