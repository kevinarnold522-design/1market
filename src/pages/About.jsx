import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Heart, Users, ShoppingBag, Home, Briefcase, Star } from 'lucide-react';
import Navbar from '../components/home/Navbar';

const MILESTONES = [
  { year: '2026', title: 'Founded', desc: 'Kevin Roberto launches 1Marketph.com in Manila with a vision to unite Filipino buyers, sellers, and businesses under one platform.' },
  { year: '2026', title: 'Buy & Sell Marketplace', desc: 'The first feature — a marketplace for shoes, cars, houses, electronics, and services — goes live for Manila and Cavite.' },
  { year: '2026', title: 'Travel & Food', desc: 'Hotel bookings, flight deals, and local food businesses are added, connecting Filipinos to their next adventure and meal.' },
  { year: '2026', title: 'Nationwide Expansion', desc: 'Listings expand to cover all regions across the Philippines — from Batanes to Tawi-Tawi.' },
];

const VALUES = [
  { icon: '🇵🇭', title: 'Proudly Filipino', desc: 'Built for Filipinos, by a Filipino. Every feature is designed with the local community in mind.' },
  { icon: '🤝', title: 'Community First', desc: 'We connect people — buyers and sellers, travelers and hosts, customers and local businesses.' },
  { icon: '🔒', title: 'Trust & Safety', desc: 'We verify partners and protect user data under the Philippine Data Privacy Act (RA 10173).' },
  { icon: '🌱', title: 'Growth Together', desc: 'When local businesses thrive, communities grow. We empower every Filipino entrepreneur.' },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      <Navbar />
      <div className="pt-28">
        {/* Hero */}
        <div className="relative overflow-hidden py-20 px-6" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.85),rgba(0,13,64,0.9))' }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-body text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Our Story</span>
              </div>
              <h1 className="font-heading font-bold text-4xl sm:text-6xl text-white mb-6 leading-tight">
                Building Dreams<br /><span className="text-[#00D4FF]">Under 1Vision,<br />Together.</span>
              </h1>
              <p className="font-body text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
                Founded in 2026 by Kevin Roberto, 1Market was born from a simple vision: to bridge the gap between Filipino consumers and businesses that power our communities. Proudly Filipino, built for Filipinos — because when we connect, we grow together.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-8 sm:p-10 mb-16"
            style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.3),rgba(0,26,128,0.4))', border: '1px solid rgba(0,212,255,0.2)' }}>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                <span className="font-heading font-bold text-white text-2xl">KR</span>
              </div>
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF] mb-1">Founder & CEO</p>
                <h2 className="font-heading font-bold text-2xl text-white mb-2">Kevin W. Roberto</h2>
                <p className="font-body text-sm text-white/60 leading-relaxed">
                  Kevin founded 1Marketph.com in 2026 with a mission to bridge the gap between Filipino consumers and the businesses that power our communities. With a passion for technology and a deep love for the Philippines, he envisioned a platform where local commerce thrives, real connections happen, and every Filipino has access to a world-class marketplace. 1Market is his answer to the question: "What if everything Filipinos need was in one place?"
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Nationwide Vision','Buy & Sell','For Rent','Travel','Food','Jobs'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-bold font-body"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#a5f3fc' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-2xl text-white mb-8 text-center">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(0,51,204,0.2)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-heading font-bold text-white mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-white/50 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-2xl text-white mb-8 text-center">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'rgba(0,212,255,0.2)' }} />
              <div className="space-y-8">
                {MILESTONES.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="relative flex gap-6 pl-16">
                    <div className="absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold font-heading text-white"
                      style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                      {m.year}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white mb-1">{m.title}</h3>
                      <p className="font-body text-sm text-white/50 leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Categories', value: '8+', icon: <ShoppingBag className="w-5 h-5" /> },
              { label: 'PH Locations', value: '100+', icon: <Globe className="w-5 h-5" /> },
              { label: 'Partners', value: 'Growing', icon: <Users className="w-5 h-5" /> },
              { label: 'Launched', value: '2026', icon: <Star className="w-5 h-5" /> },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5 text-center"
                style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.3),rgba(0,26,128,0.4))', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="text-[#00D4FF] flex justify-center mb-2">{s.icon}</div>
                <p className="font-heading font-bold text-xl text-white">{s.value}</p>
                <p className="font-body text-xs text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-body font-bold text-[#0A192F] transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
              <Home className="w-4 h-4" /> Back to 1Marketph.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}