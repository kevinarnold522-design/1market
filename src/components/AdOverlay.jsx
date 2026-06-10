import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Ad content pool - royal blue themed
const AD_POOL = [
  {
    title: 'Flash Sale Alert!',
    subtitle: 'Up to 70% OFF on Electronics',
    cta: 'Shop Now',
    gradient: 'linear-gradient(135deg,#0033CC,#001a80)',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop',
  },
  {
    title: 'Travel Deals',
    subtitle: 'Hotels & Flights at Best Prices',
    cta: 'Explore',
    gradient: 'linear-gradient(135deg,#0033CC,#000d40)',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop',
  },
  {
    title: 'Food Delivery',
    subtitle: 'Local Restaurants Near You',
    cta: 'Order Now',
    gradient: 'linear-gradient(135deg,#0033CC,#001a80)',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
  },
  {
    title: 'New Listings Daily',
    subtitle: 'Buy, Sell & Connect',
    cta: 'Browse',
    gradient: 'linear-gradient(135deg,#001a80,#000d40)',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    title: 'Sell with Us',
    subtitle: 'List Your Products for Free',
    cta: 'Get Started',
    gradient: 'linear-gradient(135deg,#0033CC,#001a80)',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop',
  },
  {
    title: 'Premium Services',
    subtitle: 'Trusted Professionals in Manila & Cavite',
    cta: 'View Services',
    gradient: 'linear-gradient(135deg,#001a80,#000d40)',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
  },
];

export default function AdOverlay() {
  const [showAd, setShowAd] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    base44.auth.me().then(user => {
      setIsAdmin(user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com'.toLowerCase());
    }).catch(() => {});

    // Show ad after 2 minutes (120000ms)
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 120000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closeAd = () => {
    setShowAd(false);
  };

  if (!showAd || isAdmin === null) return null;

  const currentAd = AD_POOL[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" />
        
        {/* Ad Container - HTML Ad Code */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: currentAd.gradient }}
          >
            {/* Close button */}
            <button
              onClick={closeAd}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* HTML Ad Content */}
            <div className="flex flex-col md:flex-row">
              {/* Image side */}
              <div className="md:w-1/2 h-48 md:h-auto relative">
                <img
                  src={currentAd.image}
                  alt={currentAd.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              </div>

              {/* Text side */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-white">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                  {currentAd.title}
                </h2>
                <p className="font-body text-sm md:text-base text-white/90 mb-6">
                  {currentAd.subtitle}
                </p>
                <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-body font-bold text-sm hover:bg-white/90 transition-colors self-start">
                  {currentAd.cta}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}