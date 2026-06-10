import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Zap, Home, Heart, Briefcase, GraduationCap, Scale, Plane, UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { icon: Home, label: 'Home Services', desc: 'Cleaning, repairs, plumbing', color: '#3E97F1', href: '/services?sub=home' },
  { icon: Zap, label: 'Tech & Digital', desc: 'IT, web, design, repair', color: '#8b5cf6', href: '/services?sub=tech' },
  { icon: Heart, label: 'Beauty & Wellness', desc: 'Salon, spa, massage', color: '#f472b6', href: '/services?sub=beauty' },
  { icon: UtensilsCrossed, label: 'Events & Catering', desc: 'Planning, catering, DJ', color: '#f97316', href: '/services?sub=events' },
  { icon: Briefcase, label: 'Professional', desc: 'Legal, financial, HR', color: '#10b981', href: '/services?sub=professional' },
  { icon: GraduationCap, label: 'Education', desc: 'Tutors, coaching, training', color: '#f59e0b', href: '/services?sub=education' },
  { icon: Scale, label: 'Legal Services', desc: 'Lawyers, notary, contracts', color: '#6366f1', href: '/services?sub=legal' },
  { icon: Plane, label: 'Transport', desc: 'Movers, courier, trucking', color: '#22d3ee', href: '/services?sub=transport' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 0.6
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(0,212,255,0.2)',
    transition: { duration: 0.3 }
  }
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export default function ServicesDashboard() {
  return (
    <section className="py-20 px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 50%, #000d40 100%)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#00D4FF]/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 5 }}
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs tracking-[0.3em] uppercase text-[#00D4FF] font-bold">Services</span>
            <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          </motion.div>
          
          <motion.h2 
            className="font-heading font-bold text-4xl sm:text-5xl text-white mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ALL-IN-ONE STOP SHOP
          </motion.h2>
          
          <motion.p 
            className="font-body text-lg text-white/60 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Find trusted service providers across Manila and Cavite. From home repairs to professional consulting.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg,#00D4FF,#2563EB)',
                boxShadow: '0 0 30px rgba(0,212,255,0.4)'
              }}
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Browse All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Service Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.label}
              variants={cardVariants}
              whileHover="hover"
              className="relative"
            >
              <Link
                to={cat.href}
                className="group block p-6 rounded-3xl transition-all duration-500 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}15 0%, transparent 100%)`
                  }}
                />
                
                {/* Icon with glow effect */}
                <motion.div 
                  className="relative mb-4"
                  animate={{ 
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                      boxShadow: `0 0 20px ${cat.color}33`
                    }}
                  >
                    <cat.icon className="w-7 h-7 transition-all duration-500 group-hover:scale-110" style={{ color: cat.color }} />
                  </div>
                  {/* Pulsing glow behind icon */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{ 
                      boxShadow: [
                        `0 0 20px ${cat.color}33`,
                        `0 0 40px ${cat.color}55`,
                        `0 0 20px ${cat.color}33`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>

                {/* Text content */}
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-white text-lg leading-tight mb-2 group-hover:text-[#00D4FF] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="font-body text-xs text-white/50 mb-4">{cat.desc}</p>
                  
                  {/* Animated arrow */}
                  <div className="flex items-center gap-2 text-xs font-body font-semibold" style={{ color: cat.color }}>
                    <span className="group-hover:underline">Explore</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>

                {/* Corner accent */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${cat.color}22, transparent 70%)`
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA with floating animation */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(37,99,235,0.1) 100%)',
            border: '1.5px solid rgba(0,212,255,0.3)',
            boxShadow: '0 0 40px rgba(0,212,255,0.2)'
          }}
        >
          {/* Animated background shimmer */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.1) 50%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.15) 50%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.1) 50%, transparent 100%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          <div className="relative z-10">
            <motion.h3 
              className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Offer Your Services Here
            </motion.h3>
            <p className="font-body text-sm text-white/60 mb-8 max-w-lg mx-auto">
              List your services for free and get discovered by thousands of customers across Manila and Cavite.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/onboarding" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-2xl hover:bg-white transition-all shadow-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(0,212,255,0.4)'
                }}
              >
                <Sparkles className="w-5 h-5" />
                Sign Up Free & List Your Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}