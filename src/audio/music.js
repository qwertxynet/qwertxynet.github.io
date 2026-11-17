import { audio, noise, mtof } from './engine';

// Q-Amp plays generative tracks synthesized live in the browser.
// Chords are semitone offsets from `root`; steps are 16th notes in a bar.
export const TRACKS = [
  {
    // Same dreamy chords and bells, now over breakcore / drum & bass:
    // chopped amen-style breaks, a Reese bass and formant "vocal" chops.
    title: 'Aqua Dream',
    style: 'dnb',
    bpm: 172,
    root: 62,
    chordBars: 2,
    padVol: 0.03,
    bellVol: 0.045,
    chords: [
      [0, 4, 7, 11, 14],
      [-3, 0, 4, 7, 11],
      [-7, -3, 0, 4, 7],
      [-5, 0, 2, 5, 9],
    ],
    arpSteps: [0, 3, 6, 8, 10, 13],
    arp: [0, 2, 4, 3, 1, 4],
  },
  {
    title: 'Ice Lounge (2001 Mix)',
    bpm: 96,
    root: 57,
    chords: [
      [0, 3, 7, 10, 14],
      [-4, 0, 3, 7, 10],
      [3, 7, 10, 14],
      [-2, 2, 5, 7],
    ],
    arpSteps: [0, 2, 4, 6, 8, 10, 12, 14],
    arp: [0, 1, 2, 3, 2, 1, 3, 2],
    bass: [0, 3, 8, 11],
    kick: [0, 6, 8],
    hats: [2, 4, 6, 10, 12, 14],
  },
  {
    title: 'Bubble Screensaver',
    bpm: 70,
    root: 65,
    chords: [
      [0, 4, 7, 11, 14],
      [0, 2, 6, 9, 14],
      [-1, 2, 6, 9],
      [4, 7, 11, 14],
    ],
    arpSteps: [0, 4, 7, 10, 12],
    arp: [3, 1, 2, 0, 3],
    bass: [0, 8],
    kick: [0],
    hats: [4, 12],
  },
];

function pad(ctx, out, notes, t, dur, vol = 0.045) {
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 0.8;
  lp.frequency.setValueAtTime(500, t);
  lp.frequency.linearRampToValueAtTime(1500, t + dur * 0.5);
  lp.frequency.linearRampToValueAtTime(650, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.9);
  g.gain.setValueAtTime(vol, t + dur - 0.3);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.8);
  lp.connect(g);
  g.connect(out);
  notes.forEach((m) =>
    [-7, 7].forEach((det) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = mtof(m);
      o.detune.value = det;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.9);
    }),
  );
}

function bell(ctx, out, m, t, vol = 0.07) {
  const f = mtof(m);
  const car = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  const g = ctx.createGain();
  car.frequency.value = f;
  mod.frequency.value = f * 3.5;
  modGain.gain.setValueAtTime(f * 0.9, t);
  modGain.gain.exponentialRampToValueAtTime(1, t + 0.8);
  mod.connect(modGain);
  modGain.connect(car.frequency);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  car.connect(g);
  g.connect(out);
  car.start(t);
  mod.start(t);
  car.stop(t + 1.5);
  mod.stop(t + 1.5);
}

function bass(ctx, out, m, t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = mtof(m);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  o.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + 0.6);
}

function kick(ctx, out, t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.3, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  o.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + 0.35);
}

function hat(ctx, out, t, vol = 0.035, len = 0.06) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(hp);
  hp.connect(g);
  g.connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + len + 0.02);
}

// ── Breakcore / DnB voices ─────────────────────────────────────

// Punchy kick: fast pitch drop plus a noise click for attack.
function kickHard(ctx, out, t, vol = 0.6) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(190, t);
  o.frequency.exponentialRampToValueAtTime(48, t + 0.09);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  o.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + 0.36);
  const c = ctx.createBufferSource();
  c.buffer = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2500;
  const cg = ctx.createGain();
  cg.gain.setValueAtTime(vol * 0.5, t);
  cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
  c.connect(hp);
  hp.connect(cg);
  cg.connect(out);
  c.start(t, Math.random() * 0.5);
  c.stop(t + 0.02);
}

// Snare: band-passed noise crack over a tuned body. `pitch` > 1 for rolls.
function snare(ctx, out, t, vol = 0.4, pitch = 1) {
  const n = ctx.createBufferSource();
  n.buffer = noise(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1900 * pitch;
  bp.Q.value = 0.7;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(vol, t + 0.002);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
  n.connect(bp);
  bp.connect(ng);
  ng.connect(out);
  n.start(t, Math.random() * 0.5);
  n.stop(t + 0.19);
  const b = ctx.createOscillator();
  b.type = 'triangle';
  b.frequency.setValueAtTime(230 * pitch, t);
  b.frequency.exponentialRampToValueAtTime(165 * pitch, t + 0.06);
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.0001, t);
  bg.gain.exponentialRampToValueAtTime(vol * 0.7, t + 0.002);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  b.connect(bg);
  bg.connect(out);
  b.start(t);
  b.stop(t + 0.12);
}

// Reese bass: two detuned saws through a moving low-pass, plus a clean sub.
function reese(ctx, out, m, t, dur) {
  const f = mtof(m);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 5;
  lp.frequency.setValueAtTime(160, t);
  lp.frequency.linearRampToValueAtTime(820, t + dur * 0.45);
  lp.frequency.linearRampToValueAtTime(200, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.085, t + 0.02);
  g.gain.setValueAtTime(0.085, t + dur - 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  lp.connect(g);
  g.connect(out);
  [-16, 16].forEach((d) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.detune.value = d;
    o.connect(lp);
    o.start(t);
    o.stop(t + dur + 0.02);
  });
  const sub = ctx.createOscillator();
  const sg = ctx.createGain();
  sub.frequency.value = f;
  sg.gain.setValueAtTime(0.0001, t);
  sg.gain.exponentialRampToValueAtTime(0.13, t + 0.02);
  sg.gain.setValueAtTime(0.13, t + dur - 0.05);
  sg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  sub.connect(sg);
  sg.connect(out);
  sub.start(t);
  sub.stop(t + dur + 0.02);
}

// Vocal chops: a buzzy source through vowel formant filters ("ah", "oh",
// "eh", "ee"), with a little scoop up into the note and vibrato.
const VOWELS = {
  a: [800, 1150, 2900],
  o: [450, 800, 2830],
  e: [400, 1700, 2600],
  i: [300, 2200, 2950],
};
function vox(ctx, out, m, t, dur, vowel = 'a', vol = 0.05) {
  const f = mtof(m);
  const src = ctx.createOscillator();
  src.type = 'sawtooth';
  src.frequency.setValueAtTime(f * 0.92, t);
  src.frequency.exponentialRampToValueAtTime(f, t + 0.05);
  const vib = ctx.createOscillator();
  const vg = ctx.createGain();
  vib.frequency.value = 5.5;
  vg.gain.value = f * 0.012;
  vib.connect(vg);
  vg.connect(src.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.setValueAtTime(vol, t + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  VOWELS[vowel].forEach((ff, i) => {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = ff;
    bp.Q.value = [4, 6, 8][i];
    const fg = ctx.createGain();
    fg.gain.value = [3, 1.8, 1][i];
    src.connect(bp);
    bp.connect(fg);
    fg.connect(g);
  });
  g.connect(out);
  src.start(t);
  vib.start(t);
  src.stop(t + dur + 0.05);
  vib.stop(t + dur + 0.05);
}

// Soft-clip distortion so the breaks bite.
function grit(ctx, amount) {
  const ws = ctx.createWaveShaper();
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
  }
  ws.curve = curve;
  ws.oversample = '2x';
  return ws;
}

// Two alternating amen-flavored bars: kicks, main snares, ghost snares.
const BREAKS = [
  { k: [0, 10], s: [4, 12], g: [7, 9, 15] },
  { k: [0, 2, 10, 11], s: [4, 12, 14], g: [6, 9] },
];
// Vocal chop riff: [step, vowel, chord tone]
const VOX_RIFF = [
  [0, 'a', 0],
  [3, 'o', 2],
  [6, 'a', 4],
  [10, 'e', 1],
  [13, 'i', 3],
];

class Player {
  constructor() {
    this.track = 0;
    this.playing = false;
    this.volume = 0.7;
    this.timer = null;
    this.out = null;
  }

  play() {
    const a = audio();
    if (!a) return false;
    this.a = a;
    a.musicBus.gain.value = this.volume;
    this.out = a.ctx.createGain();
    this.out.connect(a.musicBus);
    // Drums get their own driven bus on the breakcore track.
    this.drums = this.out;
    if (TRACKS[this.track].style === 'dnb') {
      const drive = a.ctx.createGain();
      drive.gain.value = 1.1;
      const clip = grit(a.ctx, 2.4);
      const trim = a.ctx.createGain();
      trim.gain.value = 0.75;
      drive.connect(clip);
      clip.connect(trim);
      trim.connect(this.out);
      this.drums = drive;
    }
    this.step = 0;
    this.nextTime = a.ctx.currentTime + 0.1;
    this.startedAt = this.nextTime;
    this.playing = true;
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 25);
    this.tick();
    return true;
  }

  stop() {
    clearInterval(this.timer);
    this.playing = false;
    if (this.out && this.a) {
      const out = this.out;
      const t = this.a.ctx.currentTime;
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + 0.4);
      setTimeout(() => out.disconnect(), 3000);
    }
    this.out = null;
  }

  select(i) {
    const was = this.playing;
    if (was) this.stop();
    this.track = (i + TRACKS.length) % TRACKS.length;
    if (was) this.play();
  }

  setVolume(v) {
    this.volume = v;
    if (this.a) this.a.musicBus.gain.value = v;
  }

  elapsed() {
    return this.playing && this.a ? Math.max(0, this.a.ctx.currentTime - this.startedAt) : 0;
  }

  tick() {
    const { ctx } = this.a;
    const tr = TRACKS[this.track];
    const s16 = 60 / tr.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.15) {
      this.schedule(this.step, this.nextTime, tr, s16);
      this.step++;
      this.nextTime += s16;
    }
  }

  schedule(step, t, tr, s16) {
    const { ctx } = this.a;
    const out = this.out;
    const bar = Math.floor(step / 16);
    const s = step % 16;
    const cb = tr.chordBars || 1;
    const chord = tr.chords[Math.floor(bar / cb) % tr.chords.length].map((n) => tr.root + n);

    if (s === 0 && bar % cb === 0) pad(ctx, out, chord, t, s16 * 16 * cb, tr.padVol);
    const ai = tr.arpSteps.indexOf(s);
    if (ai !== -1) {
      const lift = bar % 4 === 3 ? 24 : 12;
      bell(ctx, out, chord[tr.arp[ai] % chord.length] + lift, t, tr.bellVol);
    }
    if (tr.style === 'dnb') return this.breaks(bar, s, t, s16, chord);
    if (tr.bass.includes(s)) bass(ctx, out, chord[0] - 24 + (s > 8 && bar % 2 ? 7 : 0), t);
    if (bar > 0 && tr.kick.includes(s)) kick(ctx, out, t);
    if (bar > 1 && tr.hats.includes(s)) hat(ctx, out, t);
  }

  // Breakcore arrangement: 2-bar intro with a snare build, then chopped
  // amen breaks, rolls every 4 bars, a stutter fill every 8, and vocal chops.
  breaks(bar, s, t, s16, chord) {
    const { ctx } = this.a;
    const out = this.out;
    const d = this.drums;
    const half = s16 / 2;

    if (bar < 2) {
      if (bar === 1 && s >= 8) {
        const k = s - 8;
        snare(ctx, d, t, 0.06 + k * 0.03, 1 + k * 0.05);
        snare(ctx, d, t + half, 0.07 + k * 0.03, 1.02 + k * 0.05);
      }
      if (bar === 1 && s === 12) vox(ctx, out, chord[0], t, s16 * 4, 'o', 0.04);
      return;
    }

    if (s === 0 || s === 8) reese(ctx, out, chord[0] - 24, t, s16 * 8);

    const phrase = bar % 8;
    const P = BREAKS[bar % 2];

    // Stutter fill: 32nd-note retriggers climbing in pitch, chopped "ah"s on top.
    if (phrase === 7 && s >= 8) {
      const k = s - 8;
      for (let i = 0; i < 2; i++) snare(ctx, d, t + i * half, 0.22 + k * 0.03, 1 + k * 0.09);
      if (k % 2 === 0) kickHard(ctx, d, t, 0.45);
      if (k % 2 === 0) vox(ctx, out, chord[(k / 2) % chord.length], t, s16 * 0.8, 'a', 0.045);
      return;
    }

    if (P.k.includes(s)) kickHard(ctx, d, t);
    if (phrase % 4 === 3 && s >= 12) {
      const k = s - 12;
      for (let i = 0; i < 2; i++) snare(ctx, d, t + i * half, 0.2 + k * 0.05, 1 + k * 0.1);
    } else if (P.s.includes(s)) {
      snare(ctx, d, t, 0.42);
    } else if (P.g.includes(s) || Math.random() < 0.07) {
      snare(ctx, d, t, 0.1, 1.1);
    }
    hat(ctx, d, t, s % 2 === 0 ? 0.05 : 0.022);
    if (s === 14 && bar % 2) hat(ctx, d, t, 0.04, 0.22);

    // Vocal chops ride the middle of each 4-bar phrase.
    if (phrase % 4 === 1 || phrase % 4 === 2) {
      const v = VOX_RIFF.find((r) => r[0] === s);
      if (v) vox(ctx, out, chord[v[2] % chord.length], t, s16 * 1.7, v[1]);
    }
  }
}

export const player = new Player();
