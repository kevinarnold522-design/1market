import React, { useEffect, useMemo, useState } from 'react';

const BUBBLE_COUNT = 18;

function buildBubbles() {
    return Array.from({ length: BUBBLE_COUNT }, (_, index) => ({
        size: 8 + (index % 5) * 2,
        left: `${(index * 8 + (index % 3) * 4) % 92}%`,
        delay: (index % 8) * 0.24,
        duration: 8 + (index % 6),
        drift: (index % 2 === 0 ? -1 : 1) * (8 + (index % 4) * 2),
    }));
}

export default function BubbleBackground() {
    const [shouldRender, setShouldRender] = useState(false);
    const bubbles = useMemo(buildBubbles, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const coarse = window.matchMedia('(pointer: coarse), (max-width: 900px)');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const update = () => setShouldRender(!coarse.matches && !reduceMotion.matches);
        update();

        if (typeof coarse.addEventListener === 'function') {
            coarse.addEventListener('change', update);
        } else {
            coarse.addListener(update);
        }

        if (typeof reduceMotion.addEventListener === 'function') {
            reduceMotion.addEventListener('change', update);
        } else {
            reduceMotion.addListener(update);
        }

        return () => {
            if (typeof coarse.removeEventListener === 'function') {
                coarse.removeEventListener('change', update);
            } else {
                coarse.removeListener(update);
            }
            if (typeof reduceMotion.removeEventListener === 'function') {
                reduceMotion.removeEventListener('change', update);
            } else {
                reduceMotion.removeListener(update);
            }
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
            {bubbles.map((bubble, index) => (
                <div
                    key={index}
                    className="absolute rounded-full border border-white/25 bg-white/10 shadow-[inset_0_1px_6px_rgba(255,255,255,0.45),0_0_10px_rgba(186,230,253,0.2)] backdrop-blur-[0.75px] animate-bubble-float"
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: bubble.left,
                        bottom: -bubble.size,
                        animationDelay: `${bubble.delay}s`,
                        animationDuration: `${bubble.duration}s`,
                        '--bubble-drift': `${bubble.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}
