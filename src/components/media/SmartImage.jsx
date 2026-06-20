import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=900&auto=format&fit=crop&q=80';

export default function SmartImage({ src, alt = '', className = '', imgClassName = '', children }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);
  const imageSrc = failed ? PLACEHOLDER_IMAGE : src;

  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-white/10" />
      )}
      {failed && !src && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 text-white/35">
          <ImageOff className="w-6 h-6" />
          <span className="font-body text-[10px] font-semibold">Image unavailable</span>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(false); }}
      />
      {children}
    </div>
  );
}