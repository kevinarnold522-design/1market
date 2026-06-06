import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Megaphone, Phone, DollarSign, Search, Star, MessageCircle, PartyPopper, ShoppingCart, Store } from 'lucide-react';

const BUSINESS_STEPS = [
  { Icon: ClipboardList, step: 'Step 1', title: 'Create Your Listing', desc: 'Sign up free and post your business, products, or services in minutes. Add photos, pricing, and contact info.' },
  { Icon: Megaphone, step: 'Step 2', title: 'Get Discovered', desc: '1Market promotes your listing to buyers across Manila & Cavite. Your business appears in search and category feeds.' },
  { Icon: Phone, step: 'Step 3', title: 'Connect with Buyers', desc: 'Buyers contact you directly via call, SMS, or 1Market chat. No middleman. No commission fees.' },
  { Icon: DollarSign, step: 'Step 4', title: 'Close the Deal', desc: 'Confirm the sale or service, collect payment your way, and earn your first 1Market review from a happy customer.' },
];

const CUSTOMER_STEPS = [
  { Icon: Search, step: 'Step 1', title: 'Search & Discover', desc: 'Browse food, travel, products, rentals, and services near you. Filter by Manila or Cavite location.' },
  { Icon: Star, step: 'Step 2', title: 'Compare & Rate', desc: 'Read community ratings and reviews. Compare options from local businesses and home-based sellers.' },
  { Icon: MessageCircle, step: 'Step 3', title: 'Contact the Seller', desc: 'Reach out directly via call or message. View the business bio and get all the details you need.' },
  { Icon: PartyPopper, step: 'Step 4', title: 'Enjoy & Review', desc: 'Receive your order or service, enjoy the experience, and leave a review to help the community.' },
];

function StepsFlow({ steps, color }) {
  return (
    <div className="relative">
      <div className="absolute top-10 left-0 right-0 hidden sm:block" style={{ height: '2px', background: `linear-gradient(to right, ${color}33, ${color}99, ${color}33)` }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 relative z-10">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center shadow-md mb-3"
              style={{ borderColor: color, background: 'rgba(255,255,255,0.06)' }}
            >
              <s.Icon className="w-7 h-7 sm:w-9 sm:h-9" style={{ color }} />
            </motion.div>
            <span className="font-body text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{s.step}</span>
            <p className="font-heading font-bold text-xs text-white mb-1 leading-tight">{s.title}</p>
            <p className="font-body text-[10px] text-white/40 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-14 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640 0%,#0040D0 50%,#011640 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">How It Works</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">Two Journeys. One Market.</h2>
        </motion.div>

        {/* Customer journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <ShoppingCart className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <p className="font-heading font-bold text-base text-white">For Customers</p>
              <p className="font-body text-xs text-white/40">Your journey from discovery to done</p>
            </div>
          </div>
          <StepsFlow steps={CUSTOMER_STEPS} color="#00D4FF" />
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

        {/* Business journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
              <Store className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="font-heading font-bold text-base text-white">For Business Owners</p>
              <p className="font-body text-xs text-white/40">From listing to your first sale</p>
            </div>
          </div>
          <StepsFlow steps={BUSINESS_STEPS} color="#2563EB" />
        </motion.div>
      </div>
    </section>
  );
}