import React from 'react';
import { motion } from 'framer-motion';

const BUSINESS_STEPS = [
  { icon: '📋', step: 'Step 1', title: 'Create Your Listing', desc: 'Sign up free and post your business, products, or services in minutes. Add photos, pricing, and contact info.' },
  { icon: '📣', step: 'Step 2', title: 'Get Discovered', desc: '1Market promotes your listing to buyers across Manila & Cavite. Your business appears in search and category feeds.' },
  { icon: '📞', step: 'Step 3', title: 'Connect with Buyers', desc: 'Buyers contact you directly via call, SMS, or 1Market chat. No middleman. No commission fees.' },
  { icon: '💵', step: 'Step 4', title: 'Close the Deal', desc: 'Confirm the sale or service, collect payment your way, and earn your first 1Market review from a happy customer.' },
];

const CUSTOMER_STEPS = [
  { icon: '🔍', step: 'Step 1', title: 'Search & Discover', desc: 'Browse food, travel, products, rentals, and services near you. Filter by Manila or Cavite location.' },
  { icon: '⭐', step: 'Step 2', title: 'Compare & Rate', desc: 'Read community ratings and reviews. Compare options from local businesses and home-based sellers.' },
  { icon: '📲', step: 'Step 3', title: 'Contact the Seller', desc: 'Reach out directly via call or message. View the business bio and get all the details you need.' },
  { icon: '🎉', step: 'Step 4', title: 'Enjoy & Review', desc: 'Receive your order or service, enjoy the experience, and leave a review to help the community.' },
];

function StepsFlow({ steps, color }) {
  return (
    <div className="relative">
      {/* Connecting line */}
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 flex items-center justify-center text-3xl shadow-md mb-3"
              style={{ borderColor: color }}
            >
              {s.icon}
            </motion.div>
            <span className="font-body text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{s.step}</span>
            <p className="font-heading font-bold text-xs text-[#0A192F] mb-1 leading-tight">{s.title}</p>
            <p className="font-body text-[10px] text-[#0A192F]/50 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-14 bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">How It Works</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0A192F] mt-1">Two Journeys. One Market.</h2>
        </motion.div>

        {/* Customer journey FIRST (on top) */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: '#EFF6FF' }}>🛒</div>
            <div>
              <p className="font-heading font-bold text-base text-[#0A192F]">For Customers</p>
              <p className="font-body text-xs text-[#0A192F]/40">Your journey from discovery to done</p>
            </div>
          </div>
          <StepsFlow steps={CUSTOMER_STEPS} color="#00D4FF" />
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0A192F]/10 to-transparent my-10" />

        {/* Business journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F0FDF4' }}>🏪</div>
            <div>
              <p className="font-heading font-bold text-base text-[#0A192F]">For Business Owners</p>
              <p className="font-body text-xs text-[#0A192F]/40">From listing to your first sale</p>
            </div>
          </div>
          <StepsFlow steps={BUSINESS_STEPS} color="#2563EB" />
        </motion.div>
      </div>
    </section>
  );
}