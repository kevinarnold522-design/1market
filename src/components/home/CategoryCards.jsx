import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, UtensilsCrossed, ShoppingBag, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Hotels & Flights',
    description: 'Book your perfect getaway — from luxury hotels to the best flight deals.',
    icon: Plane,
    href: '#travel',
    gradient: 'from-[#0A192F] to-[#1E3A5F]',
  },
  {
    id: 'food',
    title: 'Food',
    subtitle: 'Restaurants & Local Eats',
    description: 'Discover restaurants and small businesses serving the best food near you.',
    icon: UtensilsCrossed,
    href: '#food',
    gradient: 'from-[#1E3A5F] to-[#2563EB]',
  },
  {
    id: 'buysell',
    title: 'Buy & Sell',
    subtitle: 'Products & Listings',
    description: 'Browse all products and listings — buy what you need, sell what you don\'t.',
    icon: ShoppingBag,
    href: '#buysell',
    gradient: 'from-[#2563EB] to-[#00D4FF]',
  },
];

export default function CategoryCards({ images }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="categories" className="relative py-24 lg:py-32">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-[1px] w-12 bg-[#00D4FF]" />
          <span className="font-body text-xs font-medium tracking-[0.2em] uppercase text-[#0A192F]/40">
            The Switchboard
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0A192F] mt-4"
        >
          Choose Your Path
        </motion.h2>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={cat.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                hovered && hovered !== cat.id ? 'md:scale-[0.97] opacity-80' : ''
              } ${hovered === cat.id ? 'md:scale-[1.02]' : ''}`}
              style={{ minHeight: '420px' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={images[i]}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-75 group-hover:opacity-85 transition-opacity duration-500`} />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-[#00D4FF]">
                    {cat.subtitle}
                  </p>
                  <h3 className="font-heading font-bold text-3xl lg:text-4xl text-white">
                    {cat.title}
                  </h3>
                  <p className="font-body text-sm text-white/60 leading-relaxed max-w-xs">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="font-body text-xs font-medium text-white/80 group-hover:text-[#00D4FF] transition-colors">
                      Explore
                    </span>
                    <div className="h-[1px] w-6 bg-white/30 group-hover:w-10 group-hover:bg-[#00D4FF] transition-all duration-300" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}