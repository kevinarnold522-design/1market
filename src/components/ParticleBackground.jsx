import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ORANGE = [[255, 120, 30], [255, 160, 60], [255, 90, 10]];
    const BLUE   = [[30, 120, 255], [0, 180, 255], [60, 90, 240]];
    const COUNT  = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 60);

    const rand = (min, max) => Math.random() * (max - min) + min;

    const particles = Array.from({ length: COUNT }, () => {
      const isOrange = Math.random() > 0.45;
      const palette = isOrange ? ORANGE : BLUE;
      const color = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: rand(0, canvas.width),
        y: rand(-canvas.height, canvas.height),
        r: rand(1.2, 4.5),
        speed: rand(0.4, 1.8),
        opacity: rand(0.15, 0.7),
        twinkle: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.008, 0.025),
        drift: rand(-0.3, 0.3),
        color,
        glow: Math.random() > 0.65,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.twinkle += p.twinkleSpeed;

        if (p.y > canvas.height + 10) {
          p.y = -rand(5, 30);
          p.x = rand(0, canvas.width);
        }
        if (p.x < -10) p.x = canvas.width + 5;
        if (p.x > canvas.width + 10) p.x = -5;

        const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.twinkle));
        const [r, g, b] = p.color;

        if (p.glow && p.r > 2) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.4})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.35 }}
    />
  );
}