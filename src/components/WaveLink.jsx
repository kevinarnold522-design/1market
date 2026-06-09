import React from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerWave } from '@/lib/waveTransition';

export default function WaveLink({ to, children, className, style, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    triggerWave(() => navigate(to), 480);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}