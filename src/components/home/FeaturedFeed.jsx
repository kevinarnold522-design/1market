import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, Tag } from 'lucide-react';

export default function FeaturedFeed({ images }) {
  const scrollRef = useRef(null);

  const items = [
    {
      title: 'Boracay Sunset Resort',
      category: 'Travel',
      tag: 'Top Rated',
      price: '₱3,500/night',
      icon: MapPin,
    },
    {
      title: "Kuya's Kitchen",
      category: 'Food',
      tag: 'Local Favorite',
      price: 'From ₱120',
      icon: Star,
    },
    {
      title: 'Premium Wireless Set',
      category: 'Buy & Sell',
      tag: 'Best Seller',
      price: '₱2,899',
      icon: Tag,
    },
    {
      title: 'Manila to Cebu',
      category: 'Travel',
      tag: 'Hot Deal',
      price: '₱1,200',
      icon: MapPin,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#F8FAFC]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="h-[1px] w-12 bg-[#00D4FF]" />
              <span className="font-body text-xs font-medium tracking-[0.2em] uppercase text-[#0A192F]/40">
                Featured Now
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading font-bold text-3xl sm:text-4xl text-[#0A192F]"
            >
              Trending on 1Market
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden sm:flex items-center gap-2 text-[#0A192F]/40 font-body text-sm"
          >
            <span>Scroll</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scroll — 3.5 cards visible */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-6"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] group cursor-pointer"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm shadow-[#0A192F]/5 border border-[#0A192F]/5 hover:shadow-lg hover:shadow-[#0A192F]/10 transition-all duration-300">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={images[i % images.length]}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-body font-semibold tracking-wide uppercase text-[#0A192F]">
                    <item.icon className="w-3 h-3 text-[#2563EB]" />
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#2563EB] font-semibold">
                  {item.category}
                </p>
                <h3 className="font-heading font-semibold text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body text-sm font-bold text-[#0A192F]">
                    {item.price}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#0A192F]/5 flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-[#0A192F]/40 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}