import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, CheckCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 text-center"
          style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(37,99,235,0.2))', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Bell className="w-7 h-7 text-[#00D4FF]" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-2">Get the Best Deals First</h3>
          <p className="font-body text-sm text-white/50 mb-6">Subscribe to our newsletter and be the first to know about flash sales, new listings, and exclusive offers.</p>

          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-body font-semibold">You're subscribed! Welcome to the community AI</span>
            </motion.div>
          ) : (
            <form onSubmit={handle} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-white placeholder-white/25 font-body text-sm focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,212,255,0.2)' }}
                />
              </div>
              <button type="submit" disabled={loading}
                className="px-6 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          <p className="font-body text-[10px] text-white/25 mt-3">No spam ever. Unsubscribe anytime. 🇵🇭</p>
        </motion.div>
      </div>
    </section>
  );
}