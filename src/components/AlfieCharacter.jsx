import React, { useState, useEffect, useRef } from 'react';

// All 8 Alfie frames in animation order:
// 1. Standing neutral (idle)
// 2. Standing smile (happy idle)
// 3. Eyes closed big smile (laughing)
// 4. Waving paw up, wink (wave)
// 5. Eyes closed laughing, hands down (joy)
// 6. Waving paw high, eyes closed (big wave)
// 7. Thumbs up, sparkle (thumbsup)
// 8. Waving paw, eyes closed, big smile (celebrate)
const FRAMES = [
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/db47fb0b8_5C2B4377-0629-406D-97F0-9485947B48FD.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/59913a8f1_B0D72D03-6E30-48C7-BC36-E922BC2424DB.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/598a64603_B0D72D03-6E30-48C7-BC36-E922BC2424DB.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/79b6c8a01_4848A205-DA22-4ADC-B0C7-BB747B610F6F.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/5d8272dac_4848A205-DA22-4ADC-B0C7-BB747B610F6F.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/d27b788a4_4848A205-DA22-4ADC-B0C7-BB747B610F6F.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/2a71be013_4848A205-DA22-4ADC-B0C7-BB747B610F6F.jpeg',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/3b40eefd4_4848A205-DA22-4ADC-B0C7-BB747B610F6F.jpeg',
];

// How long each frame stays visible (ms) before crossfading to the next
// Frames with action (wave, thumbsup) hold a bit longer for effect
const FRAME_DURATIONS = [3200, 3000, 3000, 3500, 3000, 3500, 3200, 3000];

// Crossfade duration (ms)
const FADE_MS = 350;

const STYLE = `
  @keyframes alfie-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes alfie-shadow {
    0%,100% { transform: scaleX(1); opacity: 0.28; }
    50%      { transform: scaleX(0.65); opacity: 0.1; }
  }
  @keyframes alfie-sparkle {
    0%       { opacity:0; transform: scale(0) rotate(0deg); }
    30%      { opacity:1; transform: scale(1.4) rotate(90deg); }
    70%      { opacity:0.8; transform: scale(1) rotate(180deg); }
    100%     { opacity:0; transform: scale(0) rotate(270deg); }
  }
`;

export default function AlfieCharacter({ mode = 'idle', size = 130 }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [nextFrame, setNextFrame] = useState(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Preload all frames
    FRAMES.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    const scheduleNext = (frameIndex) => {
      const duration = FRAME_DURATIONS[frameIndex];
      timerRef.current = setTimeout(() => {
        const next = (frameIndex + 1) % FRAMES.length;
        setNextFrame(next);
        setFading(true);

        // After fade completes, commit the new frame
        setTimeout(() => {
          setCurrentFrame(next);
          setNextFrame(null);
          setFading(false);
          scheduleNext(next);
        }, FADE_MS);
      }, duration);
    };

    scheduleNext(currentFrame);
    return () => clearTimeout(timerRef.current);
  }, []); // run once on mount

  const imgStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    // Use mix-blend-mode on a white backdrop to knock out white bg
  };

  return (
    <>
      <style>{STYLE}</style>
      <div style={{
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        position: 'relative',
      }}>

        {/* Sparkle on thumbsup frame (frame index 6) */}
        {currentFrame === 6 && (
          <div style={{ position: 'absolute', top: '5%', right: '0%', pointerEvents: 'none', zIndex: 10 }}>
            {['#FFD700', '#00D4FF'].map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: i * 18,
                right: i * 10,
                width: 10, height: 10,
                background: c,
                clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                animation: `alfie-sparkle ${0.8 + i * 0.3}s ease-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}

        {/* Character frame container — gentle float */}
        <div style={{
          position: 'relative',
          width: size,
          height: size,
          animation: 'alfie-float 3s ease-in-out infinite',
          willChange: 'transform',
        }}>
          {/* Current frame — CSS filter removes white JPEG background */}
          <img
            src={FRAMES[currentFrame]}
            alt="Alfie"
            style={{
              ...imgStyle,
              opacity: fading ? 0 : 1,
              transition: fading ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
              filter: 'drop-shadow(0 8px 18px rgba(0,51,204,0.45)) brightness(1.05) contrast(1.1)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Next frame fading in */}
          {nextFrame !== null && (
            <img
              src={FRAMES[nextFrame]}
              alt=""
              aria-hidden="true"
              style={{
                ...imgStyle,
                opacity: fading ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
                filter: 'drop-shadow(0 8px 18px rgba(0,51,204,0.45)) brightness(1.05) contrast(1.1)',
                mixBlendMode: 'screen',
              }}
            />
          )}
        </div>

        {/* Ground shadow */}
        <div style={{
          width: size * 0.5,
          height: 7,
          background: 'radial-gradient(ellipse at center, rgba(0,51,204,0.28) 0%, transparent 80%)',
          borderRadius: '50%',
          marginTop: -4,
          animation: 'alfie-shadow 3s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}