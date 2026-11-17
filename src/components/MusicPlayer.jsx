import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { player, TRACKS } from '../audio/music';
import { peekAudio } from '../audio/engine';
import { local } from '../storage';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const BARS = 18;

export default function MusicPlayer() {
  const [open, setOpen] = useState(() => {
    // Phones always start with the small orb so the player never covers content.
    if (window.innerWidth <= 760) return false;
    const saved = local.get('qx-amp-open');
    return saved ? saved === '1' : window.innerWidth > 1100;
  });
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(player.track);
  const [vol, setVol] = useState(player.volume);
  const [time, setTime] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => local.set('qx-amp-open', open ? '1' : '0'), [open]);
  useEffect(() => () => player.stop(), []);

  // Visualizer + clock
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const data = new Uint8Array(32);
    const peaks = new Array(BARS).fill(0);
    const grad = ctx.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0, '#2a9fdc');
    grad.addColorStop(0.6, '#7fdcff');
    grad.addColorStop(1, '#ffffff');
    let raf;
    let lastClock = 0;
    const draw = (now) => {
      const a = peekAudio();
      const live = player.playing && a;
      if (live) a.analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, W, H);
      const bw = W / BARS;
      for (let i = 0; i < BARS; i++) {
        const v = live ? data[Math.min(31, 1 + Math.floor(i * 1.3))] / 255 : 0.05 + 0.04 * Math.sin(now / 600 + i * 0.6);
        const h = Math.max(2, v * H * 0.95);
        peaks[i] = Math.max(peaks[i] - 0.6, h);
        ctx.fillStyle = grad;
        // segmented LCD bars
        for (let y = H; y > H - h; y -= 4) ctx.fillRect(i * bw + 1.5, y - 3, bw - 3, 2.6);
        ctx.fillStyle = 'rgba(255,255,255,.95)';
        ctx.fillRect(i * bw + 1.5, H - peaks[i] - 3, bw - 3, 1.6);
      }
      if (now - lastClock > 250) {
        lastClock = now;
        setTime(player.elapsed());
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const toggle = () => {
    if (player.playing) {
      player.stop();
      setPlaying(false);
    } else if (player.play()) {
      setPlaying(true);
    }
  };
  const skip = (d) => {
    player.select(player.track + d);
    setTrack(player.track);
  };
  const onVol = (e) => {
    const v = Number(e.target.value);
    setVol(v);
    player.setVolume(v);
  };

  if (!open) {
    return (
      <button className={`amp-orb ${playing ? 'is-playing' : ''}`} onClick={() => setOpen(true)} aria-label="Open the Q-Amp music player">
        <span className="orb orb--aqua" />
        <Icon name="music" size={20} />
      </button>
    );
  }

  const t = TRACKS[track];
  return (
    <aside className="amp" aria-label="Q-Amp music player">
      <div className="amp-bar">
        <span className="amp-brand">
          <Icon name="music" size={13} /> Q-AMP
        </span>
        <button className="win-btn" onClick={() => setOpen(false)} aria-label="Minimize player" data-silent>
          <Icon name="minus" size={12} strokeWidth={3} />
        </button>
      </div>
      <div className="amp-lcd">
        <div className="amp-lcd-top">
          <span className="amp-state">{playing ? '▶' : '❚❚'}</span>
          <span className="amp-time">{fmt(time)}</span>
          <span className="amp-kbps">
            {t.bpm}bpm
            <br />
            live synth
          </span>
        </div>
        <div className="amp-title" aria-live="polite">
          <span key={track} className={playing ? 'is-scrolling' : ''}>
            {String(track + 1).padStart(2, '0')}. {t.title} ~ Qwertxy
          </span>
        </div>
        <canvas ref={canvasRef} className="amp-viz" aria-hidden="true" />
      </div>
      <div className="amp-controls">
        <button className="amp-btn" onClick={() => skip(-1)} aria-label="Previous track">
          <Icon name="prev" size={15} />
        </button>
        <button className={`amp-btn amp-btn--play ${playing ? 'is-on' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          <Icon name={playing ? 'pause' : 'play'} size={17} />
        </button>
        <button className="amp-btn" onClick={() => skip(1)} aria-label="Next track">
          <Icon name="next" size={15} />
        </button>
        <label className="amp-vol">
          <span className="sr-only">Volume</span>
          <Icon name="soundOn" size={14} />
          <input type="range" min="0" max="1" step="0.01" value={vol} onChange={onVol} style={{ '--v': `${vol * 100}%` }} />
        </label>
      </div>
    </aside>
  );
}
