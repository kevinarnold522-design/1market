import React from 'react';
import { Star } from 'lucide-react';

// Simulated platform ratings per business name pattern
function getPlatformRatings(bizName, baseRating) {
  const name = (bizName || '').toLowerCase();
  const base = baseRating || 4.2;

  const platforms = [];

  if (/jollibee|mcdonald|kfc|starbucks|chowking|mang inasal|greenwich|chowking/.test(name)) {
    platforms.push(
      { name: 'Google', icon: '', color: '#4285F4', rating: (base + 0.1).toFixed(1), count: Math.floor(Math.random() * 3000 + 1000) },
      { name: 'Zomato', icon: '', color: '#E23744', rating: (base - 0.1).toFixed(1), count: Math.floor(Math.random() * 500 + 200) },
      { name: 'Facebook', icon: '', color: '#1877F2', rating: (base + 0.2).toFixed(1), count: Math.floor(Math.random() * 1500 + 500) },
      { name: 'Yelp', icon: '⭐', color: '#AF0606', rating: (base).toFixed(1), count: Math.floor(Math.random() * 300 + 100) },
    );
  } else if (/hotel|resort|inn|suites/.test(name)) {
    platforms.push(
      { name: 'Booking.com', icon: '', color: '#003580', rating: (base + 0.1).toFixed(1), count: Math.floor(Math.random() * 800 + 200) },
      { name: 'Agoda', icon: '', color: '#5392FF', rating: (base - 0.1).toFixed(1), count: Math.floor(Math.random() * 600 + 150) },
      { name: 'TripAdvisor', icon: '', color: '#34E0A1', rating: (base).toFixed(1), count: Math.floor(Math.random() * 400 + 100) },
      { name: 'Google', icon: '', color: '#4285F4', rating: (base + 0.2).toFixed(1), count: Math.floor(Math.random() * 1000 + 300) },
    );
  } else {
    platforms.push(
      { name: 'Google', icon: '', color: '#4285F4', rating: (base + 0.1).toFixed(1), count: Math.floor(Math.random() * 500 + 50) },
      { name: 'Facebook', icon: '', color: '#1877F2', rating: (base).toFixed(1), count: Math.floor(Math.random() * 300 + 50) },
    );
    if (Math.random() > 0.4) {
      platforms.push(
        { name: 'Zomato', icon: '', color: '#E23744', rating: (base - 0.15).toFixed(1), count: Math.floor(Math.random() * 100 + 20) }
      );
    }
  }

  // Compute average
  const avg = (platforms.reduce((sum, p) => sum + parseFloat(p.rating), 0) / platforms.length).toFixed(1);

  return { platforms, avg, total: platforms.reduce((sum, p) => sum + p.count, 0) };
}

export default function MultiPlatformRating({ bizName, baseRating, compact = false }) {
  const { platforms, avg, total } = getPlatformRatings(bizName, baseRating);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span className="font-body font-bold text-xs text-[#0A192F]">{avg}</span>
        <span className="font-body text-[10px] text-[#0A192F]/40">({total.toLocaleString()})</span>
        <div className="flex gap-0.5 ml-0.5">
          {platforms.map(p => (
            <span key={p.name} title={`${p.name}: ${p.rating}`}
              className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: `${p.color}20` }}>
              {p.icon}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#F8FAFC] border border-[#0A192F]/5 p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-3.5 h-3.5 ${parseFloat(avg) >= s ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
        </div>
        <span className="font-heading font-bold text-base text-[#0A192F]">{avg}</span>
        <span className="font-body text-xs text-[#0A192F]/40">avg from {platforms.length} platforms · {total.toLocaleString()} reviews</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {platforms.map(p => (
          <div key={p.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{ background: `${p.color}12`, border: `1px solid ${p.color}25` }}>
            <span className="text-sm">{p.icon}</span>
            <div className="min-w-0">
              <p className="font-body font-bold text-[10px] text-[#0A192F] truncate">{p.name}</p>
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span className="font-body font-bold text-[10px]" style={{ color: p.color }}>{p.rating}</span>
                <span className="font-body text-[9px] text-[#0A192F]/30">({p.count.toLocaleString()})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}