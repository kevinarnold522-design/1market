import React, { useEffect, useRef } from 'react';

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = window.innerWidth;
    let h = document.documentElement.scrollHeight;

    const resize = () => {
      w = window.innerWidth;
      h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const NUM = Math.floor((w * h) / 8000);
    const stars = Array.from({ length: Math.min(NUM, 220) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.6 + 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.7 ? '#00D4FF' : Math.random() > 0.5 ? '#2563EB' : '#ffffff',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.y += s.speed;
        s.twinkle += s.twinkleSpeed;
        if (s.y > h) { s.y = -4; s.x = Math.random() * w; }

        const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color === '#00D4FF'
          ? `rgba(0,212,255,${alpha})`
          : s.color === '#2563EB'
          ? `rgba(37,99,235,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();

        // glow for cyan stars
        if (s.color === '#00D4FF' && s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
          grad.addColorStop(0, `rgba(0,212,255,${alpha * 0.3})`);
          grad.addColorStop(1, 'rgba(0,212,255,0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
    />
  );
}