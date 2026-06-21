import React, { useState, useEffect, useRef } from 'react';
import { ALFIE_FRAMES } from '@/lib/brandAssets';

const FRAMES = ALFIE_FRAMES;

// How long each frame stays visible (ms) before crossfading to the next
// Frames with action (wave, thumbsup) hold a bit longer for effect
const FRAME_DURATIONS = [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000];

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
              filter: 'drop-shadow(0 8px 22px rgba(0,51,204,0.5))',
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
                filter: 'drop-shadow(0 8px 22px rgba(0,51,204,0.5))',
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