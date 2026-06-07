import React from 'react';

// Alfie - 1Market PH Mascot
// Pure CSS animated character with moving body parts

const STYLE = `
  .alfie-wrap { position: relative; width: 120px; height: 140px; cursor: pointer; user-select: none; }

  /* Body bob */
  .alfie-body-group {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    animation: alfie-bob 2.5s ease-in-out infinite;
    transform-origin: bottom center;
  }

  /* DANCE MODE */
  .alfie-wrap.dance .alfie-body-group {
    animation: alfie-dance 0.45s ease-in-out infinite !important;
  }
  .alfie-wrap.dance .alfie-paw-left {
    animation: alfie-paw-dance-l 0.45s ease-in-out infinite !important;
  }
  .alfie-wrap.dance .alfie-paw-right {
    animation: alfie-paw-dance-r 0.45s ease-in-out infinite !important;
  }
  .alfie-wrap.dance .alfie-tail {
    animation: alfie-tail-fast 0.25s ease-in-out infinite !important;
  }
  .alfie-wrap.dance .alfie-ear-left {
    animation: alfie-ear-dance 0.45s ease-in-out infinite !important;
  }
  .alfie-wrap.dance .alfie-ear-right {
    animation: alfie-ear-dance 0.45s ease-in-out infinite reverse !important;
  }

  /* WAVE MODE */
  .alfie-wrap.wave .alfie-paw-right {
    animation: alfie-wave 0.4s ease-in-out 6 !important;
  }
  .alfie-wrap.wave .alfie-tail {
    animation: alfie-tail-fast 0.3s ease-in-out infinite !important;
  }

  /* TALK MODE */
  .alfie-wrap.talk .alfie-mouth {
    animation: alfie-talk 0.25s ease-in-out infinite !important;
  }
  .alfie-wrap.talk .alfie-tail {
    animation: alfie-tail-wag 0.5s ease-in-out infinite !important;
  }

  /* Body */
  .alfie-body {
    position: absolute;
    bottom: 18px; left: 50%;
    transform: translateX(-50%);
    width: 64px; height: 62px;
    background: linear-gradient(160deg, #f5dfa0 0%, #e8c97a 100%);
    border-radius: 38px 38px 30px 30px;
    border: 2.5px solid #c9a84c;
    box-shadow: inset 0 -6px 12px rgba(0,0,0,0.1);
  }

  /* Shirt */
  .alfie-shirt {
    position: absolute;
    bottom: 0; left: -1px;
    width: 66px; height: 34px;
    background: #0033CC;
    border-radius: 0 0 28px 28px;
    border: 2px solid #0022AA;
    overflow: hidden;
  }
  .alfie-shirt-logo {
    position: absolute;
    top: 4px; left: 50%;
    transform: translateX(-50%);
    font-size: 7px;
    font-weight: 900;
    color: white;
    white-space: nowrap;
    letter-spacing: -0.3px;
    text-align: center;
    line-height: 1.1;
  }
  .alfie-shirt-logo span { color: #FFD700; }

  /* Head */
  .alfie-head {
    position: absolute;
    bottom: 72px; left: 50%;
    transform: translateX(-50%);
    width: 68px; height: 64px;
    background: linear-gradient(160deg, #fef0c0 0%, #f5dfa0 100%);
    border-radius: 50% 50% 44% 44%;
    border: 2.5px solid #c9a84c;
    box-shadow: inset 0 -4px 8px rgba(0,0,0,0.08);
    animation: alfie-headtilt 4s ease-in-out infinite;
    transform-origin: bottom center;
  }

  /* Cap */
  .alfie-cap {
    position: absolute;
    top: -14px; left: 50%;
    transform: translateX(-50%);
    width: 72px; height: 30px;
    background: #0033CC;
    border-radius: 50% 50% 0 0;
    border: 2px solid #0022AA;
  }
  .alfie-cap-brim {
    position: absolute;
    top: 14px; left: 50%;
    transform: translateX(-50%);
    width: 84px; height: 12px;
    background: #0033CC;
    border-radius: 0 0 8px 8px;
    border: 2px solid #0022AA;
  }
  .alfie-cap-logo {
    position: absolute;
    top: 3px; left: 50%;
    transform: translateX(-50%);
    font-size: 7px;
    font-weight: 900;
    color: white;
    white-space: nowrap;
  }
  .alfie-cap-logo span { color: #FFD700; }

  /* Ears */
  .alfie-ear-left {
    position: absolute;
    top: 10px; left: -14px;
    width: 22px; height: 30px;
    background: linear-gradient(160deg, #c97d3a 0%, #a86028 100%);
    border-radius: 50% 20% 50% 50%;
    border: 2px solid #8a4d20;
    animation: alfie-ear-l 4s ease-in-out infinite;
    transform-origin: top right;
  }
  .alfie-ear-right {
    position: absolute;
    top: 10px; right: -14px;
    width: 22px; height: 30px;
    background: linear-gradient(160deg, #c97d3a 0%, #a86028 100%);
    border-radius: 20% 50% 50% 50%;
    border: 2px solid #8a4d20;
    animation: alfie-ear-r 4s ease-in-out infinite;
    transform-origin: top left;
  }

  /* Eyes */
  .alfie-eye-left, .alfie-eye-right {
    position: absolute;
    top: 22px;
    width: 13px; height: 14px;
    background: #1a0a00;
    border-radius: 50%;
    border: 1.5px solid #3d1a00;
  }
  .alfie-eye-left { left: 14px; }
  .alfie-eye-right { right: 14px; }
  .alfie-eye-left::after, .alfie-eye-right::after {
    content: '';
    position: absolute;
    top: 2px; left: 3px;
    width: 5px; height: 5px;
    background: white;
    border-radius: 50%;
  }
  /* Blink */
  .alfie-eye-left, .alfie-eye-right {
    animation: alfie-blink 4s ease-in-out infinite;
  }

  /* Nose */
  .alfie-nose {
    position: absolute;
    top: 36px; left: 50%;
    transform: translateX(-50%);
    width: 14px; height: 10px;
    background: #1a0800;
    border-radius: 50%;
  }

  /* Mouth */
  .alfie-mouth {
    position: absolute;
    top: 47px; left: 50%;
    transform: translateX(-50%);
    width: 20px; height: 10px;
    border-bottom: 3px solid #8a4d20;
    border-radius: 0 0 12px 12px;
    transform-origin: top center;
  }
  /* Tongue */
  .alfie-tongue {
    position: absolute;
    top: 6px; left: 50%;
    transform: translateX(-50%);
    width: 10px; height: 8px;
    background: #e05070;
    border-radius: 0 0 6px 6px;
  }

  /* Cheek blush */
  .alfie-cheek-left, .alfie-cheek-right {
    position: absolute;
    top: 36px;
    width: 12px; height: 7px;
    background: rgba(230, 120, 100, 0.35);
    border-radius: 50%;
  }
  .alfie-cheek-left { left: 7px; }
  .alfie-cheek-right { right: 7px; }

  /* Paws */
  .alfie-paw-left {
    position: absolute;
    bottom: 22px; left: -6px;
    width: 20px; height: 28px;
    background: linear-gradient(160deg, #f5dfa0 0%, #e8c97a 100%);
    border-radius: 10px 4px 10px 10px;
    border: 2px solid #c9a84c;
    animation: alfie-paw-idle-l 2.5s ease-in-out infinite;
    transform-origin: top center;
  }
  .alfie-paw-right {
    position: absolute;
    bottom: 22px; right: -6px;
    width: 20px; height: 28px;
    background: linear-gradient(160deg, #f5dfa0 0%, #e8c97a 100%);
    border-radius: 4px 10px 10px 10px;
    border: 2px solid #c9a84c;
    animation: alfie-paw-idle-r 2.5s ease-in-out infinite;
    transform-origin: top center;
  }
  /* Paw toes */
  .alfie-paw-left::after, .alfie-paw-right::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 2px;
    width: 14px; height: 6px;
    background: #c9a84c;
    border-radius: 4px;
  }

  /* Legs */
  .alfie-leg-left, .alfie-leg-right {
    position: absolute;
    bottom: 0; 
    width: 20px; height: 22px;
    background: linear-gradient(160deg, #f5dfa0 0%, #e8c97a 100%);
    border-radius: 8px 8px 10px 10px;
    border: 2px solid #c9a84c;
  }
  .alfie-leg-left { left: 10px; }
  .alfie-leg-right { right: 10px; }
  /* Feet */
  .alfie-leg-left::after, .alfie-leg-right::after {
    content: '';
    position: absolute;
    bottom: -4px; left: -3px;
    width: 26px; height: 10px;
    background: #e8c97a;
    border: 2px solid #c9a84c;
    border-radius: 8px;
  }

  /* Tail */
  .alfie-tail {
    position: absolute;
    bottom: 28px; right: -18px;
    width: 16px; height: 30px;
    background: linear-gradient(160deg, #c97d3a 0%, #a86028 100%);
    border-radius: 8px 8px 12px 4px;
    border: 2px solid #8a4d20;
    transform-origin: bottom left;
    animation: alfie-tail-wag 1.2s ease-in-out infinite;
  }

  /* Name tag */
  .alfie-nametag {
    position: absolute;
    bottom: -22px; left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #0033CC, #2563EB);
    color: white;
    font-size: 9px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.2);
    letter-spacing: 0.5px;
  }

  /* ===== KEYFRAMES ===== */
  @keyframes alfie-bob {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(-5px); }
  }
  @keyframes alfie-headtilt {
    0%, 100% { transform: translateX(-50%) rotate(0deg); }
    25%       { transform: translateX(-50%) rotate(3deg); }
    75%       { transform: translateX(-50%) rotate(-3deg); }
  }
  @keyframes alfie-ear-l {
    0%, 100% { transform: rotate(0deg); }
    40%       { transform: rotate(8deg); }
    70%       { transform: rotate(-5deg); }
  }
  @keyframes alfie-ear-r {
    0%, 100% { transform: rotate(0deg); }
    40%       { transform: rotate(-8deg); }
    70%       { transform: rotate(5deg); }
  }
  @keyframes alfie-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95%           { transform: scaleY(0.1); }
  }
  @keyframes alfie-paw-idle-l {
    0%, 100% { transform: rotate(0deg); }
    50%       { transform: rotate(-6deg); }
  }
  @keyframes alfie-paw-idle-r {
    0%, 100% { transform: rotate(0deg); }
    50%       { transform: rotate(6deg); }
  }
  @keyframes alfie-tail-wag {
    0%, 100% { transform: rotate(-10deg); }
    50%       { transform: rotate(20deg); }
  }
  @keyframes alfie-tail-fast {
    0%, 100% { transform: rotate(-20deg); }
    50%       { transform: rotate(30deg); }
  }
  @keyframes alfie-talk {
    0%, 100% { transform: translateX(-50%) scaleY(1); }
    50%       { transform: translateX(-50%) scaleY(1.6) translateY(2px); }
  }

  /* Wave — right paw goes up and swings */
  @keyframes alfie-wave {
    0%   { transform: rotate(0deg) translateY(0); }
    20%  { transform: rotate(-60deg) translateY(-18px); }
    40%  { transform: rotate(-40deg) translateY(-14px); }
    60%  { transform: rotate(-65deg) translateY(-20px); }
    80%  { transform: rotate(-35deg) translateY(-12px); }
    100% { transform: rotate(0deg) translateY(0); }
  }

  /* Dance */
  @keyframes alfie-dance {
    0%   { transform: translateX(-50%) rotate(0deg) scaleX(1); }
    15%  { transform: translateX(calc(-50% - 6px)) rotate(-8deg) scaleX(1.05); }
    30%  { transform: translateX(calc(-50% + 6px)) rotate(8deg) scaleX(0.96); }
    45%  { transform: translateX(calc(-50% - 5px)) rotate(-6deg) scaleX(1.04); }
    60%  { transform: translateX(calc(-50% + 5px)) rotate(6deg) scaleX(0.97); }
    75%  { transform: translateX(calc(-50% - 3px)) rotate(-4deg) scaleX(1.02); }
    90%  { transform: translateX(calc(-50% + 3px)) rotate(4deg) scaleX(0.99); }
    100% { transform: translateX(-50%) rotate(0deg) scaleX(1); }
  }
  @keyframes alfie-paw-dance-l {
    0%, 100% { transform: rotate(20deg) translateY(-8px); }
    50%       { transform: rotate(-20deg) translateY(-16px); }
  }
  @keyframes alfie-paw-dance-r {
    0%, 100% { transform: rotate(-20deg) translateY(-8px); }
    50%       { transform: rotate(20deg) translateY(-16px); }
  }
  @keyframes alfie-ear-dance {
    0%, 100% { transform: rotate(0deg); }
    50%       { transform: rotate(20deg); }
  }
`;

export default function AlfieCharacter({ mode = 'idle' }) {
  // mode: 'idle' | 'wave' | 'dance' | 'talk'
  return (
    <>
      <style>{STYLE}</style>
      <div className={`alfie-wrap ${mode !== 'idle' ? mode : ''}`}>
        <div className="alfie-body-group">

          {/* TAIL */}
          <div className="alfie-tail" />

          {/* BODY */}
          <div className="alfie-body">
            <div className="alfie-shirt">
              <div className="alfie-shirt-logo">1M™<br /><span>PH</span></div>
            </div>
            {/* Left paw */}
            <div className="alfie-paw-left" />
            {/* Right paw */}
            <div className="alfie-paw-right" />
          </div>

          {/* LEGS */}
          <div className="alfie-leg-left" />
          <div className="alfie-leg-right" />

          {/* HEAD */}
          <div className="alfie-head">
            {/* Cap */}
            <div className="alfie-cap">
              <div className="alfie-cap-logo">1M<span>™</span></div>
            </div>
            <div className="alfie-cap-brim" />

            {/* Ears */}
            <div className="alfie-ear-left" />
            <div className="alfie-ear-right" />

            {/* Face */}
            <div className="alfie-eye-left" />
            <div className="alfie-eye-right" />
            <div className="alfie-cheek-left" />
            <div className="alfie-cheek-right" />
            <div className="alfie-nose" />
            <div className="alfie-mouth">
              <div className="alfie-tongue" />
            </div>
          </div>

          {/* Name tag */}
          <div className="alfie-nametag">🐾 Alfie</div>
        </div>
      </div>
    </>
  );
}