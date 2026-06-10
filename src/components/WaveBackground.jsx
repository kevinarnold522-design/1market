import React, { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Simplified wave configuration for better performance
    const waves = [];
    const WAVE_COUNT = 3;
    
    for (let i = 0; i < WAVE_COUNT; i++) {
      waves.push({
        y: canvas.height / 2 + i * 100,
        amplitude: 40 + i * 20,
        wavelength: 0.0015 + i * 0.0008,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + i * 0.001, // Much slower wave speed
        opacity: 0.08 + (WAVE_COUNT - i) * 0.06,
      });
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background - royal blue theme
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0033CC');
      gradient.addColorStop(0.5, '#002399');
      gradient.addColorStop(1, '#001a80');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x < canvas.width; x += 10) {
          const y = wave.y + Math.sin(x * wave.wavelength + wave.phase + time * wave.speed) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude * 2);
        waveGradient.addColorStop(0, `rgba(37, 99, 235, ${wave.opacity})`);
        waveGradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
        
        ctx.fillStyle = waveGradient;
        ctx.fill();

        wave.phase += wave.speed;
      });

      time += 0.15; // Much slower time progression
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}