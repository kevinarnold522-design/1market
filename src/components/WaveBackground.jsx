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

    // Royal blue color palette
    const ROYAL_BLUE = [[37, 99, 235], [59, 130, 246], [96, 165, 250], [147, 197, 253]];
    const DEEP_BLUE = [[30, 58, 138], [37, 99, 235], [59, 130, 246]];
    
    // Wave configuration
    const waves = [];
    const WAVE_COUNT = 5;
    
    for (let i = 0; i < WAVE_COUNT; i++) {
      waves.push({
        y: canvas.height / 2 + i * 80,
        amplitude: 30 + Math.random() * 20,
        wavelength: 0.003 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02,
        color: ROYAL_BLUE[i % ROYAL_BLUE.length],
        opacity: 0.15 + (WAVE_COUNT - i) * 0.08,
      });
    }

    // Particle system for glow effects
    const particles = [];
    const PARTICLE_COUNT = 50;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(7, 15, 26, 1)');
      gradient.addColorStop(0.5, 'rgba(10, 25, 64, 1)');
      gradient.addColorStop(1, 'rgba(0, 51, 204, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + 
            Math.sin(x * wave.wavelength + wave.phase + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.wavelength * 0.5 + wave.phase * 2 + time * wave.speed * 0.5) * (wave.amplitude * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Create gradient for wave
        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude * 2);
        const [r, g, b] = wave.color;
        waveGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wave.opacity})`);
        waveGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // Update wave phase
        wave.phase += wave.speed;
      });

      // Draw particles with glow
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += 0.02;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulsing opacity
        const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));

        // Draw glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        );
        glowGradient.addColorStop(0, `rgba(37, 99, 235, ${pulseOpacity * 0.6})`);
        glowGradient.addColorStop(0.5, `rgba(59, 130, 246, ${pulseOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${pulseOpacity})`;
        ctx.fill();
      });

      time += 1;
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