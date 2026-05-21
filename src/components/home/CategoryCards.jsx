import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: 'Travel', href: '/travel', icon: '✈️', desc: 'Hotels, Tours & Transport', color: 'from-blue-500 to-cyan-400' },
  { label: 'Food', href: '/food', icon: '🍽️', desc: 'Restaurants, Cafes & Home Cooks', color: 'from-orange-500 to-yellow-400' },
  { label: 'Buy & Sell', href: '/buysell', icon: '🛍️', desc: 'Shoes, Cars, Gadgets & More', color: 'from-purple-500 to-pink-400' },
  { label: 'For Rent', href: '/rent', icon: '🏠', desc: 'Homes, Vehicles & Equipment', color: 'from-green-500 to-teal-400' },
  { label: 'Services', href: '/services', icon: '🛠️', desc: 'Plumbers, Tutors & Freelancers', color: 'from-red-500 to-rose-400' },
];

export default function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">Explore 1Market</span>
        <h2 className="font-heading font-bold text-3xl text-[#0A192F] mt-1">Browse by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <Link to={cat.href} className="block group">
              <div className={`relative rounded-2xl bg-gradient-to-br ${cat.color} p-6 text-white text-center shadow-md hover:shadow-xl transition-shadow duration-300`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <p className="font-heading font-bold text-base leading-tight">{cat.label}</p>
                <p className="font-body text-xs mt-1 text-white/80">{cat.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}