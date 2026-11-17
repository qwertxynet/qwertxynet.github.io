import { useEffect, useRef } from 'react';

const COLORS = [
  { fill: '#ffffff', glow: '#3d9fd6' },
  { fill: '#7fd6fb', glow: '#2b8fd0' },
  { fill: '#c5d5e4', glow: '#5c7c9c' },
  { fill: '#4fb8ea', glow: '#9fe1ff' },
];

function star(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
    ctx.quadraticCurveTo(-r * 0.12, r * 0.12, 0, 0);
  }
  ctx.fill();
  ctx.restore();
}

// Glittery four-point-star trail that follows a mouse pointer.
export default function SparkleCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const parts = [];
    let last = null;
    let raf = 0;

    const spawn = (x, y, burst = false) => {
      const c = COLORS[(Math.random() * COLORS.length) | 0];
      parts.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * (burst ? 3 : 0.6),
        vy: (burst ? -Math.random() * 3 : Math.random() * 0.6) + 0.2,
        r: 3 + Math.random() * (burst ? 9 : 7),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.08,
        life: 1,
        decay: 0.014 + Math.random() * 0.018,
        c,
      });
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;
        p.rot += p.vr;
        p.life -= p.decay;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        const s = p.life < 0.3 ? p.life / 0.3 : 1;
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.c.glow;
        ctx.fillStyle = p.c.fill;
        star(ctx, p.x, p.y, p.r * s, p.rot);
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      if (last) {
        const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        if (d < 9) return;
      }
      last = { x: e.clientX, y: e.clientY };
      spawn(e.clientX, e.clientY);
      if (Math.random() < 0.35) spawn(e.clientX, e.clientY);
    };
    const onDown = (e) => {
      if (e.pointerType !== 'mouse') return;
      for (let i = 0; i < 10; i++) spawn(e.clientX, e.clientY, true);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="sparkles" aria-hidden="true" />;
}
