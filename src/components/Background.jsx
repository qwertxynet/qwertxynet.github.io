import { useMemo } from 'react';

// Fixed Frutiger Aero backdrop: ice sky, light rays, aurora swooshes,
// a lens flare and slowly rising glass bubbles.
export default function Background() {
  const bubbles = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 16 }, () => ({
      left: `${rnd() * 100}%`,
      size: `${18 + rnd() * 70}px`,
      dur: `${22 + rnd() * 26}s`,
      delay: `${-rnd() * 40}s`,
      sway: `${(rnd() - 0.5) * 120}px`,
    }));
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-rays" />
      <svg className="bg-swoosh" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sw-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".75" />
            <stop offset="1" stopColor="#d7e7f4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sw-fill2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bcd8ee" stopOpacity="0" />
            <stop offset=".5" stopColor="#bcd8ee" stopOpacity=".5" />
            <stop offset="1" stopColor="#bcd8ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sw-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset=".45" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sw-aqua" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7fd3f7" stopOpacity="0" />
            <stop offset=".6" stopColor="#7fd3f7" stopOpacity=".7" />
            <stop offset="1" stopColor="#7fd3f7" stopOpacity="0" />
          </linearGradient>
          <filter id="sw-blur" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path className="sw sw-a" d="M-80 640 C 320 470, 760 800, 1520 520 L1520 900 L-80 900 Z" fill="url(#sw-fill)" />
        <path className="sw sw-b" d="M-80 700 C 420 600, 900 860, 1520 640 L1520 900 L-80 900 Z" fill="url(#sw-fill2)" />
        <path className="sw sw-c" d="M-80 610 C 360 450, 760 760, 1520 470" fill="none" stroke="url(#sw-line)" strokeWidth="16" filter="url(#sw-blur)" />
        <path className="sw sw-c" d="M-80 610 C 360 450, 760 760, 1520 470" fill="none" stroke="url(#sw-line)" strokeWidth="2" />
        <path className="sw sw-d" d="M-80 660 C 380 520, 820 800, 1520 540" fill="none" stroke="url(#sw-aqua)" strokeWidth="1.5" />
        <path className="sw sw-e" d="M-80 200 C 300 120, 800 330, 1520 160" fill="none" stroke="url(#sw-line)" strokeWidth="40" filter="url(#sw-blur)" opacity=".55" />
      </svg>
      <div className="bg-flare">
        <span />
        <span />
        <span />
      </div>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.dur, animationDelay: b.delay, '--sway': b.sway }}
        />
      ))}
      <div className="bg-grain" />
    </div>
  );
}
