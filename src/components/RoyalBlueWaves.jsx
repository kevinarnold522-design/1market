import React from 'react';

export default function RoyalBlueWaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      <style>{`
        @keyframes wave1 {
          0% { transform: translateX(0) translateY(0) scaleY(1); }
          50% { transform: translateX(-3%) translateY(12px) scaleY(1.04); }
          100% { transform: translateX(0) translateY(0) scaleY(1); }
        }
        @keyframes wave2 {
          0% { transform: translateX(0) translateY(0) scaleY(1); }
          50% { transform: translateX(3%) translateY(-10px) scaleY(1.03); }
          100% { transform: translateX(0) translateY(0) scaleY(1); }
        }
        @keyframes wave3 {
          0% { transform: translateX(0) translateY(0) scaleY(1); }
          50% { transform: translateX(-2%) translateY(8px) scaleY(1.02); }
          100% { transform: translateX(0) translateY(0) scaleY(1); }
        }
        .wave1 { animation: wave1 12s ease-in-out infinite; }
        .wave2 { animation: wave2 16s ease-in-out infinite; }
        .wave3 { animation: wave3 20s ease-in-out infinite; }
      `}</style>

      {/* Soft ocean wave overlay */}
      <div className="absolute inset-0" style={{ background: 'transparent' }} />

      {/* Wave 1 — dark blue depth */}
      <svg className="wave1 absolute bottom-0 left-0 w-full" style={{ height: '58vh', minHeight: 320 }}
        viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,200 C240,280 480,120 720,200 C960,280 1200,120 1440,200 L1440,400 L0,400 Z"
          fill="rgba(30,64,175,0.34)" />
      </svg>

      {/* Wave 2 — royal blue motion */}
      <svg className="wave2 absolute bottom-0 left-0 w-full" style={{ height: '46vh', minHeight: 255 }}
        viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,230 C180,150 360,310 540,230 C720,150 900,310 1080,230 C1260,150 1360,260 1440,220 L1440,400 L0,400 Z"
          fill="rgba(37,99,235,0.36)" />
      </svg>

      {/* Wave 3 — light blue highlight */}
      <svg className="wave3 absolute bottom-0 left-0 w-full" style={{ height: '32vh', minHeight: 170 }}
        viewBox="0 0 1440 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,260 C200,200 400,320 600,260 C800,200 1000,320 1200,260 C1320,226 1400,280 1440,265 L1440,400 L0,400 Z"
          fill="rgba(186,230,253,0.48)" />
      </svg>

      {/* Top subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at center top, #BAE6FD 0%, transparent 70%)' }} />
    </div>
  );
}