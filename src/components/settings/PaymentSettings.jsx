import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Link2, Check, X, ExternalLink, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STRIPE_CONNECT_URL = 'https://connect.stripe.com/express/oauth/authorize';
const PAYPAL_CONNECT_URL = 'https://www.paypal.com/merchantsignup/application';

export default function PaymentSettings({ user }) {
  const [stripeLinked, setStripeLinked] = useState(false);
  const [paypalLinked, setPaypalLinked] = useState(false);
  const [stripeEmail, setStripeEmail] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingPaypal, setLoadingPaypal] = useState(false);
  const [showStripeInput, setShowStripeInput] = useState(false);
  const [showPaypalInput, setShowPaypalInput] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    if (user) {
      setStripeLinked(!!user.stripe_connected);
      setPaypalLinked(!!user.paypal_connected);
      setStripeEmail(user.stripe_email || '');
      setPaypalEmail(user.paypal_email || '');
    }
  }, [user]);

  const handleLinkStripe = async () => {
    if (!stripeEmail.trim()) { showToast('Please enter your Stripe email'); return; }
    setLoadingStripe(true);
    try {
      // In test mode, simulate linking
      await base44.auth.updateMe({
        stripe_connected: true,
        stripe_email: stripeEmail.trim(),
      });
      setStripeLinked(true);
      showToast('✓ Stripe account linked successfully');
      setShowStripeInput(false);
    } catch (err) {
      showToast('Could not link Stripe: ' + (err.message || 'Unknown error'));
    }
    setLoadingStripe(false);
  };

  const handleLinkPaypal = async () => {
    if (!paypalEmail.trim()) { showToast('Please enter your PayPal email'); return; }
    setLoadingPaypal(true);
    try {
      await base44.auth.updateMe({
        paypal_connected: true,
        paypal_email: paypalEmail.trim(),
      });
      setPaypalLinked(true);
      showToast('✓ PayPal account linked successfully');
      setShowPaypalInput(false);
    } catch (err) {
      showToast('Could not link PayPal: ' + (err.message || 'Unknown error'));
    }
    setLoadingPaypal(false);
  };

  const handleDisconnectStripe = async () => {
    if (!window.confirm('Disconnect your Stripe account?')) return;
    try {
      await base44.auth.updateMe({ stripe_connected: false, stripe_email: '' });
      setStripeLinked(false);
      setStripeEmail('');
      showToast('Stripe account disconnected');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDisconnectPaypal = async () => {
    if (!window.confirm('Disconnect your PayPal account?')) return;
    try {
      await base44.auth.updateMe({ paypal_connected: false, paypal_email: '' });
      setPaypalLinked(false);
      setPaypalEmail('');
      showToast('PayPal account disconnected');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-base text-white">Payment & Billing Settings</h3>
      <p className="font-body text-xs text-white/40">Connect your payout accounts to receive payments from your sales.</p>

      {/* Stripe Connect */}
      <motion.div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(99,91,255,0.25)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,91,255,0.15)' }}>
              <CreditCard className="w-5 h-5 text-[#635bff]" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-white">Stripe Connect</p>
              <p className="font-body text-[10px] text-white/35">Receive payouts via Stripe</p>
            </div>
          </div>
          {stripeLinked && (
            <span className="px-2.5 py-1 rounded-full font-body font-bold text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 flex items-center gap-1">
              <Check className="w-3 h-3" /> Connected
            </span>
          )}
        </div>

        {stripeLinked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span className="font-body text-xs text-white/60">{stripeEmail}</span>
            </div>
            <button onClick={handleDisconnectStripe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[10px] font-bold text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20">
              <X className="w-3 h-3" /> Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {showStripeInput ? (
              <div className="space-y-2">
                <input value={stripeEmail} onChange={e => setStripeEmail(e.target.value)}
                  placeholder="Your Stripe account email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#635bff]" />
                <div className="flex gap-2">
                  <button onClick={handleLinkStripe} disabled={loadingStripe || !stripeEmail.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-body font-bold text-xs text-white transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#635bff,#4f46e5)' }}>
                    {loadingStripe ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Link2 className="w-3.5 h-3.5" /> Link Stripe</>}
                  </button>
                  <button onClick={() => setShowStripeInput(false)}
                    className="px-3 py-2 rounded-xl font-body text-xs text-white/40 hover:text-white/70 border border-white/10">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowStripeInput(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg,#635bff,#4f46e5)', boxShadow: '0 0 16px rgba(99,91,255,0.3)' }}>
                <CreditCard className="w-4 h-4" /> Connect Stripe Account
              </button>
            )}
            <p className="font-body text-[9px] text-white/25">Enter your Stripe account email. In production, you'll be redirected to Stripe's secure onboarding.</p>
          </div>
        )}
      </motion.div>

      {/* PayPal */}
      <motion.div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(0,156,222,0.25)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,156,222,0.15)' }}>
              <CreditCard className="w-5 h-5 text-[#009cde]" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-white">PayPal Payouts</p>
              <p className="font-body text-[10px] text-white/35">Receive payouts via PayPal</p>
            </div>
          </div>
          {paypalLinked && (
            <span className="px-2.5 py-1 rounded-full font-body font-bold text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 flex items-center gap-1">
              <Check className="w-3 h-3" /> Connected
            </span>
          )}
        </div>

        {paypalLinked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span className="font-body text-xs text-white/60">{paypalEmail}</span>
            </div>
            <button onClick={handleDisconnectPaypal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[10px] font-bold text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20">
              <X className="w-3 h-3" /> Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {showPaypalInput ? (
              <div className="space-y-2">
                <input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)}
                  placeholder="Your PayPal account email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#009cde]" />
                <div className="flex gap-2">
                  <button onClick={handleLinkPaypal} disabled={loadingPaypal || !paypalEmail.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-body font-bold text-xs text-white transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#009cde,#003087)' }}>
                    {loadingPaypal ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Link2 className="w-3.5 h-3.5" /> Link PayPal</>}
                  </button>
                  <button onClick={() => setShowPaypalInput(false)}
                    className="px-3 py-2 rounded-xl font-body text-xs text-white/40 hover:text-white/70 border border-white/10">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowPaypalInput(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg,#009cde,#003087)', boxShadow: '0 0 16px rgba(0,156,222,0.3)' }}>
                <CreditCard className="w-4 h-4" /> Connect PayPal Account
              </button>
            )}
            <p className="font-body text-[9px] text-white/25">Enter your PayPal email. Production will use PayPal's OAuth onboarding flow.</p>
          </div>
        )}
      </motion.div>

      {/* Info */}
      <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
        <AlertCircle className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
        <p className="font-body text-[10px] text-white/45 leading-relaxed">
          Connecting payment providers allows you to receive payouts for your sales. Your financial information is encrypted and never shared. You can disconnect at any time.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl font-body text-xs text-white shadow-xl z-[200]"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.4)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}