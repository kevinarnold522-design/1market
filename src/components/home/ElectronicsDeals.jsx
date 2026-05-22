import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Zap, Smartphone, Laptop, Headphones } from 'lucide-react';

const ELECTRONICS = [
  { id: 1, brand: 'Samsung', name: 'Galaxy S24 Ultra', category: 'Phone', price: 74999, originalPrice: 89999, discount: 17, rating: 4.9, badge: '🔥 Flagship', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/220px-Samsung_Logo.svg.png', link: 'https://www.samsung.com/ph/', platform: 'Samsung PH', color: 'from-blue-700 to-blue-900' },
  { id: 2, brand: 'Apple', name: 'iPhone 16 Pro Max', category: 'Phone', price: 89999, originalPrice: 99000, discount: 9, rating: 4.9, badge: '🍎 New', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/220px-Apple_logo_black.svg.png', link: 'https://www.apple.com/ph/iphone/', platform: 'Apple PH', color: 'from-gray-700 to-gray-900' },
  { id: 3, brand: 'Xiaomi', name: 'Redmi Note 13 Pro', category: 'Phone', price: 12999, originalPrice: 17999, discount: 28, rating: 4.7, badge: '⚡ Budget King', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/220px-Xiaomi_logo.svg.png', link: 'https://www.mi.com/ph/', platform: 'Xiaomi PH', color: 'from-orange-600 to-red-700' },
  { id: 4, brand: 'ASUS', name: 'VivoBook 15 OLED', category: 'Laptop', price: 34999, originalPrice: 44999, discount: 22, rating: 4.8, badge: '💻 Best Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/220px-ASUS_Logo.svg.png', link: 'https://www.asus.com/ph/', platform: 'ASUS PH', color: 'from-indigo-600 to-indigo-900' },
  { id: 5, brand: 'Sony', name: 'WH-1000XM5 ANC', category: 'Audio', price: 15999, originalPrice: 21990, discount: 27, rating: 4.9, badge: '🎧 Top Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/220px-Sony_logo.svg.png', link: 'https://www.sony.com.ph/', platform: 'Sony PH', color: 'from-slate-600 to-slate-900' },
  { id: 6, brand: 'Oppo', name: 'Reno 12 F 5G', category: 'Phone', price: 11499, originalPrice: 15999, discount: 28, rating: 4.6, badge: '📸 Camera Pro', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/OPPO_LOGO_2019.svg/220px-OPPO_LOGO_2019.svg.png', link: 'https://www.oppo.com/ph/', platform: 'OPPO PH', color: 'from-green-600 to-emerald-800' },
  { id: 7, brand: 'Apple', name: 'iPad Air M2 11"', category: 'Tablet', price: 44999, originalPrice: 55990, discount: 20, rating: 4.9, badge: '🍎 Apple Deal', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/220px-Apple_logo_black.svg.png', link: 'https://www.apple.com/ph/shop/buy-ipad', platform: 'Apple PH', color: 'from-zinc-600 to-zinc-900' },
  { id: 8, brand: 'JBL', name: 'Charge 5 BT Speaker', category: 'Audio', price: 5999, originalPrice: 8990, discount: 33, rating: 4.8, badge: '🔊 Bestseller', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/JBL_logo.svg/220px-JBL_logo.svg.png', link: 'https://ph.jbl.com/', platform: 'JBL PH', color: 'from-orange-500 to-orange-800' },
  { id: 9, brand: 'Huawei', name: 'MatePad 11.5 WiFi', category: 'Tablet', price: 19999, originalPrice: 25999, discount: 23, rating: 4.6, badge: '📱 Tab Deal', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/220px-Huawei_Logo.svg.png', link: 'https://consumer.huawei.com/ph/', platform: 'Huawei PH', color: 'from-red-600 to-rose-800' },
  { id: 10, brand: 'Lenovo', name: 'IdeaPad Slim 5 Gen 9', category: 'Laptop', price: 39999, originalPrice: 49999, discount: 20, rating: 4.7, badge: '💼 Work Pro', image: 'https://images.unsplash.com/photo-1587890049668-2c234e35cfba?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/220px-Lenovo_logo_2015.svg.png', link: 'https://www.lenovo.com/ph/en/', platform: 'Lenovo PH', color: 'from-red-700 to-red-900' },
];

const CATS = ['All', 'Phone', 'Laptop', 'Audio', 'Tablet'];

function ElectronicsCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex-shrink-0"
      style={{ width: '260px' }}
      onClick={() => window.open(item.link, '_blank')}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`} />
        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full font-body font-black text-xs">
          -{item.discount}%
        </div>
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-body font-bold text-[10px]">
          {item.platform}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 font-body text-[10px] font-bold text-[#0A192F]">
          {item.badge}
        </div>
        {/* Brand logo */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden p-1">
          <img src={item.logo} alt={item.brand} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
        </div>
      </div>
      <div className="p-4">
        <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-0.5">{item.category} · {item.brand}</p>
        <h3 className="font-heading font-bold text-sm text-[#0A192F] leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-body text-xs font-semibold text-[#0A192F]">{item.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-xs text-[#0A192F]/30 line-through">₱{item.originalPrice.toLocaleString()}</span>
            <p className="font-heading font-bold text-base text-[#0A192F]">₱{item.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[#2563EB] text-xs font-body font-semibold group-hover:underline">
            <span>Shop</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ElectronicsDeals() {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let dir = 1;
    const scroll = setInterval(() => {
      if (!el || isPaused) return;
      el.scrollLeft += dir * 1.0;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) dir = -1;
      if (el.scrollLeft <= 10) dir = 1;
    }, 30);
    return () => clearInterval(scroll);
  }, [isPaused]);

  const filtered = activeCategory === 'All' ? ELECTRONICS : ELECTRONICS.filter(e => e.category === activeCategory);

  return (
    <section className="py-12 sm:py-16 bg-[#0A192F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00D4FF]/10 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#00D4FF]"
                />
                <Smartphone className="w-3 h-3 text-[#00D4FF]" />
                <span className="font-body text-xs font-bold text-[#00D4FF] uppercase tracking-wider">Electronics & Phones</span>
              </div>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Top Tech Deals in the Philippines
            </h2>
            <p className="font-body text-sm text-white/40 mt-1">
              Samsung, Apple, Xiaomi, ASUS, Sony & more — official brand stores
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Samsung', 'Apple', 'Sony', 'ASUS'].map(b => (
              <div key={b} className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                <span className="font-body text-xs text-white/60">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-semibold text-xs transition-all ${activeCategory === cat ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/10 border border-white/10 text-white/60 hover:bg-white/20'}`}>
              {cat === 'Phone' && <Smartphone className="w-3 h-3" />}
              {cat === 'Laptop' && <Laptop className="w-3 h-3" />}
              {cat === 'Audio' && <Headphones className="w-3 h-3" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Scrolling cards */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <AnimatePresence mode="popLayout">
            {filtered.map(item => <ElectronicsCard key={item.id} item={item} />)}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center gap-2 justify-center">
          <Zap className="w-4 h-4 text-[#00D4FF]" />
          <p className="font-body text-xs text-white/30">Click any card to visit the official brand store or retailer.</p>
        </div>
      </div>
    </section>
  );
}