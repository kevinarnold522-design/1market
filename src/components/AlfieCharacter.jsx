import React from 'react';

const ALFIE_IMG = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/dba602fee_5C2B4377-0629-406D-97F0-9485947B48FD.png';

const STYLE = `
  @keyframes alfie-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25%       { transform: translateY(-8px) rotate(1.5deg); }
    75%       { transform: translateY(-4px) rotate(-1deg); }
  }
  @keyframes alfie-wave {
    0%   { transform: translateY(0px) rotate(0deg); }
    10%  { transform: translateY(-6px) rotate(-5deg); }
    20%  { transform: translateY(-10px) rotate(8deg); }
    30%  { transform: translateY(-8px) rotate(-6deg); }
    40%  { transform: translateY(-12px) rotate(9deg); }
    50%  { transform: translateY(-10px) rotate(-5deg); }
    60%  { transform: translateY(-8px) rotate(7deg); }
    70%  { transform: translateY(-6px) rotate(-4deg); }
    80%  { transform: translateY(-4px) rotate(3deg); }
    90%  { transform: translateY(-2px) rotate(-1deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes alfie-dance {
    0%   { transform: translateY(0px) rotate(0deg) scaleX(1); }
    12%  { transform: translateY(-14px) rotate(-7deg) scaleX(1.04); }
    25%  { transform: translateY(-6px) rotate(7deg) scaleX(0.97); }
    37%  { transform: translateY(-18px) rotate(-8deg) scaleX(1.05); }
    50%  { transform: translateY(-8px) rotate(8deg) scaleX(0.96); }
    62%  { transform: translateY(-16px) rotate(-6deg) scaleX(1.04); }
    75%  { transform: translateY(-4px) rotate(6deg) scaleX(0.98); }
    87%  { transform: translateY(-10px) rotate(-4deg) scaleX(1.02); }
    100% { transform: translateY(0px) rotate(0deg) scaleX(1); }
  }
  @keyframes alfie-talk-bob {
    0%, 100% { transform: translateY(0px) scale(1); }
    33%       { transform: translateY(-5px) scale(1.02); }
    66%       { transform: translateY(-2px) scale(0.99); }
  }
  @keyframes alfie-shadow-pulse {
    0%, 100% { transform: scaleX(1); opacity: 0.3; }
    50%       { transform: scaleX(0.7); opacity: 0.15; }
  }

  .alfie-idle   { animation: alfie-float   2.8s ease-in-out infinite; }
  .alfie-wave   { animation: alfie-wave    2.4s ease-in-out 1; }
  .alfie-dance  { animation: alfie-dance   0.5s ease-in-out infinite; }
  .alfie-talk   { animation: alfie-talk-bob 1.8s ease-in-out infinite; }
  .alfie-shadow { animation: alfie-shadow-pulse 2.8s ease-in-out infinite; }
`;

export default function AlfieCharacter({ mode = 'idle', size = 130 }) {
  return (
    <>
      <style>{STYLE}</style>
      <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
        {/* 3D shadow under feet */}
        <div style={{ position: 'relative', width: size, height: size }}>
          <img
            src={ALFIE_IMG}
            alt="Alfie"
            className={`alfie-${mode}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 32px rgba(0,51,204,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              imageRendering: 'crisp-edges',
            }}
          />
        </div>
        {/* Ground shadow */}
        <div
          className="alfie-shadow"
          style={{
            width: size * 0.55,
            height: 10,
            background: 'radial-gradient(ellipse at center, rgba(0,51,204,0.35) 0%, transparent 80%)',
            borderRadius: '50%',
            marginTop: -6,
          }}
        />
      </div>
    </>
  );
}