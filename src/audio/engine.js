// One shared AudioContext with a master chain, a reverb, and buses for
// sound effects and music. Created lazily on the first user gesture.
let A = null;
let noiseBuffer = null;

function impulse(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

export function audio() {
  if (!A) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 3;
    master.connect(comp);
    comp.connect(ctx.destination);

    const reverb = ctx.createConvolver();
    reverb.buffer = impulse(ctx, 3.2, 2.6);
    const reverbOut = ctx.createGain();
    reverbOut.gain.value = 0.5;
    reverb.connect(reverbOut);
    reverbOut.connect(master);

    const sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.5;
    sfxBus.connect(master);
    const sfxSend = ctx.createGain();
    sfxSend.gain.value = 0.3;
    sfxBus.connect(sfxSend);
    sfxSend.connect(reverb);

    const musicBus = ctx.createGain();
    musicBus.gain.value = 0.7;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.82;
    musicBus.connect(analyser);
    analyser.connect(master);
    const musicSend = ctx.createGain();
    musicSend.gain.value = 0.55;
    musicBus.connect(musicSend);
    musicSend.connect(reverb);

    A = { ctx, master, reverb, sfxBus, musicBus, analyser };
  }
  if (A.ctx.state === 'suspended') A.ctx.resume();
  return A;
}

export function peekAudio() {
  return A;
}

export function noise(ctx) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function tone(ctx, dest, { type = 'sine', f, f2, t, dur, vol = 0.2, attack = 0.005 }) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.6);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}
