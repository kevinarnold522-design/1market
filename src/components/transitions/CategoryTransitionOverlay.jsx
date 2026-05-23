import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helper: burst icons from center ────────────────────────────────────────
function IconBurst({ icons, bg, label, sublabel }) {
  const count = icons.length;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: bg }}>
      {icons.map((icon, i) => {
        const angle = (360 / count) * i;
        const dist = 35 + Math.random() * 25;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist;
        const size = 36 + Math.floor(Math.random() * 32);
        return (
          <motion.div key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
            animate={{ x: `${tx}vw`, y: `${ty}vh`, scale: [0, 1.4, 1], opacity: [0, 1, 1, 0], rotate: angle }}
            transition={{ duration: 0.9, delay: i * 0.04, ease: 'easeOut' }}
            className="absolute"
            style={{ fontSize: size }}
          >
            {icon}
          </motion.div>
        );
      })}
      {/* Extra rain from top */}
      {icons.map((icon, i) => (
        <motion.div key={`rain-${i}`}
          initial={{ x: `${(i * 12) % 100 - 10}vw`, y: '-15vh', opacity: 0, scale: 0.5 }}
          animate={{ y: '120vh', opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ duration: 1.0, delay: 0.15 + i * 0.07, ease: 'easeIn' }}
          className="absolute top-0"
          style={{ fontSize: 28 + (i % 3) * 10, left: `${(i * 13) % 95}%` }}
        >
          {icon}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.05, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.25, 0.7, 1] }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center z-10"
      >
        <p className="font-heading font-bold text-2xl text-white drop-shadow-lg">{label}</p>
        {sublabel && <p className="font-body text-sm text-white/60 mt-1">{sublabel}</p>}
      </motion.div>
    </div>
  );
}

// ─── Travel ──────────────────────────────────────────────────────────────────
function AirplaneTransition() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(135deg,#0a192f,#1d4ed8)' }}>
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          initial={{ x: '-100vw', opacity: 0.6 }}
          animate={{ x: '120vw', opacity: 0 }}
          transition={{ duration: 0.8 + i * 0.05, delay: i * 0.04, ease: 'easeIn' }}
          className="absolute h-0.5 rounded-full"
          style={{ top: `${15 + i * 10}%`, width: `${60 + i * 10}px`, background: 'rgba(255,255,255,0.3)' }}
        />
      ))}
      {[{ top: '20%', size: 80, delay: 0.1 }, { top: '60%', size: 60, delay: 0.25 }, { top: '40%', size: 100, delay: 0.05 }].map((c, i) => (
        <motion.div key={i}
          initial={{ x: '120vw' }} animate={{ x: '-20vw' }}
          transition={{ duration: 1.2, delay: c.delay, ease: 'linear' }}
          className="absolute rounded-full bg-white/15"
          style={{ top: c.top, width: c.size, height: c.size * 0.5 }}
        />
      ))}
      <motion.div
        initial={{ x: '-15vw', y: '8vh', rotate: 0 }}
        animate={{ x: '110vw', y: '-8vh', rotate: -8 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="text-7xl drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 20px rgba(96,165,250,0.8))' }}
      >✈️</motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.3, 0.7, 1] }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-heading font-bold text-2xl text-white drop-shadow-lg">Discover the Philippines ✈️</p>
        <p className="font-body text-sm text-white/60 mt-1">Loading travel...</p>
      </motion.div>
    </div>
  );
}

// ─── Food ────────────────────────────────────────────────────────────────────
function FoodTransition({ subtype }) {
  const iconMap = {
    seafood: ['🦞', '🦀', '🦐', '🐟', '🐠', '🦑', '🐡', '🍤', '🦈', '🦪'],
    fastfood: ['🍔', '🍟', '🌭', '🥓', '🥤', '🍿', '🧂', '🥪', '🌮', '🍕'],
    baked: ['🎂', '🍰', '🧁', '🥐', '🍩', '🍪', '🥖', '🫓', '🍞', '🧇'],
    bbq: ['🍖', '🍗', '🥩', '🔥', '🍢', '🥓', '🧆', '🌽', '🥗', '🍱'],
    coffee: ['☕', '🧋', '🍵', '🫖', '🍫', '🥛', '🧊', '🍨', '🎠', '☁️'],
    default: ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🧋', '🍦', '🦞', '☕', '🎂'],
  };
  const icons = iconMap[subtype] || iconMap.default;
  const labels = {
    seafood: '🦞 Fresh Seafood Awaits!',
    fastfood: '🍔 Fast Food Time!',
    baked: '🎂 Baked Goodness!',
    bbq: '🔥 BBQ & Grills!',
    coffee: '☕ Café & Drinks!',
    default: 'What are you craving? 🍽️',
  };
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(135deg,#3b0000,#7f1d1d)' }}>
      {icons.map((icon, i) => (
        <motion.div key={i}
          initial={{ x: `${(i % 4) * 25}vw`, y: '110vh', rotate: Math.random() * 40 - 20, scale: 0.5, opacity: 0 }}
          animate={{ y: '-20vh', rotate: Math.random() * 60 - 30, scale: [0.5, 1.2, 1], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.0, delay: i * 0.06, ease: 'easeOut' }}
          className="absolute text-5xl"
          style={{ left: `${(i % 6) * 17 + 2}%` }}
        >{icon}</motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.05, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.25, 0.7, 1] }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-heading font-bold text-2xl text-white drop-shadow-lg">{labels[subtype] || labels.default}</p>
        <p className="font-body text-sm text-white/60 mt-1">Loading food directory...</p>
      </motion.div>
    </div>
  );
}

// ─── Buy & Sell ───────────────────────────────────────────────────────────────
function BuySellTransition({ subtype }) {
  const iconMap = {
    electronics: ['📱', '💻', '🎮', '🖥️', '⌚', '📡', '🔌', '🎧', '📷', '🤖'],
    cars: ['🚗', '🚕', '🏎️', '🚙', '🛻', '🚐', '💨', '🔑', '⛽', '🛞'],
    shoes: ['👟', '👠', '👢', '🥿', '👞', '🩴', '🧦', '🎽', '🛍️', '💫'],
    clothes: ['👗', '👕', '👚', '🧥', '🎩', '👒', '👜', '💍', '🛍️', '✨'],
    houses: ['🏠', '🏡', '🏢', '🔑', '🪟', '🛋️', '🌳', '🏗️', '📐', '🏘️'],
    default: ['🛍️', '💰', '📦', '💳', '🏷️', '🎁', '💸', '📱', '👟', '💻'],
  };
  const icons = iconMap[subtype] || iconMap.default;
  const labels = {
    electronics: '📱 Gadgets & Tech Deals!',
    cars: '🚗 Rev It Up! Cars & Vehicles!',
    shoes: '👟 Step Into Deals!',
    clothes: '👗 Fashion Finds!',
    houses: '🏠 Find Your Home!',
    default: '🛍️ Buy & Sell — Best Deals!',
  };
  return (
    <IconBurst
      icons={icons}
      bg="linear-gradient(135deg,#1e0050,#7e22ce)"
      label={labels[subtype] || labels.default}
      sublabel="Loading marketplace..."
    />
  );
}

// ─── For Rent ────────────────────────────────────────────────────────────────
function RentTransition({ subtype }) {
  const iconMap = {
    house: ['🏠', '🏡', '🔑', '🪟', '🛋️', '🌳', '🏗️', '🛏️', '🚿', '🏘️'],
    vehicle: ['🚗', '🛵', '🚌', '🚐', '🚚', '🔑', '🛞', '⛽', '🏎️', '🚕'],
    equipment: ['🔧', '⚙️', '🔨', '🪛', '🏋️', '🎵', '📸', '🎤', '🖥️', '🔩'],
    default: ['🏠', '🔑', '🚗', '🛵', '🛋️', '📦', '🌿', '🏡', '⚙️', '🏢'],
  };
  const icons = iconMap[subtype] || iconMap.default;
  return (
    <IconBurst
      icons={icons}
      bg="linear-gradient(135deg,#002a00,#15803d)"
      label="🔑 Find What to Rent!"
      sublabel="Loading rentals..."
    />
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServicesTransition({ subtype }) {
  const iconMap = {
    home: ['🔧', '🪣', '💡', '🔨', '🧹', '🛠️', '🪟', '🚪', '🧰', '🏠'],
    tech: ['💻', '🖥️', '📱', '⌨️', '🤖', '🔌', '📡', '🧑‍💻', '⚙️', '🖨️'],
    beauty: ['💅', '💄', '🪮', '✂️', '🧴', '💆', '🌸', '🪞', '💃', '🌺'],
    events: ['🎉', '🎊', '🎈', '🎤', '📸', '🎵', '🍽️', '🎂', '🎆', '🎇'],
    transport: ['🚗', '🛵', '🚕', '📦', '🚌', '🚐', '🏎️', '🛻', '🚚', '🗺️'],
    default: ['🛠️', '🔧', '💡', '🤝', '📋', '⭐', '🎯', '🏆', '🧑‍🔧', '✅'],
  };
  const icons = iconMap[subtype] || iconMap.default;
  return (
    <IconBurst
      icons={icons}
      bg="linear-gradient(135deg,#2a1000,#c2410c)"
      label="🛠️ Expert Services!"
      sublabel="Loading services..."
    />
  );
}

// ─── Jobs ────────────────────────────────────────────────────────────────────
function JobsTransition({ subtype }) {
  const iconMap = {
    tech: ['💻', '🧑‍💻', '⌨️', '🖥️', '📱', '🤖', '📊', '🔐', '🛠️', '🚀'],
    creative: ['🎨', '✏️', '📸', '🎬', '🎵', '🎤', '🖌️', '💡', '📐', '🎭'],
    remote: ['🏠', '💻', '☕', '📡', '🌐', '🎧', '📱', '⌚', '🌍', '✈️'],
    default: ['💼', '📋', '🤝', '💡', '⭐', '🏆', '💰', '📈', '🎯', '🚀'],
  };
  const icons = iconMap[subtype] || iconMap.default;
  return (
    <IconBurst
      icons={icons}
      bg="linear-gradient(135deg,#1a1000,#b45309)"
      label="💼 Your Career Awaits!"
      sublabel="Loading jobs..."
    />
  );
}

// ─── Map type → component ────────────────────────────────────────────────────
const TYPE_MAP = {
  travel: { Component: AirplaneTransition },
  food: { Component: FoodTransition },
  buysell: { Component: BuySellTransition },
  rent: { Component: RentTransition },
  services: { Component: ServicesTransition },
  jobs: { Component: JobsTransition },
};

export default function CategoryTransitionOverlay({ type, subtype }) {
  const entry = type ? TYPE_MAP[type] : null;

  return (
    <AnimatePresence>
      {entry && (
        <motion.div key={`${type}-${subtype}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}>
          <entry.Component subtype={subtype} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Helper export so subcategory pages can trigger transitions ──────────────
export function getTransitionTypeForHref(href) {
  if (href === '/travel') return 'travel';
  if (href === '/food') return 'food';
  if (href === '/buysell') return 'buysell';
  if (href === '/rent') return 'rent';
  if (href === '/services') return 'services';
  if (href === '/jobs') return 'jobs';
  return null;
}

export function getSubtypeForSubcategory(category, subcategory) {
  const key = (subcategory || '').toLowerCase();
  // food
  if (category === 'food') {
    if (/fish|shrimp|seafood|crab|prawn|squid/.test(key)) return 'seafood';
    if (/baked|cake|bread|pastry/.test(key)) return 'baked';
    if (/bbq|grill|inasal|lechon/.test(key)) return 'bbq';
    if (/coffee|cafe|drink|beverage/.test(key)) return 'coffee';
    if (/fast|burger|pizza/.test(key)) return 'fastfood';
  }
  // buysell
  if (category === 'buysell') {
    if (/smartphone|laptop|tablet|camera|audio|gaming|tv|device|electronic|gadget/.test(key)) return 'electronics';
    if (/car|sedan|suv|van|pickup|motorcycle|truck|vehicle/.test(key)) return 'cars';
    if (/shoe|sneaker|sandal|boot|footwear/.test(key)) return 'shoes';
    if (/cloth|shirt|dress|fashion|wear|outfit/.test(key)) return 'clothes';
    if (/house|condo|lot|property|realty/.test(key)) return 'houses';
  }
  // services
  if (category === 'services') {
    if (/home|plumb|electrician|carpent|clean/.test(key)) return 'home';
    if (/tech|digital|coding|web|it|dev/.test(key)) return 'tech';
    if (/beauty|hair|salon|spa|nail|skin/.test(key)) return 'beauty';
    if (/event|wedding|party|photo|video/.test(key)) return 'events';
    if (/transport|deliver|driver|cargo/.test(key)) return 'transport';
  }
  // jobs
  if (category === 'jobs') {
    if (/tech|software|coding|developer|it|engineer/.test(key)) return 'tech';
    if (/creative|design|art|write|media/.test(key)) return 'creative';
    if (/remote|work from home|online/.test(key)) return 'remote';
  }
  return null;
}