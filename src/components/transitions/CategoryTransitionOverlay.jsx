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
        const dist = 35 + (i % 3) * 10;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist;
        const size = 36 + (i % 3) * 18;
        return (
          <motion.div key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
            animate={{ x: `${tx}vw`, y: `${ty}vh`, scale: [0, 1.4, 1], opacity: [0, 1, 1, 0], rotate: angle }}
            transition={{ duration: 0.9, delay: i * 0.04, ease: 'easeOut' }}
            className="absolute"
            style={{ fontSize: size }}
          >{icon}</motion.div>
        );
      })}
      {icons.map((icon, i) => (
        <motion.div key={`rain-${i}`}
          initial={{ x: `${(i * 12) % 100 - 10}vw`, y: '-15vh', opacity: 0, scale: 0.5 }}
          animate={{ y: '120vh', opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ duration: 1.0, delay: 0.15 + i * 0.07, ease: 'easeIn' }}
          className="absolute top-0"
          style={{ fontSize: 28 + (i % 3) * 10, left: `${(i * 13) % 95}%` }}
        >{icon}</motion.div>
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

// ─── Travel subcategory transitions ──────────────────────────────────────────
function TravelTransition({ subtype }) {
  const configs = {
    hotels: { icons: ['🏨','🛎️','🛏️','🏊','🌆','🌇','✨','🔑','🛁','🍽️'], bg: 'linear-gradient(135deg,#0a192f,#1d4ed8)', label: '🏨 Find Your Perfect Stay!', sub: 'Loading hotels...' },
    resorts: { icons: ['🌴','🏖️','🌊','🍹','⛱️','🐚','🌅','🌺','🐠','🏄'], bg: 'linear-gradient(135deg,#042f2e,#0d9488)', label: '🌴 Paradise Awaits!', sub: 'Loading resorts...' },
    flights: { icons: ['✈️','🛫','🛬','🌤️','⛅','🗺️','🌍','🧳','🎫','💺'], bg: 'linear-gradient(135deg,#0a192f,#1d4ed8)', label: '✈️ Ready for Takeoff!', sub: 'Loading flights...' },
    ferry: { icons: ['⛴️','🚢','⚓','🌊','🐬','🦀','🐟','🌅','🏝️','🗺️'], bg: 'linear-gradient(135deg,#0c1445,#1e40af)', label: '⛴️ Smooth Sailing!', sub: 'Loading ferry & bus routes...' },
    car: { icons: ['🚗','🔑','🛞','🛣️','⛽','🗺️','🚦','🏎️','💨','🌄'], bg: 'linear-gradient(135deg,#1a0a00,#92400e)', label: '🚗 Hit the Road!', sub: 'Loading car rentals...' },
    van: { icons: ['🚐','👨‍👩‍👧‍👦','🗺️','🛣️','🔑','⛽','🎒','🌄','🌇','🚦'], bg: 'linear-gradient(135deg,#1a0a00,#78350f)', label: '🚐 Group Travel Ready!', sub: 'Loading van rentals...' },
    tours: { icons: ['🗺️','📸','🏛️','🌺','🦅','🏔️','🎭','🎠','🌊','⛩️'], bg: 'linear-gradient(135deg,#1c1407,#a16207)', label: '🗺️ Adventure Time!', sub: 'Loading tours...' },
    island: { icons: ['🏝️','⛵','🤿','🐡','🦀','🌊','☀️','🐢','🐬','🦈'], bg: 'linear-gradient(135deg,#042f2e,#0891b2)', label: '🏝️ Island Hopping Time!', sub: 'Loading island tours...' },
    camping: { icons: ['⛺','🔥','🌲','🌙','⭐','🦋','🌿','🏕️','🪵','🦉'], bg: 'linear-gradient(135deg,#052e16,#166534)', label: '⛺ Into the Wild!', sub: 'Loading camping spots...' },
    diving: { icons: ['🤿','🐠','🦈','🦑','🐡','🐙','🌊','🐚','🦞','⚓'], bg: 'linear-gradient(135deg,#0c1445,#0284c7)', label: '🤿 Dive In!', sub: 'Loading dive packages...' },
    surfing: { icons: ['🏄','🌊','🤙','🦭','🏖️','🌅','☀️','🐚','🌺','🏖️'], bg: 'linear-gradient(135deg,#0c4a6e,#0ea5e9)', label: '🏄 Catch the Wave!', sub: 'Loading surf spots...' },
    hiking: { icons: ['🥾','🏔️','🌄','🦅','🌿','🪨','⛰️','🌲','🎒','🧭'], bg: 'linear-gradient(135deg,#052e16,#4d7c0f)', label: '🥾 Trail Awaits!', sub: 'Loading hike trails...' },
    cruise: { icons: ['🚢','⚓','🌊','🌅','🐬','🎭','🍽️','🌴','🌐','🎶'], bg: 'linear-gradient(135deg,#0a192f,#4338ca)', label: '🚢 Bon Voyage!', sub: 'Loading cruises...' },
    default: { icons: ['✈️','🏨','🌴','🚗','🗺️','🏝️','⛺','🤿','🏄','🥾'], bg: 'linear-gradient(135deg,#0a192f,#1d4ed8)', label: '✈️ Discover the Philippines!', sub: 'Loading travel options...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── Food subcategory transitions ─────────────────────────────────────────────
function FoodTransition({ subtype }) {
  const configs = {
    seafood:   { icons: ['🦞','🦀','🦐','🐟','🐠','🦑','🐡','🍤','🦈','🦪'], bg: 'linear-gradient(135deg,#0c2340,#164e63)', label: '🦞 Fresh Seafood Awaits!', sub: 'Loading seafood spots...' },
    fastfood:  { icons: ['🍔','🍟','🌭','🥓','🥤','🍿','🧂','🥪','🌮','🍕'], bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', label: '🍔 Fast Food Time!', sub: 'Loading fast food chains...' },
    baked:     { icons: ['🎂','🍰','🧁','🥐','🍩','🍪','🥖','🫓','🍞','🧇'], bg: 'linear-gradient(135deg,#7c2d12,#c2410c)', label: '🎂 Baked Goodness!', sub: 'Loading bakeries...' },
    bbq:       { icons: ['🍖','🍗','🥩','🔥','🍢','🥓','🧆','🌽','🥗','🍱'], bg: 'linear-gradient(135deg,#3b0000,#991b1b)', label: '🔥 BBQ & Grills!', sub: 'Loading grills & BBQ...' },
    coffee:    { icons: ['☕','🧋','🍵','🫖','🍫','🥛','🧊','🍨','🎠','☁️'], bg: 'linear-gradient(135deg,#1c1002,#78350f)', label: '☕ Café & Drinks!', sub: 'Loading coffee shops...' },
    milktea:   { icons: ['🧋','🍵','🍡','🟤','🫧','🍬','🥤','🧊','🎀','✨'], bg: 'linear-gradient(135deg,#2d1b69,#7c3aed)', label: '🧋 Bubble Tea Heaven!', sub: 'Loading milk tea shops...' },
    japanese:  { icons: ['🍱','🍣','🍜','🍛','🥢','🏮','🍙','🥟','🌸','⛩️'], bg: 'linear-gradient(135deg,#450a0a,#b91c1c)', label: '🍱 Itadakimasu!', sub: 'Loading Japanese restaurants...' },
    korean:    { icons: ['🥩','🥘','🌶️','🥬','🫕','🍚','🍖','🌮','🎎','🇰🇷'], bg: 'linear-gradient(135deg,#1c0035,#7c3aed)', label: '🥩 K-BBQ Time!', sub: 'Loading Korean restaurants...' },
    seafoodlocal: { icons: ['🦞','🌊','🐟','🦀','⚓','🏖️','🍤','🐚','🐠','🦑'], bg: 'linear-gradient(135deg,#0c2340,#0891b2)', label: '🦞 Fresh Local Catch!', sub: 'Loading seafood...' },
    homekitchen: { icons: ['🍲','🥘','🫕','🍚','🥗','🍳','🥞','🧅','🥕','🍄'], bg: 'linear-gradient(135deg,#14532d,#15803d)', label: '🍲 Lutong Bahay!', sub: 'Loading home kitchens...' },
    homebaker: { icons: ['🎂','🧁','🍰','🥐','🍪','🎁','🌹','🫙','🎀','✨'], bg: 'linear-gradient(135deg,#7c2d12,#ea580c)', label: '🎂 Homemade Pastries!', sub: 'Loading home bakers...' },
    catering:  { icons: ['🍽️','🥂','🎊','🎉','🍾','👨‍🍳','🥗','🎂','🌹','✨'], bg: 'linear-gradient(135deg,#1e1b4b,#4338ca)', label: '🍽️ Catering Services!', sub: 'Loading caterers...' },
    default:   { icons: ['🍗','🍔','🍕','🌮','🍜','🥘','🍱','🧋','🍦','🦞','☕','🎂'], bg: 'linear-gradient(135deg,#3b0000,#7f1d1d)', label: 'What are you craving? 🍽️', sub: 'Loading food directory...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── Buy & Sell subcategory transitions ───────────────────────────────────────
function BuySellTransition({ subtype }) {
  const configs = {
    electronics: { icons: ['📱','💻','🎮','🖥️','⌚','📡','🔌','🎧','📷','🤖'], bg: 'linear-gradient(135deg,#1e0050,#7e22ce)', label: '📱 Gadgets & Tech Deals!', sub: 'Loading electronics...' },
    cars:        { icons: ['🚗','🚕','🏎️','🚙','🛻','🚐','💨','🔑','⛽','🛞'], bg: 'linear-gradient(135deg,#1a0a00,#b45309)', label: '🚗 Rev It Up!', sub: 'Loading vehicles...' },
    shoes:       { icons: ['👟','👠','👢','🥿','👞','🩴','🧦','🎽','🛍️','💫'], bg: 'linear-gradient(135deg,#2d0036,#7e22ce)', label: '👟 Step Into Deals!', sub: 'Loading footwear...' },
    clothes:     { icons: ['👗','👕','👚','🧥','🎩','👒','👜','💍','🛍️','✨'], bg: 'linear-gradient(135deg,#1e0050,#db2777)', label: '👗 Fashion Finds!', sub: 'Loading clothing...' },
    houses:      { icons: ['🏠','🏡','🏢','🔑','🪟','🛋️','🌳','🏗️','📐','🏘️'], bg: 'linear-gradient(135deg,#052e16,#15803d)', label: '🏠 Find Your Home!', sub: 'Loading properties...' },
    furniture:   { icons: ['🛋️','🪑','🛏️','🖼️','🪞','🏺','💡','🪴','🔨','🏠'], bg: 'linear-gradient(135deg,#1c0a00,#a16207)', label: '🛋️ Furnish Your Space!', sub: 'Loading furniture...' },
    food:        { icons: ['🍔','🥘','🍱','🧁','🥗','🍕','🧋','🍜','🥞','🌮'], bg: 'linear-gradient(135deg,#3b0000,#b91c1c)', label: '🍔 Food Products!', sub: 'Loading food listings...' },
    product:     { icons: ['📦','🛒','💰','🏷️','🎁','✨','💸','🌟','🛍️','🎯'], bg: 'linear-gradient(135deg,#1e0050,#4338ca)', label: '📦 Great Deals Await!', sub: 'Loading products...' },
    default:     { icons: ['🛍️','💰','📦','💳','🏷️','🎁','💸','📱','👟','💻'], bg: 'linear-gradient(135deg,#1e0050,#7e22ce)', label: '🛍️ Buy & Sell — Best Deals!', sub: 'Loading marketplace...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── For Rent subcategory transitions ────────────────────────────────────────
function RentTransition({ subtype }) {
  const configs = {
    house:     { icons: ['🏠','🏡','🔑','🪟','🛋️','🌳','🏗️','🛏️','🚿','🏘️'], bg: 'linear-gradient(135deg,#002a00,#15803d)', label: '🏠 Find Your Perfect Home!', sub: 'Loading residential rentals...' },
    condo:     { icons: ['🏢','🔑','🛏️','🛁','🌆','🏙️','🌇','✨','🏊','🅿️'], bg: 'linear-gradient(135deg,#0a1628,#1d4ed8)', label: '🏢 Urban Living Awaits!', sub: 'Loading condo rentals...' },
    office:    { icons: ['🏢','💼','📋','🖥️','🪑','📞','🖨️','📊','🗂️','☕'], bg: 'linear-gradient(135deg,#1e1b4b,#4338ca)', label: '💼 Prime Office Space!', sub: 'Loading office rentals...' },
    vehicle:   { icons: ['🚗','🛵','🚌','🚐','🚚','🔑','🛞','⛽','🏎️','🚕'], bg: 'linear-gradient(135deg,#1a0a00,#b45309)', label: '🚗 Wheels for Rent!', sub: 'Loading vehicle rentals...' },
    equipment: { icons: ['🔧','⚙️','🔨','🪛','🏋️','🎵','📸','🎤','🖥️','🔩'], bg: 'linear-gradient(135deg,#0a2a00,#4d7c0f)', label: '🔧 Equipment Ready!', sub: 'Loading equipment...' },
    events:    { icons: ['🎉','🎊','🎈','🎤','📸','🎵','🍽️','🎂','🎆','🎪'], bg: 'linear-gradient(135deg,#2d1b69,#9333ea)', label: '🎉 Event Spaces!', sub: 'Loading event venues...' },
    default:   { icons: ['🏠','🔑','🚗','🛵','🛋️','📦','🌿','🏡','⚙️','🏢'], bg: 'linear-gradient(135deg,#002a00,#15803d)', label: '🔑 Find What to Rent!', sub: 'Loading rentals...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── Services subcategory transitions ────────────────────────────────────────
function ServicesTransition({ subtype }) {
  const configs = {
    home:       { icons: ['🔧','🪣','💡','🔨','🧹','🛠️','🪟','🚪','🧰','🏠'], bg: 'linear-gradient(135deg,#1a0a00,#c2410c)', label: '🔧 Home Services!', sub: 'Loading home services...' },
    tech:       { icons: ['💻','🖥️','📱','⌨️','🤖','🔌','📡','🧑‍💻','⚙️','🖨️'], bg: 'linear-gradient(135deg,#1e0050,#1d4ed8)', label: '💻 Tech Experts!', sub: 'Loading tech services...' },
    beauty:     { icons: ['💅','💄','🪮','✂️','🧴','💆','🌸','🪞','💃','🌺'], bg: 'linear-gradient(135deg,#3b0030,#be185d)', label: '💄 Beauty & Wellness!', sub: 'Loading beauty services...' },
    events:     { icons: ['🎉','🎊','🎈','🎤','📸','🎵','🍽️','🎂','🎆','🎇'], bg: 'linear-gradient(135deg,#1e1b4b,#7c3aed)', label: '🎉 Events & Entertainment!', sub: 'Loading event services...' },
    transport:  { icons: ['🚗','🛵','🚕','📦','🚌','🚐','🏎️','🛻','🚚','🗺️'], bg: 'linear-gradient(135deg,#0a2a00,#166534)', label: '🚗 Transport Services!', sub: 'Loading transport...' },
    professional: { icons: ['📋','⚖️','💰','📊','🎓','🔐','📝','🏆','🤝','✅'], bg: 'linear-gradient(135deg,#0a1628,#1e40af)', label: '📋 Professional Services!', sub: 'Loading professional services...' },
    health:     { icons: ['❤️‍🩹','💊','🏥','🩺','🧘','🏃','💪','🍎','🩻','🌿'], bg: 'linear-gradient(135deg,#1a3030,#0d9488)', label: '❤️‍🩹 Health & Wellness!', sub: 'Loading health services...' },
    default:    { icons: ['🛠️','🔧','💡','🤝','📋','⭐','🎯','🏆','🧑‍🔧','✅'], bg: 'linear-gradient(135deg,#2a1000,#c2410c)', label: '🛠️ Expert Services!', sub: 'Loading services...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── Jobs subcategory transitions ────────────────────────────────────────────
function JobsTransition({ subtype }) {
  const configs = {
    tech:       { icons: ['💻','🧑‍💻','⌨️','🖥️','📱','🤖','📊','🔐','🛠️','🚀'], bg: 'linear-gradient(135deg,#1a1000,#1d4ed8)', label: '💻 Tech Jobs!', sub: 'Loading tech careers...' },
    creative:   { icons: ['🎨','✏️','📸','🎬','🎵','🎤','🖌️','💡','📐','🎭'], bg: 'linear-gradient(135deg,#1e0050,#db2777)', label: '🎨 Creative Roles!', sub: 'Loading creative jobs...' },
    remote:     { icons: ['🏠','💻','☕','📡','🌐','🎧','📱','⌚','🌍','✈️'], bg: 'linear-gradient(135deg,#052e16,#166534)', label: '🏠 Work From Home!', sub: 'Loading remote jobs...' },
    sales:      { icons: ['💰','📊','🤝','🏆','📈','💼','🎯','⭐','🌟','💸'], bg: 'linear-gradient(135deg,#1a0a00,#92400e)', label: '💰 Sales & Marketing!', sub: 'Loading sales jobs...' },
    admin:      { icons: ['📋','📁','💼','🖥️','📞','📧','🖨️','📊','🗂️','✅'], bg: 'linear-gradient(135deg,#1e1b4b,#3730a3)', label: '📋 Admin & Office Jobs!', sub: 'Loading admin roles...' },
    food:       { icons: ['👨‍🍳','🍔','🍽️','🧑‍🍳','🥘','🎂','🏪','🍕','🥗','🧁'], bg: 'linear-gradient(135deg,#3b0000,#b91c1c)', label: '👨‍🍳 Food & Service Jobs!', sub: 'Loading food jobs...' },
    default:    { icons: ['💼','📋','🤝','💡','⭐','🏆','💰','📈','🎯','🚀'], bg: 'linear-gradient(135deg,#1a1000,#b45309)', label: '💼 Your Career Awaits!', sub: 'Loading jobs...' },
  };
  const c = configs[subtype] || configs.default;
  return <IconBurst icons={c.icons} bg={c.bg} label={c.label} sublabel={c.sub} />;
}

// ─── Map type → component ────────────────────────────────────────────────────
const TYPE_MAP = {
  travel: { Component: TravelTransition },
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

// ─── Helper exports ──────────────────────────────────────────────────────────
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
  // travel
  if (category === 'travel') {
    if (/hotel/.test(key)) return 'hotels';
    if (/resort/.test(key)) return 'resorts';
    if (/flight/.test(key)) return 'flights';
    if (/ferry|bus/.test(key)) return 'ferry';
    if (/car rental/.test(key)) return 'car';
    if (/van/.test(key)) return 'van';
    if (/tour/.test(key)) return 'tours';
    if (/island/.test(key)) return 'island';
    if (/camp/.test(key)) return 'camping';
    if (/div/.test(key)) return 'diving';
    if (/surf/.test(key)) return 'surfing';
    if (/hik/.test(key)) return 'hiking';
    if (/cruise/.test(key)) return 'cruise';
  }
  // food
  if (category === 'food') {
    if (/fish|shrimp|seafood|crab|prawn|squid|talaba/.test(key)) return 'seafood';
    if (/baked|cake|bread|pastry|bakery/.test(key)) return 'baked';
    if (/bbq|grill|inasal|lechon/.test(key)) return 'bbq';
    if (/coffee|cafe|barako/.test(key)) return 'coffee';
    if (/milk tea|boba|bubble/.test(key)) return 'milktea';
    if (/fast|burger|pizza|jollibee|mcdonald/.test(key)) return 'fastfood';
    if (/japanese|ramen|sushi|katsu/.test(key)) return 'japanese';
    if (/korean|k-bbq|samgyup/.test(key)) return 'korean';
    if (/home.?kitchen|lutong|carinderia/.test(key)) return 'homekitchen';
    if (/home.?baker|home baker/.test(key)) return 'homebaker';
    if (/cater/.test(key)) return 'catering';
  }
  // buysell
  if (category === 'buysell') {
    if (/smartphone|laptop|tablet|camera|audio|gaming|tv|electronic|gadget/.test(key)) return 'electronics';
    if (/car|sedan|suv|van|pickup|motorcycle|truck|vehicle/.test(key)) return 'cars';
    if (/shoe|sneaker|sandal|boot|footwear/.test(key)) return 'shoes';
    if (/cloth|shirt|dress|fashion|wear|outfit/.test(key)) return 'clothes';
    if (/house|condo|lot|property/.test(key)) return 'houses';
    if (/furniture|sofa|bed|table/.test(key)) return 'furniture';
    if (/product|general|health|sports|toys|books/.test(key)) return 'product';
  }
  // services
  if (category === 'services') {
    if (/home|plumb|electrician|carpent|clean/.test(key)) return 'home';
    if (/tech|digital|coding|web|it|dev/.test(key)) return 'tech';
    if (/beauty|hair|salon|spa|nail|skin/.test(key)) return 'beauty';
    if (/event|wedding|party|photo|video/.test(key)) return 'events';
    if (/transport|deliver|driver|cargo/.test(key)) return 'transport';
    if (/legal|finance|educat|consult|professional/.test(key)) return 'professional';
    if (/health|medical|dental|wellness/.test(key)) return 'health';
  }
  // jobs
  if (category === 'jobs') {
    if (/tech|software|coding|developer|it|engineer/.test(key)) return 'tech';
    if (/creative|design|art|write|media/.test(key)) return 'creative';
    if (/remote|work from home|online/.test(key)) return 'remote';
    if (/sales|marketing/.test(key)) return 'sales';
    if (/admin|office|clerk/.test(key)) return 'admin';
    if (/food|cook|chef|service/.test(key)) return 'food';
  }
  // rent
  if (category === 'rent') {
    if (/house|bahay|residential/.test(key)) return 'house';
    if (/condo/.test(key)) return 'condo';
    if (/office|commercial/.test(key)) return 'office';
    if (/vehicle|car|van|motor/.test(key)) return 'vehicle';
    if (/equipment|tool|machine/.test(key)) return 'equipment';
    if (/event|party|venue/.test(key)) return 'events';
  }
  return null;
}