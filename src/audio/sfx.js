import { audio, noise, mtof, tone } from './engine';

// Interface sounds, all synthesized: no audio files to load.
let enabled = false;
let lastHover = 0;

function ready() {
  if (!enabled) return null;
  return audio();
}

export const sfx = {
  setEnabled(v) {
    enabled = !!v;
  },

  click() {
    const a = ready();
    if (!a) return;
    const t = a.ctx.currentTime;
    tone(a.ctx, a.sfxBus, { f: 1320, f2: 1980, t, dur: 0.09, vol: 0.22 });
    tone(a.ctx, a.sfxBus, { type: 'triangle', f: 2640, t, dur: 0.05, vol: 0.05 });
  },

  hover() {
    const now = performance.now();
    if (now - lastHover < 80) return;
    lastHover = now;
    const a = ready();
    if (!a) return;
    tone(a.ctx, a.sfxBus, { f: 2350, t: a.ctx.currentTime, dur: 0.04, vol: 0.035 });
  },

  open() {
    const a = ready();
    if (!a) return;
    const { ctx, sfxBus } = a;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, t);
    bp.frequency.exponentialRampToValueAtTime(3600, t + 0.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    src.connect(bp);
    bp.connect(g);
    g.connect(sfxBus);
    src.start(t);
    src.stop(t + 0.4);
    tone(ctx, sfxBus, { f: 880, f2: 1760, t: t + 0.04, dur: 0.25, vol: 0.08 });
  },

  close() {
    const a = ready();
    if (!a) return;
    const t = a.ctx.currentTime;
    tone(a.ctx, a.sfxBus, { f: 1400, f2: 700, t, dur: 0.16, vol: 0.12 });
  },

  nope() {
    const a = ready();
    if (!a) return;
    const t = a.ctx.currentTime;
    tone(a.ctx, a.sfxBus, { type: 'triangle', f: mtof(76), t, dur: 0.18, vol: 0.18 });
    tone(a.ctx, a.sfxBus, { type: 'triangle', f: mtof(72), t: t + 0.12, dur: 0.3, vol: 0.18 });
  },

  // The "welcome" chime: a shimmering major-9 arpeggio over a soft pad.
  startup() {
    const a = ready();
    if (!a) return;
    const { ctx, sfxBus } = a;
    const t = ctx.currentTime + 0.05;
    [60, 67, 71, 74, 79, 83, 86].forEach((m, i) => {
      const at = t + i * 0.1;
      tone(ctx, sfxBus, { f: mtof(m), t: at, dur: 2.4, vol: 0.12, attack: 0.01 });
      tone(ctx, sfxBus, { f: mtof(m + 12), t: at, dur: 1.2, vol: 0.03, attack: 0.01 });
    });
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(400, t);
    lp.frequency.linearRampToValueAtTime(2200, t + 1.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.06, t + 1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4);
    lp.connect(g);
    g.connect(sfxBus);
    [48, 55, 64, 71].forEach((m) =>
      [-8, 8].forEach((det) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = mtof(m);
        o.detune.value = det;
        o.connect(lp);
        o.start(t);
        o.stop(t + 4.1);
      }),
    );
  },
};
