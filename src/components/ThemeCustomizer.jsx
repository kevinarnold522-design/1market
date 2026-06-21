import React, { useEffect, useState } from 'react';
import { Palette, X } from 'lucide-react';

const THEMES = [
  { name: 'Royal Blue', primary: '#0033CC', accent: '#00D4FF', deep: '#001a80' },
  { name: 'Emerald', primary: '#047857', accent: '#34d399', deep: '#064e3b' },
  { name: 'Purple', primary: '#6d28d9', accent: '#c084fc', deep: '#2e1065' },
  { name: 'Sunset', primary: '#ea580c', accent: '#fbbf24', deep: '#7c2d12' },
];

const STORAGE_KEY = 'landing-theme-colors';

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--landing-primary', theme.primary);
  root.style.setProperty('--landing-accent', theme.accent);
  root.style.setProperty('--landing-deep', theme.deep);
  root.style.setProperty('--landing-bg-gradient', `linear-gradient(180deg, ${theme.primary} 0%, ${theme.deep} 100%)`);
}

export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(THEMES[0]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const next = saved ? { ...THEMES[0], ...JSON.parse(saved) } : THEMES[0];
    setTheme(next);
    applyTheme(next);
  }, []);

  const update = (next) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyTheme(next);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[120]">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-heading text-sm font-bold text-white">Landing Theme</p>
              <p className="font-body text-[11px] text-white/45">Customize landing page colors</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 p-1 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((item) => (
              <button key={item.name} type="button" onClick={() => update(item)} className="rounded-xl border p-2 text-left transition hover:scale-[1.02]" style={{ borderColor: theme.name === item.name ? item.accent : 'rgba(255,255,255,0.14)', background: `linear-gradient(135deg, ${item.primary}, ${item.deep})` }}>
                <span className="block text-xs font-bold text-white">{item.name}</span>
                <span className="mt-2 flex gap-1"><i className="h-3 w-3 rounded-full" style={{ background: item.primary }} /><i className="h-3 w-3 rounded-full" style={{ background: item.accent }} /><i className="h-3 w-3 rounded-full" style={{ background: item.deep }} /></span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['primary', 'accent', 'deep'].map((key) => (
              <label key={key} className="text-[10px] uppercase text-white/45">
                {key}
                <input type="color" value={theme[key]} onChange={(e) => update({ ...theme, name: 'Custom', [key]: e.target.value })} className="mt-1 h-8 w-full cursor-pointer rounded bg-transparent" />
              </label>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/85 text-white shadow-2xl backdrop-blur-xl hover:scale-105" aria-label="Customize landing theme">
        <Palette className="h-5 w-5" />
      </button>
    </div>
  );
}