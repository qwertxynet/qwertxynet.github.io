import { useEffect, useRef, useState } from 'react';
import { useSound } from './Sound';
import { sfx } from '../audio/sfx';
import { site } from '../content';
import Icon from './Icon';

const MESSAGES = [
  'Polishing chrome…',
  'Inflating bubbles…',
  'Calibrating lens flare…',
  'Loading creativity.dll…',
  'Defragmenting ideas…',
  'Ready.',
];

export default function BootScreen({ onDone }) {
  const { setSoundOn } = useSound();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef(null);
  const ready = progress >= 100;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduce ? 500 : 2600;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / total) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const skip = () => setProgress(100);
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  useEffect(() => {
    if (ready) enterRef.current?.focus({ preventScroll: true });
  }, [ready]);

  const enter = (withSound) => {
    if (leaving) return;
    setSoundOn(withSound);
    if (withSound) {
      sfx.setEnabled(true);
      sfx.startup();
    }
    setLeaving(true);
    setTimeout(onDone, 750);
  };

  const msg = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor((progress / 100) * (MESSAGES.length - 1)))];

  return (
    <div className={`boot ${leaving ? 'boot--leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="boot-inner">
        <div className="boot-orb">
          <div className="orb orb--chrome" />
          <div className="boot-ring" />
        </div>
        <h1 className="chrome boot-title">{site.handle}</h1>
        <p className="boot-sub">{site.role}</p>

        <div className={`boot-load ${ready ? 'is-done' : ''}`} aria-hidden={ready}>
          <div className="boot-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div className="boot-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="boot-msg">{msg}</p>
        </div>

        <div className={`boot-actions ${ready ? 'is-ready' : ''}`}>
          <button ref={enterRef} className="btn btn--aqua btn--lg" onClick={() => enter(true)} disabled={!ready} data-silent>
            <Icon name="soundOn" /> Enter with sound
          </button>
          <button className="btn btn--lg" onClick={() => enter(false)} disabled={!ready} data-silent>
            Enter quietly
          </button>
        </div>
        <p className={`boot-hint ${ready ? 'is-hidden' : ''}`}>press any key to skip</p>
      </div>
      <p className="boot-foot">© {new Date().getFullYear()} {site.name} · Qwertxy OS</p>
    </div>
  );
}
