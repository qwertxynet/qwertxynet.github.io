import { audio, noise, mtof } from './engine';

// Q-Amp plays generative tracks synthesized live in the browser.
// Chords are semitone offsets from `root`; steps are 16th notes in a bar.
export const TRACKS = [
  {
    title: 'Aqua Dream',
    bpm: 84,
    root: 62,
    chords: [
      [0, 4, 7, 11, 14],
      [-3, 0, 4, 7, 11],
      [-7, -3, 0, 4, 7],
      [-5, 0, 2, 5, 9],
    ],
    arpSteps: [0, 3, 6, 8, 10, 13],
    arp: [0, 2, 4, 3, 1, 4],
    bass: [0, 7, 10],
    kick: [0, 8],
    hats: [2, 6, 10, 14],
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

function pad(ctx, out, notes, t, dur) {
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 0.8;
  lp.frequency.setValueAtTime(500, t);
  lp.frequency.linearRampToValueAtTime(1500, t + dur * 0.5);
  lp.frequency.linearRampToValueAtTime(650, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.045, t + 0.9);
  g.gain.setValueAtTime(0.045, t + dur - 0.3);
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

function hat(ctx, out, t) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.035, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  src.connect(hp);
  hp.connect(g);
  g.connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + 0.08);
}

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
    const chord = tr.chords[bar % tr.chords.length].map((n) => tr.root + n);

    if (s === 0) pad(ctx, out, chord, t, s16 * 16);
    const ai = tr.arpSteps.indexOf(s);
    if (ai !== -1) {
      const lift = bar % 4 === 3 ? 24 : 12;
      bell(ctx, out, chord[tr.arp[ai] % chord.length] + lift, t);
    }
    if (tr.bass.includes(s)) bass(ctx, out, chord[0] - 24 + (s > 8 && bar % 2 ? 7 : 0), t);
    if (bar > 0 && tr.kick.includes(s)) kick(ctx, out, t);
    if (bar > 1 && tr.hats.includes(s)) hat(ctx, out, t);
  }
}

export const player = new Player();
