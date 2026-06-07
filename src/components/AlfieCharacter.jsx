import React from 'react';

// Alfie image extracted from the "How to Start Listing" guide — clean dog only
const ALFIE_IMG = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e22f4e4dc_9155B165-D5F9-489D-A2B8-C887F8AD2ED7.png';

// ─── All Keyframe Definitions ──────────────────────────────────────────────
const STYLE = `
  /* ── IDLE: gentle breathing + tiny sway ── */
  @keyframes alfie-body-idle {
    0%,100% { transform: translateY(0px) scaleY(1) rotate(0deg); }
    30%      { transform: translateY(-3px) scaleY(1.01) rotate(0.5deg); }
    60%      { transform: translateY(-1px) scaleY(0.99) rotate(-0.3deg); }
  }
  @keyframes alfie-head-idle {
    0%,100% { transform: rotate(0deg) translateY(0px); }
    40%      { transform: rotate(1.5deg) translateY(-1px); }
    70%      { transform: rotate(-1deg) translateY(0px); }
  }

  /* ── WAVE: body stays, head nods, whole image rises then paw simulated by skew ── */
  @keyframes alfie-body-wave {
    0%         { transform: translateY(0px) rotate(0deg); }
    10%        { transform: translateY(-8px) rotate(-2deg); }
    20%,80%    { transform: translateY(-12px) rotate(0deg); }
    30%        { transform: translateY(-10px) rotate(2deg); }
    40%        { transform: translateY(-14px) rotate(-1.5deg); }
    50%        { transform: translateY(-12px) rotate(1.5deg); }
    60%        { transform: translateY(-10px) rotate(-2deg); }
    70%        { transform: translateY(-8px) rotate(1deg); }
    90%        { transform: translateY(-4px) rotate(-0.5deg); }
    100%       { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes alfie-head-wave {
    0%,100%  { transform: rotate(0deg); }
    25%      { transform: rotate(-8deg); }
    50%      { transform: rotate(6deg); }
    75%      { transform: rotate(-5deg); }
  }
  @keyframes alfie-paw-wave {
    0%,100%  { transform: rotate(0deg) translateX(0px); }
    15%      { transform: rotate(-30deg) translateX(6px) translateY(-8px); }
    30%      { transform: rotate(20deg) translateX(10px) translateY(-14px); }
    45%      { transform: rotate(-25deg) translateX(7px) translateY(-10px); }
    60%      { transform: rotate(18deg) translateX(10px) translateY(-13px); }
    75%      { transform: rotate(-20deg) translateX(6px) translateY(-8px); }
    90%      { transform: rotate(5deg) translateX(2px) translateY(-3px); }
  }

  /* ── THUMBSUP ── */
  @keyframes alfie-body-thumbsup {
    0%,100%  { transform: translateY(0px) rotate(0deg); }
    25%      { transform: translateY(-6px) rotate(-1deg); }
    50%      { transform: translateY(-4px) rotate(1deg); }
    75%      { transform: translateY(-7px) rotate(-0.5deg); }
  }
  @keyframes alfie-thumbsup-paw {
    0%       { transform: rotate(0deg) translateY(0px) translateX(0px); }
    20%      { transform: rotate(-40deg) translateY(-15px) translateX(8px); }
    40%,80%  { transform: rotate(-35deg) translateY(-18px) translateX(10px); }
    60%      { transform: rotate(-38deg) translateY(-20px) translateX(9px) scale(1.1); }
    100%     { transform: rotate(0deg) translateY(0px) translateX(0px); }
  }

  /* ── POINT ── */
  @keyframes alfie-body-point {
    0%,100%  { transform: rotate(0deg) translateY(0px); }
    30%      { transform: rotate(-4deg) translateY(-5px); }
    60%      { transform: rotate(2deg) translateY(-3px); }
  }
  @keyframes alfie-point-paw {
    0%,100%  { transform: rotate(0deg) translateX(0px) translateY(0px); }
    20%      { transform: rotate(25deg) translateX(14px) translateY(-4px); }
    40%      { transform: rotate(20deg) translateX(18px) translateY(-2px); }
    60%      { transform: rotate(25deg) translateX(14px) translateY(-4px); }
    80%      { transform: rotate(20deg) translateX(18px) translateY(-2px); }
  }

  /* ── JUMP / CELEBRATION ── */
  @keyframes alfie-body-jump {
    0%       { transform: translateY(0px) scaleY(1) scaleX(1); }
    10%      { transform: translateY(2px) scaleY(0.88) scaleX(1.1); }
    25%      { transform: translateY(-28px) scaleY(1.08) scaleX(0.96); }
    40%      { transform: translateY(0px) scaleY(0.85) scaleX(1.12); }
    48%      { transform: translateY(-20px) scaleY(1.05) scaleX(0.97); }
    60%      { transform: translateY(0px) scaleY(0.9) scaleX(1.08); }
    70%,100% { transform: translateY(0px) scaleY(1) scaleX(1); }
  }
  @keyframes alfie-head-jump {
    0%,100%  { transform: rotate(0deg); }
    25%      { transform: rotate(-10deg); }
    40%      { transform: rotate(5deg); }
    55%      { transform: rotate(-8deg); }
  }

  /* ── THINK ── */
  @keyframes alfie-body-think {
    0%,100%  { transform: translateY(0px) rotate(0deg); }
    40%      { transform: translateY(-4px) rotate(-3deg); }
    70%      { transform: translateY(-2px) rotate(2deg); }
  }
  @keyframes alfie-head-think {
    0%,30%   { transform: rotate(0deg) translateY(0px); }
    50%,100% { transform: rotate(12deg) translateY(-5px); }
  }
  @keyframes alfie-scratch {
    0%,100%  { transform: rotate(0deg) translateX(0px) translateY(0px); }
    20%      { transform: rotate(-20deg) translateX(-8px) translateY(-12px); }
    35%      { transform: rotate(-15deg) translateX(-10px) translateY(-10px); }
    50%      { transform: rotate(-22deg) translateX(-7px) translateY(-13px); }
    65%      { transform: rotate(-16deg) translateX(-9px) translateY(-11px); }
    80%      { transform: rotate(-10deg) translateX(-5px) translateY(-6px); }
  }

  /* ── SEARCH ── */
  @keyframes alfie-body-search {
    0%,100%  { transform: translateX(0px) rotate(0deg); }
    25%      { transform: translateX(-6px) rotate(-2deg); }
    50%      { transform: translateX(6px) rotate(2deg); }
    75%      { transform: translateX(-4px) rotate(-1deg); }
  }
  @keyframes alfie-head-search {
    0%       { transform: rotate(-5deg); }
    25%      { transform: rotate(-12deg); }
    50%      { transform: rotate(8deg); }
    75%      { transform: rotate(-6deg); }
    100%     { transform: rotate(-5deg); }
  }

  /* ── ANNOUNCE (megaphone) ── */
  @keyframes alfie-body-announce {
    0%,100%  { transform: translateY(0px) rotate(0deg) scaleX(1); }
    20%      { transform: translateY(-5px) rotate(-2deg) scaleX(1.01); }
    40%      { transform: translateY(-3px) rotate(1.5deg) scaleX(0.99); }
    60%      { transform: translateY(-6px) rotate(-1deg) scaleX(1.01); }
    80%      { transform: translateY(-4px) rotate(2deg) scaleX(0.99); }
  }
  @keyframes alfie-head-announce {
    0%,100%  { transform: rotate(0deg) scaleX(1); }
    25%      { transform: rotate(-4deg) scaleX(1.02); }
    50%      { transform: rotate(3deg) scaleX(0.98); }
    75%      { transform: rotate(-3deg) scaleX(1.01); }
  }

  /* ── TRAVEL ── */
  @keyframes alfie-body-travel {
    0%,100%  { transform: translateY(0px) rotate(0deg); }
    20%      { transform: translateY(-10px) rotate(-3deg); }
    40%      { transform: translateY(-6px) rotate(2deg); }
    60%      { transform: translateY(-12px) rotate(-2deg); }
    80%      { transform: translateY(-7px) rotate(3deg); }
  }
  @keyframes alfie-head-travel {
    0%,100%  { transform: rotate(0deg) translateX(0px); }
    30%      { transform: rotate(-6deg) translateX(-3px); }
    60%      { transform: rotate(4deg) translateX(3px); }
  }

  /* ── REAL ESTATE ── */
  @keyframes alfie-body-realestate {
    0%,100%  { transform: translateY(0px) rotate(0deg); }
    35%      { transform: translateY(-6px) rotate(-2deg); }
    70%      { transform: translateY(-4px) rotate(1.5deg); }
  }

  /* ── DANCE ── */
  @keyframes alfie-body-dance {
    0%   { transform: translateY(0px) rotate(0deg) scaleX(1); }
    12%  { transform: translateY(-16px) rotate(-9deg) scaleX(1.05); }
    25%  { transform: translateY(-6px) rotate(9deg) scaleX(0.96); }
    37%  { transform: translateY(-20px) rotate(-10deg) scaleX(1.06); }
    50%  { transform: translateY(-8px) rotate(10deg) scaleX(0.95); }
    62%  { transform: translateY(-18px) rotate(-8deg) scaleX(1.05); }
    75%  { transform: translateY(-4px) rotate(8deg) scaleX(0.97); }
    87%  { transform: translateY(-12px) rotate(-5deg) scaleX(1.03); }
    100% { transform: translateY(0px) rotate(0deg) scaleX(1); }
  }
  @keyframes alfie-head-dance {
    0%,100%  { transform: rotate(0deg); }
    20%      { transform: rotate(12deg); }
    40%      { transform: rotate(-10deg); }
    60%      { transform: rotate(8deg); }
    80%      { transform: rotate(-6deg); }
  }

  /* ── SHADOW pulse ── */
  @keyframes alfie-shadow {
    0%,100% { transform: scaleX(1); opacity: 0.3; }
    50%      { transform: scaleX(0.65); opacity: 0.12; }
  }

  /* ── TAIL WAG (applied via filter hue trick on a pseudo overlay) ── */
  @keyframes alfie-tail {
    0%,100%  { transform: rotate(0deg) translateX(0px); }
    20%      { transform: rotate(12deg) translateX(3px); }
    40%      { transform: rotate(-10deg) translateX(-3px); }
    60%      { transform: rotate(10deg) translateX(3px); }
    80%      { transform: rotate(-8deg) translateX(-2px); }
  }

  /* ── SPARKLE ── */
  @keyframes alfie-sparkle {
    0%       { opacity:0; transform: scale(0) rotate(0deg); }
    30%      { opacity:1; transform: scale(1.4) rotate(90deg); }
    70%      { opacity:0.8; transform: scale(1) rotate(180deg); }
    100%     { opacity:0; transform: scale(0) rotate(270deg); }
  }
  @keyframes alfie-confetti-1 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-60px) translateX(30px) rotate(360deg); opacity:0; }
  }
  @keyframes alfie-confetti-2 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-50px) translateX(-35px) rotate(-270deg); opacity:0; }
  }
  @keyframes alfie-confetti-3 {
    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-70px) translateX(10px) rotate(180deg); opacity:0; }
  }
  @keyframes alfie-bulb {
    0%,60%  { opacity:0; transform: scale(0.5) translateY(4px); }
    80%     { opacity:1; transform: scale(1.2) translateY(-2px); }
    100%    { opacity:1; transform: scale(1) translateY(0px); }
  }
  @keyframes alfie-bubble {
    0%,40%   { opacity:0; transform: scale(0.5); }
    70%,100% { opacity:1; transform: scale(1); }
  }
`;

// ─── Compose animation style per mode ────────────────────────────────────────
function getBodyAnim(mode) {
  const map = {
    idle:       'alfie-body-idle 3s ease-in-out infinite',
    wave:       'alfie-body-wave 2.5s ease-in-out 1 forwards',
    thumbsup:   'alfie-body-thumbsup 2s ease-in-out infinite',
    point:      'alfie-body-point 2.5s ease-in-out infinite',
    jump:       'alfie-body-jump 1.2s cubic-bezier(0.36,0.07,0.19,0.97) 2',
    think:      'alfie-body-think 3s ease-in-out infinite',
    search:     'alfie-body-search 2s ease-in-out infinite',
    announce:   'alfie-body-announce 1.8s ease-in-out infinite',
    travel:     'alfie-body-travel 2s ease-in-out infinite',
    realestate: 'alfie-body-realestate 3s ease-in-out infinite',
    dance:      'alfie-body-dance 0.5s ease-in-out infinite',
    talk:       'alfie-body-idle 1.8s ease-in-out infinite',
  };
  return map[mode] || map.idle;
}

function getHeadAnim(mode) {
  const map = {
    idle:       'alfie-head-idle 4s ease-in-out infinite',
    wave:       'alfie-head-wave 2.5s ease-in-out infinite',
    thumbsup:   'alfie-head-idle 2s ease-in-out infinite',
    point:      'alfie-head-search 2s ease-in-out infinite',
    jump:       'alfie-head-jump 1.2s ease-in-out 2',
    think:      'alfie-head-think 3s ease-in-out infinite',
    search:     'alfie-head-search 2s ease-in-out infinite',
    announce:   'alfie-head-announce 1.8s ease-in-out infinite',
    travel:     'alfie-head-travel 2s ease-in-out infinite',
    realestate: 'alfie-head-idle 3s ease-in-out infinite',
    dance:      'alfie-head-dance 0.5s ease-in-out infinite',
    talk:       'alfie-head-idle 1.2s ease-in-out infinite',
  };
  return map[mode] || map.idle;
}

function getPawAnim(mode) {
  const map = {
    wave:       'alfie-paw-wave 2.5s ease-in-out infinite',
    thumbsup:   'alfie-thumbsup-paw 2s ease-in-out 1 forwards',
    point:      'alfie-point-paw 1.2s ease-in-out infinite',
    think:      'alfie-scratch 2s ease-in-out infinite',
  };
  return map[mode] || null;
}

// ─── Overlay Effects ──────────────────────────────────────────────────────────
function Sparkles() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {['#FFD700','#00D4FF','#FF6B6B'].map((c,i) => (
        <div key={i} style={{
          position:'absolute',
          top: `${20 + i*20}%`,
          right: `${5 + i*8}%`,
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
    { color:'#FFD700', anim:'alfie-confetti-1', x:'40%', y:'20%' },
    { color:'#FF6B6B', anim:'alfie-confetti-2', x:'60%', y:'25%' },
    { color:'#00D4FF', anim:'alfie-confetti-3', x:'50%', y:'15%' },
    { color:'#4ADE80', anim:'alfie-confetti-1', x:'30%', y:'30%', delay:'0.2s' },
    { color:'#A78BFA', anim:'alfie-confetti-2', x:'70%', y:'20%', delay:'0.15s' },
  ];
  return (
    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none' }}>
      {pieces.map((p,i) => (
        <div key={i} style={{
          position:'absolute', left:p.x, top:p.y,
          width:8, height:8,
          background:p.color,
          borderRadius:2,
          animation:`${p.anim} 1s ease-out ${p.delay||'0s'} infinite`,
        }} />
      ))}
    </div>
  );
}

function ThinkBubble() {
  return (
    <div style={{ position:'absolute', top:'-10%', right:'-10%', pointerEvents:'none',
      animation:'alfie-bubble 3s ease-in-out infinite' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
        <div style={{ fontSize:22 }}>💡</div>
        <div style={{
          width:32, height:32, borderRadius:'50%',
          border:'2px dashed rgba(255,215,0,0.7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(255,255,255,0.08)',
          fontSize:14,
        }}>❓</div>
        <div style={{ display:'flex', gap:2, marginTop:2 }}>
          {[6,4,3].map((s,i) => (
            <div key={i} style={{ width:s, height:s, borderRadius:'50%', background:'rgba(255,215,0,0.5)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AlfieCharacter({ mode = 'idle', size = 130 }) {
  const bodyAnim = getBodyAnim(mode);
  const headAnim = getHeadAnim(mode);
  const pawAnim  = getPawAnim(mode);

  // For the head-tilt effect, we split the image rendering into layers:
  // Layer 1: full image with body animation (translateY, scale, rotate of whole body)
  // Layer 2: clipped top portion (head area) with separate head rotation
  // This creates the illusion of independent body-part movement.

  const headClipTop = 0;
  const headClipBottom = size * 0.48; // roughly top 48% = head area
  const bodyClipTop = size * 0.35;    // overlap by ~13% for seamless blend

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', position: 'relative' }}>

        {/* ── Effect Overlays ── */}
        {(mode === 'thumbsup') && <Sparkles />}
        {(mode === 'jump') && <Confetti />}
        {(mode === 'think') && <ThinkBubble />}

        {/* ── Character Container ── */}
        <div style={{ position: 'relative', width: size, height: size }}>

          {/* BODY LAYER — full image, body animation */}
          <div
            style={{
              position: 'absolute', inset: 0,
              animation: bodyAnim,
              transformOrigin: 'bottom center',
            }}
          >
            <img
              src={ALFIE_IMG}
              alt="Alfie"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 28px rgba(0,51,204,0.5)) drop-shadow(0 3px 6px rgba(0,0,0,0.35))',
                imageRendering: 'crisp-edges',
              }}
            />
          </div>

          {/* HEAD LAYER — clipped top portion, independent head tilt */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: headClipBottom,
              overflow: 'hidden',
              animation: bodyAnim, // also follows body
              transformOrigin: 'bottom center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                animation: headAnim,
                transformOrigin: '50% 60%', // pivot around neck area
              }}
            >
              <img
                src={ALFIE_IMG}
                alt=""
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  imageRendering: 'crisp-edges',
                  filter: 'drop-shadow(0 10px 28px rgba(0,51,204,0.5))',
                }}
              />
            </div>
          </div>

          {/* PAW LAYER — clipped right-side arm area for wave/point/thumbsup */}
          {pawAnim && (
            <div
              style={{
                position: 'absolute',
                top: size * 0.3,
                right: 0,
                width: size * 0.55,
                height: size * 0.5,
                overflow: 'hidden',
                animation: bodyAnim,
                transformOrigin: 'bottom center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: size,
                  height: size,
                  animation: pawAnim,
                  transformOrigin: '20% 20%',
                }}
              >
                <img
                  src={ALFIE_IMG}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -(size * 0.3),
                    right: 0,
                    width: size,
                    height: size,
                    objectFit: 'contain',
                    imageRendering: 'crisp-edges',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Ground Shadow */}
        <div
          style={{
            width: size * 0.55,
            height: 10,
            background: 'radial-gradient(ellipse at center, rgba(0,51,204,0.35) 0%, transparent 80%)',
            borderRadius: '50%',
            marginTop: -6,
            animation: 'alfie-shadow 2.8s ease-in-out infinite',
          }}
        />
      </div>
    </>
  );
}