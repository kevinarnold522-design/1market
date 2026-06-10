import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Zap, Home, Heart, Briefcase, GraduationCap, Scale, Plane, UtensilsCrossed, ShoppingBag, KeyRound, ArrowRight } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { icon: Home, label: 'Home Services', desc: 'Cleaning, repairs, plumbing', color: '#3E97F1', href: '/services?sub=home' },
  { icon: Zap, label: 'Tech & Digital', desc: 'IT, web, design, repair', color: '#8b5cf6', href: '/services?sub=tech' },
  { icon: Heart, label: 'Beauty & Wellness', desc: 'Salon, spa, massage, nails', color: '#f472b6', href: '/services?sub=beauty' },
  { icon: UtensilsCrossed, label: 'Events & Catering', desc: 'Planning, catering, DJ', color: '#f97316', href: '/services?sub=events' },
  { icon: Briefcase, label: 'Professional', desc: 'Legal, financial, HR', color: '#10b981', href: '/services?sub=professional' },
  { icon: GraduationCap, label: 'Education & Tutoring', desc: 'Tutors, coaching, training', color: '#f59e0b', href: '/services?sub=education' },
  { icon: Scale, label: 'Legal Services', desc: 'Lawyers, notary, contracts', color: '#6366f1', href: '/services?sub=legal' },
  { icon: Plane, label: 'Transport & Delivery', desc: 'Movers, courier, trucking', color: '#22d3ee', href: '/services?sub=transport' },
];

export default function ServicesDashboard() {
  return (
    <section className="py-16 px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Services</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3">
            ALL-IN-ONE STOP SHOP
          </h2>
          <p className="font-body text-base text-white/50 max-w-2xl mx-auto">
            Find trusted service providers across Manila and Cavite. From home repairs to professional consulting.
          </p>
          <Link to="/services" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
            Browse All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={cat.href}
                className="group block p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${cat.color}22` }}>
                    <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-white text-sm leading-tight">{cat.label}</h3>
                    <p className="font-body text-[10px] text-white/40 truncate">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-body font-semibold" style={{ color: cat.color }}>
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <h3 className="font-heading font-bold text-xl text-white mb-2">Offer Your Services Here</h3>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">
            List your services for free and get discovered by thousands of customers across Manila and Cavite.
          </p>
          <Link to="/onboarding" className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors inline-block">
            Sign Up Free & List Your Service
          </Link>
        </motion.div>
      </div>
    </section>
  );
}