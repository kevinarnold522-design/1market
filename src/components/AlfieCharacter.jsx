import React from 'react';

const ALFIE_IMG = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/745fd96c6_5C2B4377-0629-406D-97F0-9485947B48FD.png';

const STYLE = `
  /* IDLE — gentle float + sway */
  @keyframes alfie-idle {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    25%     { transform: translateY(-5px) rotate(1.5deg); }
    50%     { transform: translateY(-8px) rotate(-1deg); }
    75%     { transform: translateY(-4px) rotate(0.8deg); }
  }

  /* WAVE — bounce up and rock side to side like waving */
  @keyframes alfie-wave {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    10%     { transform: translateY(-12px) rotate(-8deg); }
    20%     { transform: translateY(-10px) rotate(10deg); }
    30%     { transform: translateY(-14px) rotate(-9deg); }
    40%     { transform: translateY(-11px) rotate(11deg); }
    50%     { transform: translateY(-14px) rotate(-8deg); }
    60%     { transform: translateY(-10px) rotate(9deg); }
    70%     { transform: translateY(-12px) rotate(-7deg); }
    85%     { transform: translateY(-5px) rotate(3deg); }
  }

  /* THUMBSUP — lean forward with a happy bounce */
  @keyframes alfie-thumbsup {
    0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
    20%     { transform: translateY(-10px) rotate(-6deg) scale(1.05); }
    40%     { transform: translateY(-14px) rotate(5deg) scale(1.08); }
    60%     { transform: translateY(-10px) rotate(-4deg) scale(1.05); }
    80%     { transform: translateY(-6px) rotate(3deg) scale(1.02); }
  }

  /* JUMP — cartoonish squash and stretch jump */
  @keyframes alfie-jump {
    0%      { transform: translateY(0px) scaleY(1) scaleX(1) rotate(0deg); }
    8%      { transform: translateY(6px) scaleY(0.8) scaleX(1.2) rotate(0deg); }
    20%     { transform: translateY(-30px) scaleY(1.1) scaleX(0.92) rotate(-5deg); }
    35%     { transform: translateY(-38px) scaleY(1.05) scaleX(0.95) rotate(5deg); }
    50%     { transform: translateY(0px) scaleY(0.82) scaleX(1.18) rotate(0deg); }
    58%     { transform: translateY(-18px) scaleY(1.05) scaleX(0.96) rotate(-3deg); }
    70%     { transform: translateY(0px) scaleY(0.9) scaleX(1.1) rotate(0deg); }
    80%,100%{ transform: translateY(0px) scaleY(1) scaleX(1) rotate(0deg); }
  }

  /* THINK — slow head-tilt like puzzled/curious */
  @keyframes alfie-think {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    30%     { transform: translateY(-4px) rotate(-10deg); }
    55%     { transform: translateY(-3px) rotate(8deg); }
    75%     { transform: translateY(-5px) rotate(-6deg); }
  }

  /* SEARCH — look left and right, lean side to side */
  @keyframes alfie-search {
    0%,100% { transform: translateX(0px) rotate(0deg); }
    20%     { transform: translateX(-8px) rotate(-7deg); }
    40%     { transform: translateX(8px) rotate(7deg); }
    60%     { transform: translateX(-6px) rotate(-5deg); }
    80%     { transform: translateX(6px) rotate(5deg); }
  }

  /* POINT — lean and nod forward energetically */
  @keyframes alfie-point {
    0%,100% { transform: translateY(0px) rotate(0deg) translateX(0px); }
    15%     { transform: translateY(-6px) rotate(-5deg) translateX(4px); }
    30%     { transform: translateY(-10px) rotate(6deg) translateX(8px); }
    50%     { transform: translateY(-8px) rotate(-4deg) translateX(6px); }
    65%     { transform: translateY(-10px) rotate(6deg) translateX(8px); }
    80%     { transform: translateY(-5px) rotate(-3deg) translateX(4px); }
  }

  /* ANNOUNCE — puff up and rock confidently */
  @keyframes alfie-announce {
    0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
    20%     { transform: translateY(-8px) rotate(-4deg) scale(1.04); }
    45%     { transform: translateY(-12px) rotate(4deg) scale(1.06); }
    65%     { transform: translateY(-9px) rotate(-3deg) scale(1.04); }
    85%     { transform: translateY(-5px) rotate(2deg) scale(1.02); }
  }

  /* TRAVEL — float and drift side to side like flying */
  @keyframes alfie-travel {
    0%,100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    20%     { transform: translateY(-14px) translateX(4px) rotate(-6deg); }
    40%     { transform: translateY(-18px) translateX(-4px) rotate(5deg); }
    60%     { transform: translateY(-12px) translateX(5px) rotate(-4deg); }
    80%     { transform: translateY(-16px) translateX(-3px) rotate(4deg); }
  }

  /* REALESTATE — slow proud sway */
  @keyframes alfie-realestate {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    30%     { transform: translateY(-8px) rotate(-5deg); }
    60%     { transform: translateY(-6px) rotate(4deg); }
  }

  /* DANCE — fast energetic wiggle + bounce */
  @keyframes alfie-dance {
    0%      { transform: translateY(0px) rotate(0deg) scaleX(1); }
    10%     { transform: translateY(-14px) rotate(-12deg) scaleX(1.06); }
    20%     { transform: translateY(-6px) rotate(12deg) scaleX(0.95); }
    30%     { transform: translateY(-18px) rotate(-14deg) scaleX(1.07); }
    40%     { transform: translateY(-4px) rotate(13deg) scaleX(0.94); }
    50%     { transform: translateY(-16px) rotate(-11deg) scaleX(1.06); }
    60%     { transform: translateY(-8px) rotate(11deg) scaleX(0.96); }
    70%     { transform: translateY(-14px) rotate(-9deg) scaleX(1.05); }
    80%     { transform: translateY(-4px) rotate(8deg) scaleX(0.97); }
    90%     { transform: translateY(-10px) rotate(-6deg) scaleX(1.03); }
    100%    { transform: translateY(0px) rotate(0deg) scaleX(1); }
  }

  /* SHADOW */
  @keyframes alfie-shadow {
    0%,100% { transform: scaleX(1); opacity: 0.3; }
    50%     { transform: scaleX(0.6); opacity: 0.1; }
  }

  /* SPARKLE */
  @keyframes alfie-sparkle {
    0%       { opacity:0; transform: scale(0) rotate(0deg); }
    30%      { opacity:1; transform: scale(1.4) rotate(90deg); }
    70%      { opacity:0.8; transform: scale(1) rotate(180deg); }
    100%     { opacity:0; transform: scale(0) rotate(270deg); }
  }

  /* CONFETTI */
  @keyframes alfie-confetti-1 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-70px) translateX(35px) rotate(360deg); opacity:0; }
  }
  @keyframes alfie-confetti-2 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-55px) translateX(-40px) rotate(-270deg); opacity:0; }
  }
  @keyframes alfie-confetti-3 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-80px) translateX(15px) rotate(180deg); opacity:0; }
  }

  /* THINK BUBBLE */
  @keyframes alfie-bubble {
    0%,40%   { opacity:0; transform: scale(0.5); }
    70%,100% { opacity:1; transform: scale(1); }
  }
`;

const ANIM_MAP = {
  idle:       'alfie-idle 3.5s ease-in-out infinite',
  wave:       'alfie-wave 2s ease-in-out infinite',
  thumbsup:   'alfie-thumbsup 2s ease-in-out infinite',
  jump:       'alfie-jump 1s cubic-bezier(0.36,0.07,0.19,0.97) infinite',
  think:      'alfie-think 3s ease-in-out infinite',
  search:     'alfie-search 2.2s ease-in-out infinite',
  point:      'alfie-point 1.8s ease-in-out infinite',
  announce:   'alfie-announce 2s ease-in-out infinite',
  travel:     'alfie-travel 2.5s ease-in-out infinite',
  realestate: 'alfie-realestate 3s ease-in-out infinite',
  dance:      'alfie-dance 0.55s ease-in-out infinite',
  talk:       'alfie-idle 2s ease-in-out infinite',
};

function Sparkles() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {['#FFD700','#00D4FF','#FF6B6B'].map((c,i) => (
        <div key={i} style={{
          position:'absolute',
          top: `${15 + i*18}%`,
          right: `${2 + i*10}%`,
          width: 10, height: 10,
          background: c,
          clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          animation: `alfie-sparkle ${0.8 + i*0.3}s ease-out ${i*0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = [
    { color:'#FFD700', anim:'alfie-confetti-1', x:'35%', y:'25%' },
    { color:'#FF6B6B', anim:'alfie-confetti-2', x:'65%', y:'20%' },
    { color:'#00D4FF', anim:'alfie-confetti-3', x:'50%', y:'15%' },
    { color:'#4ADE80', anim:'alfie-confetti-1', x:'25%', y:'35%', delay:'0.2s' },
    { color:'#A78BFA', anim:'alfie-confetti-2', x:'72%', y:'28%', delay:'0.15s' },
  ];
  return (
    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none' }}>
      {pieces.map((p,i) => (
        <div key={i} style={{
          position:'absolute', left:p.x, top:p.y,
          width:8, height:8, background:p.color, borderRadius:2,
          animation:`${p.anim} 1s ease-out ${p.delay||'0s'} infinite`,
        }} />
      ))}
    </div>
  );
}

function ThinkBubble() {
  return (
    <div style={{
      position:'absolute', top:'-15%', right:'-12%', pointerEvents:'none',
      animation:'alfie-bubble 3s ease-in-out infinite',
    }}>
      <div style={{ fontSize:24 }}>💡</div>
    </div>
  );
}

export default function AlfieCharacter({ mode = 'idle', size = 130 }) {
  const anim = ANIM_MAP[mode] || ANIM_MAP.idle;

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', position: 'relative' }}>

        {/* Effects */}
        {mode === 'thumbsup' && <Sparkles />}
        {mode === 'jump' && <Confetti />}
        {mode === 'think' && <ThinkBubble />}

        {/* Single image — whole Alfie animated cleanly */}
        <div style={{
          animation: anim,
          transformOrigin: 'bottom center',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={ALFIE_IMG}
            alt="Alfie"
            width={size}
            height={size}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,51,204,0.45)) drop-shadow(0 3px 8px rgba(0,0,0,0.3))',
              display: 'block',
            }}
          />
        </div>

        {/* Ground shadow */}
        <div style={{
          width: size * 0.5,
          height: 8,
          background: 'radial-gradient(ellipse at center, rgba(0,51,204,0.3) 0%, transparent 80%)',
          borderRadius: '50%',
          marginTop: -4,
          animation: 'alfie-shadow 3s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}