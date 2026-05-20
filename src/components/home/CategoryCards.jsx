import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plane, UtensilsCrossed, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'travel',
    title: 'Travel',
    subtitle: 'Hotels · Flights · Vehicles',
    description: 'Book hotels, find flights, and rent vehicles across Manila, Cavite and beyond.',
    icon: Plane,
    href: '/travel',
    gradient: 'from-[#0A192F] to-[#1E3A5F]',
  },
  {
    id: 'food',
    title: 'Food',
    subtitle: 'Restaurants & Local Eats',
    description: 'Discover carinderias, restaurants, and home kitchens serving the best food near you.',
    icon: UtensilsCrossed,
    href: '/food',
    gradient: 'from-[#1E3A5F] to-[#2563EB]',
  },
  {
    id: 'buysell',
    title: 'Buy & Sell',
    subtitle: 'Products & Listings',
    description: 'Browse shoes, cars, houses, and services — buy what you need, sell what you don\'t.',
    icon: ShoppingBag,
    href: '/buysell',
    gradient: 'from-[#2563EB] to-[#00D4FF]',
  },
];

function TiltCard({ cat, image, index, navigate }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 10, y: dx * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => navigate(cat.href)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: hovered ? 1.03 : 1,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
        minHeight: '380px',
      }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 shadow-md hover:shadow-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={cat.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-75 group-hover:opacity-85 transition-opacity duration-500`} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8" style={{ minHeight: '380px' }}>
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <cat.icon className="w-5 h-5 text-white" />
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <p className="font-body text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#00D4FF]">
            {cat.subtitle}
          </p>
          <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
            {cat.title}
          </h3>
          <p className="font-body text-xs sm:text-sm text-white/60 leading-relaxed max-w-xs">
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
    </motion.div>
  );
}

export default function CategoryCards({ images }) {
  const navigate = useNavigate();

  return (
    <section id="categories" className="relative py-16 sm:py-24 lg:py-32">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
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
          className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-[#0A192F] mt-4"
        >
          Choose Your Path
        </motion.h2>
      </div>

      {/* Cards — stacked on mobile, 3-col on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" style={{ perspective: '1200px' }}>
          {categories.map((cat, i) => (
            <TiltCard key={cat.id} cat={cat} image={images[i]} index={i} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}