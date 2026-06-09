/**
 * Global CSS injection for pinkish-red glow on all interactive elements.
 * Import this once at the app level.
 */
import { useEffect } from 'react';

export default function GlowInteraction() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'glow-interaction-style';
    style.textContent = `
      button:active, a:active,
      [role="button"]:active,
      button:focus-visible, a:focus-visible {
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(255,45,85,0.5), 0 0 14px rgba(255,45,85,0.45) !important;
        transition: box-shadow 0.1s ease !important;
      }
      button:hover, a:hover, [role="button"]:hover {
        filter: drop-shadow(0 0 5px rgba(255,45,85,0.35));
        transition: filter 0.15s ease;
      }
      /* Prevent filter on images inside buttons */
      button:hover img, a:hover img {
        filter: none;
      }
    `;
    if (!document.getElementById('glow-interaction-style')) {
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById('glow-interaction-style');
      if (el) el.remove();
    };
  }, []);
  return null;
}