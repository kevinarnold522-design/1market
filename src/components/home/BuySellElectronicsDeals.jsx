import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, ShoppingBag, X, MapPin, Phone } from 'lucide-react';

// Real Buy & Sell electronics/phones listings linked to real stores
const BUYSELL_ELECTRONICS = [
  {
    id: 1, brand: 'Samsung', name: 'Galaxy S24 Ultra 256GB', category: 'Phone', condition: 'Brand New',
    price: 74999, originalPrice: 89999, discount: 17, rating: 4.9, badge: '🔥 Flagship',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/220px-Samsung_Logo.svg.png',
    link: 'https://www.samsung.com/ph/smartphones/galaxy-s/', platform: 'Samsung PH',
    color: 'from-blue-700 to-blue-900', seller: 'Samsung Philippines', area: 'SM MOA, Pasay',
    phone: '+63 2 8888-7777', hours: 'Mon–Sun 10AM–9PM',
    bio: 'Samsung is a South Korean multinational conglomerate founded in 1969, now the world\'s largest smartphone manufacturer. The Galaxy S24 Ultra features a 200MP camera, Snapdragon 8 Gen 3, and titanium frame. Available at all Samsung Experience Stores nationwide.',
    founder: 'Lee Byung-chul', year_started: 1969,
  },
  {
    id: 2, brand: 'Apple', name: 'iPhone 16 Pro Max 256GB', category: 'Phone', condition: 'Brand New',
    price: 89999, originalPrice: 99000, discount: 9, rating: 4.9, badge: '🍎 New',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/220px-Apple_logo_black.svg.png',
    link: 'https://www.apple.com/ph/shop/', platform: 'Apple PH',
    color: 'from-gray-700 to-gray-900', seller: 'iStudio by Suyen', area: 'Greenbelt 5, Makati',
    phone: '+63 2 7902-4444', hours: 'Mon–Sun 10AM–10PM',
    bio: 'Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976. The iPhone 16 Pro Max features the A18 Pro chip, 48MP Fusion camera system with 5x optical zoom, and titanium design. Available at authorized resellers including iStudio and Switch across the Philippines.',
    founder: 'Steve Jobs, Steve Wozniak', year_started: 1976,
  },
  {
    id: 3, brand: 'Xiaomi', name: 'Redmi Note 13 Pro 5G', category: 'Phone', condition: 'Brand New',
    price: 12999, originalPrice: 17999, discount: 28, rating: 4.7, badge: '⚡ Budget King',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/220px-Xiaomi_logo.svg.png',
    link: 'https://www.mi.com/ph/', platform: 'Xiaomi PH',
    color: 'from-orange-600 to-red-700', seller: 'Mi Store Philippines', area: 'SM North EDSA, QC',
    phone: '+63 2 8441-2888', hours: 'Mon–Sun 10AM–9PM',
    bio: 'Xiaomi Corporation was founded in 2010 by Lei Jun in Beijing, China. Known for offering flagship-level specs at affordable prices, Xiaomi is one of the top-selling smartphone brands in Southeast Asia. The Redmi Note 13 Pro features a 200MP OIS camera and 67W turbo charging.',
    founder: 'Lei Jun', year_started: 2010,
  },
  {
    id: 4, brand: 'ASUS', name: 'VivoBook 15 OLED i5', category: 'Laptop', condition: 'Brand New',
    price: 34999, originalPrice: 44999, discount: 22, rating: 4.8, badge: '💻 Best Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/220px-ASUS_Logo.svg.png',
    link: 'https://www.asus.com/ph/', platform: 'ASUS PH',
    color: 'from-indigo-600 to-indigo-900', seller: 'ASUS Concept Store', area: 'Cyberzone, SM Megamall',
    phone: '+63 2 8441-2999', hours: 'Mon–Sun 10AM–9PM',
    bio: 'ASUS is a Taiwanese multinational computer hardware and electronics company founded in 1989. Headquartered in Taipei, ASUS is well known for its laptops, motherboards, and gaming gear. The VivoBook 15 OLED features a 2.8K OLED display, Intel Core i5, and a thin 17.9mm chassis.',
    founder: 'Ted Hsu, MT Liao, Wayne Hsieh, TH Tung', year_started: 1989,
  },
  {
    id: 5, brand: 'Sony', name: 'WH-1000XM5 Headphones', category: 'Audio', condition: 'Brand New',
    price: 15999, originalPrice: 21990, discount: 27, rating: 4.9, badge: '🎧 Top Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/220px-Sony_logo.svg.png',
    link: 'https://www.sony.com.ph/', platform: 'Sony PH',
    color: 'from-slate-600 to-slate-900', seller: 'Sony Store Philippines', area: 'Glorietta 4, Makati',
    phone: '+63 2 8817-5455', hours: 'Mon–Sun 10AM–10PM',
    bio: 'Sony Corporation is a Japanese multinational conglomerate founded in 1946 by Masaru Ibuka and Akio Morita in Tokyo. The WH-1000XM5 features industry-leading noise cancellation with 8 microphones, 30-hour battery life, and multipoint Bluetooth connectivity — the benchmark of premium wireless audio.',
    founder: 'Masaru Ibuka, Akio Morita', year_started: 1946,
  },
  {
    id: 6, brand: 'OPPO', name: 'Reno 12 F 5G 256GB', category: 'Phone', condition: 'Brand New',
    price: 11499, originalPrice: 15999, discount: 28, rating: 4.6, badge: '📸 Camera Pro',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/OPPO_LOGO_2019.svg/220px-OPPO_LOGO_2019.svg.png',
    link: 'https://www.oppo.com/ph/', platform: 'OPPO PH',
    color: 'from-green-600 to-emerald-800', seller: 'OPPO Philippines', area: 'SM City Bacoor, Cavite',
    phone: '+63 2 8888-6766', hours: 'Mon–Sun 9AM–9PM',
    bio: 'OPPO is a Chinese consumer electronics manufacturer founded in 2004, headquartered in Dongguan. OPPO is one of the top-selling smartphone brands in Southeast Asia and the Philippines. The Reno 12 F 5G features a 50MP AI portrait camera, 5000mAh battery, and a sleek glass back design.',
    founder: 'Tony Chen', year_started: 2004,
  },
  {
    id: 7, brand: 'Apple', name: 'iPad Air M2 11-inch', category: 'Tablet', condition: 'Brand New',
    price: 44999, originalPrice: 55990, discount: 20, rating: 4.9, badge: '🍎 Apple Deal',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/220px-Apple_logo_black.svg.png',
    link: 'https://www.apple.com/ph/shop/buy-ipad', platform: 'Apple PH',
    color: 'from-zinc-600 to-zinc-900', seller: 'Switch by Syncom', area: 'Trinoma, QC',
    phone: '+63 2 8374-7474', hours: 'Mon–Sun 10AM–9PM',
    bio: 'The iPad Air M2 is powered by Apple\'s M2 chip, delivering desktop-class performance in a thin and light design. With a stunning Liquid Retina display, all-day battery life, and support for Apple Pencil Pro, it\'s the perfect creative and productivity companion.',
    founder: 'Steve Jobs, Steve Wozniak', year_started: 1976,
  },
  {
    id: 8, brand: 'JBL', name: 'Charge 5 Bluetooth Speaker', category: 'Audio', condition: 'Brand New',
    price: 5999, originalPrice: 8990, discount: 33, rating: 4.8, badge: '🔊 Bestseller',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/JBL_logo.svg/220px-JBL_logo.svg.png',
    link: 'https://ph.jbl.com/', platform: 'JBL PH',
    color: 'from-orange-500 to-orange-800', seller: 'JBL Philippines', area: 'Robinsons Galleria, QC',
    phone: '+63 2 8866-2888', hours: 'Mon–Sun 10AM–9PM',
    bio: 'JBL is an American audio equipment manufacturer founded in 1946 by James Bullough Lansing in California. The Charge 5 delivers big JBL Pro Sound via a racetrack-shaped driver, offers 20 hours of playtime, and can charge your devices via its built-in power bank. IP67 waterproof and dustproof.',
    founder: 'James Bullough Lansing', year_started: 1946,
  },
  {
    id: 9, brand: 'Lenovo', name: 'IdeaPad Slim 5 Gen 9', category: 'Laptop', condition: 'Brand New',
    price: 39999, originalPrice: 49999, discount: 20, rating: 4.7, badge: '💼 Work Pro',
    image: 'https://images.unsplash.com/photo-1587890049668-2c234e35cfba?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/220px-Lenovo_logo_2015.svg.png',
    link: 'https://www.lenovo.com/ph/en/', platform: 'Lenovo PH',
    color: 'from-red-700 to-red-900', seller: 'Lenovo Exclusive Store', area: 'SM City Dasmariñas, Cavite',
    phone: '+63 2 8636-3636', hours: 'Mon–Sun 10AM–9PM',
    bio: 'Lenovo Group Limited is a Chinese multinational technology company founded in 1984 by Liu Chuanzhi. It is the world\'s largest personal computer vendor. The IdeaPad Slim 5 Gen 9 features AMD Ryzen 7 8745H, 16GB RAM, and a 14" 2.8K OLED display — perfect for productivity and creative work.',
    founder: 'Liu Chuanzhi', year_started: 1984,
  },
  {
    id: 10, brand: 'Huawei', name: 'MatePad 11.5" WiFi', category: 'Tablet', condition: 'Brand New',
    price: 19999, originalPrice: 25999, discount: 23, rating: 4.6, badge: '📱 Tab Deal',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/220px-Huawei_Logo.svg.png',
    link: 'https://consumer.huawei.com/ph/', platform: 'Huawei PH',
    color: 'from-red-600 to-rose-800', seller: 'Huawei Experience Store', area: 'SM Mall of Asia, Pasay',
    phone: '+63 2 8859-7777', hours: 'Mon–Sun 10AM–9PM',
    bio: 'Huawei Technologies Co., Ltd. was founded in 1987 by Ren Zhengfei in Shenzhen, China. The MatePad 11.5 features a stunning 2.2K FullView display at 120Hz refresh rate, Kirin 9000WL chip, and supports the Huawei M-Pencil for a full creative tablet experience.',
    founder: 'Ren Zhengfei', year_started: 1987,
  },
  {
    id: 11, brand: 'Vivo', name: 'V30e 5G 128GB', category: 'Phone', condition: 'Brand New',
    price: 13999, originalPrice: 17999, discount: 22, rating: 4.5, badge: '✨ Portrait',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vivo_logo.png/220px-Vivo_logo.png',
    link: 'https://www.vivo.com/ph/', platform: 'Vivo PH',
    color: 'from-blue-500 to-purple-700', seller: 'Vivo Philippines', area: 'SM Bacoor, Cavite',
    phone: '+63 2 8855-4455', hours: 'Mon–Sun 9AM–9PM',
    bio: 'Vivo Communication Technology Co. Ltd. was founded in 2009 as a sub-brand of BBK Electronics. Known for its exceptional selfie cameras, Vivo has become one of the top smartphone brands in Southeast Asia. The V30e 5G features a 50MP Sony IMX882 portrait camera and a slim 7.36mm design.',
    founder: 'Shen Wei', year_started: 2009,
  },
  {
    id: 12, brand: 'Realme', name: 'C65 5G 128GB', category: 'Phone', condition: 'Brand New',
    price: 6999, originalPrice: 8999, discount: 22, rating: 4.4, badge: '💚 Entry Best',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Realme_logo.svg/220px-Realme_logo.svg.png',
    link: 'https://www.realme.com/ph/', platform: 'Realme PH',
    color: 'from-yellow-600 to-green-700', seller: 'Realme Philippines', area: 'SM City Imus, Cavite',
    phone: '+63 2 8800-6688', hours: 'Mon–Sun 10AM–9PM',
    bio: 'Realme was founded in 2018 as a sub-brand of OPPO before becoming an independent brand. Known for democratizing 5G smartphones with budget-friendly pricing, Realme has rapidly grown to become a top brand in Southeast Asia. The C65 5G offers 45W SUPERVOOC charging and a 5000mAh battery.',
    founder: 'Sky Li', year_started: 2018,
  },
];

const CATS = ['All', 'Phone', 'Laptop', 'Audio', 'Tablet'];

function AboutModal({ item, onClose }) {
  if (!item) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Hero */}
        <div className="relative h-40 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-overlay opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center p-1.5 border-2 border-white">
            <img src={item.logo} alt={item.brand} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div className="absolute bottom-3 left-20">
            <h2 className="font-heading font-bold text-white text-base leading-tight">{item.name}</h2>
            <p className="font-body text-[10px] text-[#00D4FF]">{item.brand} · {item.category}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0A192F] mb-1">About This Brand</h3>
            <p className="font-body text-sm text-[#0A192F]/60 leading-relaxed">{item.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {item.founder && (
              <div className="bg-[#F8FAFC] rounded-xl p-2.5">
                <p className="font-body text-[9px] text-[#0A192F]/40 uppercase tracking-wider">Founder</p>
                <p className="font-body text-xs font-semibold text-[#0A192F] mt-0.5">{item.founder}</p>
              </div>
            )}
            {item.year_started && (
              <div className="bg-[#F8FAFC] rounded-xl p-2.5">
                <p className="font-body text-[9px] text-[#0A192F]/40 uppercase tracking-wider">Established</p>
                <p className="font-body text-xs font-semibold text-[#0A192F] mt-0.5">{item.year_started}</p>
              </div>
            )}
            {item.seller && (
              <div className="bg-[#F8FAFC] rounded-xl p-2.5">
                <p className="font-body text-[9px] text-[#0A192F]/40 uppercase tracking-wider">PH Seller</p>
                <p className="font-body text-xs font-semibold text-[#0A192F] mt-0.5">{item.seller}</p>
              </div>
            )}
            {item.area && (
              <div className="bg-[#F8FAFC] rounded-xl p-2.5 flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-[#2563EB] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-[9px] text-[#0A192F]/40 uppercase tracking-wider">Location</p>
                  <p className="font-body text-xs font-semibold text-[#0A192F] mt-0.5">{item.area}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between py-2 px-3 bg-[#F8FAFC] rounded-xl">
            <div>
              <span className="font-body text-xs text-[#0A192F]/30 line-through">₱{item.originalPrice.toLocaleString()}</span>
              <p className="font-heading font-bold text-lg text-[#0A192F]">₱{item.price.toLocaleString()}</p>
            </div>
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">-{item.discount}%</span>
          </div>

          <div className="flex gap-2">
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Shop Now
            </a>
            {item.phone && (
              <a href={`tel:${item.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call Store
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhoneCard({ item, onAbout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="group bg-[#112240] rounded-2xl overflow-hidden border border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex-shrink-0"
      style={{ width: '240px' }}
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
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden p-1">
          <img src={item.logo} alt={item.brand} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
        </div>
      </div>
      <div className="p-4">
        <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{item.category} · {item.brand}</p>
        <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1 group-hover:text-[#00D4FF] transition-colors">{item.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-body text-xs font-semibold text-white/70">{item.rating}</span>
          <span className="text-white/20 mx-1">·</span>
          <span className="font-body text-[10px] text-white/40">{item.condition}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-body text-xs text-white/20 line-through">₱{item.originalPrice.toLocaleString()}</span>
            <p className="font-heading font-bold text-base text-white">₱{item.price.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAbout(item)}
            className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-body text-[10px] font-semibold transition-all border border-white/10"
          >
            ℹ️ About
          </button>
          <a
            href={item.link} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-white text-[#0A192F] font-body text-[10px] font-semibold transition-all"
          >
            Shop <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function BuySellElectronicsDeals() {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [aboutItem, setAboutItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let dir = 1;
    const scroll = setInterval(() => {
      if (!el || isPaused) return;
      el.scrollLeft += dir * 0.8;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) dir = -1;
      if (el.scrollLeft <= 10) dir = 1;
    }, 25);
    return () => clearInterval(scroll);
  }, [isPaused]);

  const filtered = activeCategory === 'All' ? BUYSELL_ELECTRONICS : BUYSELL_ELECTRONICS.filter(e => e.category === activeCategory);

  return (
    <>
      <section className="py-12 sm:py-16 bg-[#0D1F3C] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#00D4FF]/10 rounded-full">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                  <ShoppingBag className="w-3 h-3 text-[#00D4FF]" />
                  <span className="font-body text-xs font-bold text-[#00D4FF] uppercase tracking-wider">Buy & Sell · Gadgets</span>
                </div>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Phones & Electronics For Sale</h2>
              <p className="font-body text-sm text-white/40 mt-1">Real listings from trusted sellers across the Philippines</p>
            </div>
            <a href="/buysell" className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/60 font-body text-xs hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] hover:border-[#00D4FF]/40 transition-all">
              Browse All Listings →
            </a>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-body font-semibold text-xs transition-all ${activeCategory === cat ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/10 border border-white/10 text-white/60 hover:bg-white/20'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Scrolling cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(item => <PhoneCard key={item.id} item={item} onAbout={setAboutItem} />)}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center">
            <p className="font-body text-xs text-white/25">Click About for brand story & details · Click Shop to visit official store</p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {aboutItem && <AboutModal item={aboutItem} onClose={() => setAboutItem(null)} />}
      </AnimatePresence>
    </>
  );
}