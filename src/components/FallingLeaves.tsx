import type { CSSProperties } from 'react';

const COLORS = ['#b68d60', '#5a4638', '#4e644a'];

// Fixed values so leaves land in the same spots on every render. Negative delays start them mid-fall.
const LEAVES = Array.from({ length: 10 }, (_, i) => ({
  x: `${(i * 37 + 7) % 100}%`,
  size: `${16 + ((i * 7) % 14)}px`,
  duration: `${12 + ((i * 5) % 11)}s`,
  delay: `-${(i * 2.3) % 18}s`,
  color: COLORS[i % COLORS.length],
  opacity: 0.35 + ((i * 3) % 6) * 0.05,
}));

export function FallingLeaves() {
  const saveData = typeof navigator !== 'undefined' && (navigator as any).connection?.saveData === true;
  if (saveData) return null;
  return (
    <div className="leaves" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{ '--x': l.x, '--s': l.size, '--d': l.duration, '--delay': l.delay, opacity: l.opacity } as CSSProperties}
        >
          <svg viewBox="0 0 24 24">
            <path fill={l.color} d="M12 2C6 6 4 12 6 18c1 2 3 3 6 4 3-1 5-2 6-4 2-6 0-12-6-16z" />
            <path stroke="rgba(255,255,255,.45)" strokeWidth="1" fill="none" d="M12 4v18" />
          </svg>
        </span>
      ))}
    </div>
  );
}
