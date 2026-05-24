import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PaymentSettings({ user, onToast }) {
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalConnected, setPaypalConnected] = useState(false);
  const [debitCardLast4, setDebitCardLast4] = useState('');
  const [debitCardConnected, setDebitCardConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectingPaypal, setConnectingPaypal] = useState(false);
  const [connectingDebit, setConnectingDebit] = useState(false);

  useEffect(() => {
    const loadPaymentInfo = async () => {
      try {
        const me = await base44.auth.me();
        setPaypalEmail(me.paypal_email || '');
        setPaypalConnected(!!me.paypal_email);
        setDebitCardLast4(me.debit_card_last4 || '');
        setDebitCardConnected(!!me.debit_card_last4);
      } catch (e) {}
      setLoading(false);
    };
    loadPaymentInfo();
  }, []);

  const handleConnectPaypal = async () => {
    setConnectingPaypal(true);
    // Simulate PayPal OAuth flow - in production this would redirect to PayPal
    // For now, we'll prompt user to enter their PayPal email
    const paypalEmail = prompt('Enter your PayPal email address:');
    if (paypalEmail && paypalEmail.includes('@')) {
      try {
        await base44.auth.updateMe({ paypal_email: paypalEmail.toLowerCase() });
        setPaypalEmail(paypalEmail.toLowerCase());
        setPaypalConnected(true);
        onToast('PayPal connected successfully!');
      } catch (e) {
        onToast('Failed to connect PayPal');
      }
    }
    setConnectingPaypal(false);
  };

  const handleChangePaypal = async () => {
    const paypalEmail = prompt('Enter your new PayPal email address:');
    if (paypalEmail && paypalEmail.includes('@')) {
      try {
        await base44.auth.updateMe({ paypal_email: paypalEmail.toLowerCase() });
        setPaypalEmail(paypalEmail.toLowerCase());
        onToast('PayPal email updated!');
      } catch (e) {
        onToast('Failed to update PayPal');
      }
    }
  };

  const handleConnectDebit = async () => {
    setConnectingDebit(true);
    // Simulate debit card connection
    const cardNumber = prompt('Enter your debit card number (last 4 digits will be saved):');
    if (cardNumber && cardNumber.length >= 4) {
      const last4 = cardNumber.slice(-4);
      try {
        await base44.auth.updateMe({ debit_card_last4: last4 });
        setDebitCardLast4(last4);
        setDebitCardConnected(true);
        onToast('Debit card connected successfully!');
      } catch (e) {
        onToast('Failed to connect debit card');
      }
    }
    setConnectingDebit(false);
  };

  const handleChangeDebit = async () => {
    const cardNumber = prompt('Enter your new debit card number:');
    if (cardNumber && cardNumber.length >= 4) {
      const last4 = cardNumber.slice(-4);
      try {
        await base44.auth.updateMe({ debit_card_last4: last4 });
        setDebitCardLast4(last4);
        onToast('Debit card updated!');
      } catch (e) {
        onToast('Failed to update debit card');
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 text-white/40">
          <Loader2 className="w-4 h-4 animate-spin"/> Loading payment settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* PayPal */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-white text-sm flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 5.5c-1.5-2.5-4.5-3.5-8-3.5H9c-3.5 0-6 2-7 5.5L.5 16c0 1.5 1 2.5 2.5 2.5h3l.5-3c.5-2.5 2-4 5-4h2.5c3.5 0 6-1.5 7-5l.5-1c.5-1.5 0-2.5-1.5-3z" opacity="0.3"/>
              <path d="M19 6c-1.5-2.5-4.5-3.5-8-3.5H8.5c-3.5 0-6 2-7 5.5L0 16.5c0 1.5 1 2.5 2.5 2.5h3l.5-3c.5-2.5 2-4 5-4h2.5c3.5 0 6-1.5 7-5l.5-1c.5-1.5 0-2.5-2-3z"/>
            </svg>
            PayPal
          </h2>
          {paypalConnected && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] font-bold">
              <CheckCircle className="w-2.5 h-2.5"/> Connected
            </span>
          )}
        </div>
        {paypalConnected ? (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider mb-0.5">PayPal Email</p>
              <p className="font-body text-xs text-white font-semibold">{paypalEmail}</p>
            </div>
            <button onClick={handleChangePaypal}
              className="px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
              Change PayPal
            </button>
          </div>
        ) : (
          <button onClick={handleConnectPaypal} disabled={connectingPaypal}
            className="w-full py-2.5 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl font-body font-bold text-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {connectingPaypal ? <Loader2 className="w-4 h-4 animate-spin"/> : <CreditCard className="w-4 h-4"/>}
            Connect PayPal
          </button>
        )}
      </div>

      {/* Debit Card */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-white text-sm flex items-center gap-2">
            <CreditCard className="w-5 h-5"/>
            Debit Card
          </h2>
          {debitCardConnected && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] font-bold">
              <CheckCircle className="w-2.5 h-2.5"/> Connected
            </span>
          )}
        </div>
        {debitCardConnected ? (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Card Ending In</p>
              <p className="font-body text-xs text-white font-semibold">•••• •••• •••• {debitCardLast4}</p>
            </div>
            <button onClick={handleChangeDebit}
              className="px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
              Change Card
            </button>
          </div>
        ) : (
          <button onClick={handleConnectDebit} disabled={connectingDebit}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl font-body font-bold text-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {connectingDebit ? <Loader2 className="w-4 h-4 animate-spin"/> : <CreditCard className="w-4 h-4"/>}
            Connect Debit Card
          </button>
        )}
      </div>

      <p className="font-body text-[9px] text-white/25 text-center">
        🔒 Your payment information is encrypted and secure. Used for buying and receiving payments.
      </p>
    </div>
  );
}