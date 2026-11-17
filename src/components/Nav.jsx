import { useEffect, useState } from 'react';
import Icon from './Icon';
import { useSound } from './Sound';
import { sfx } from '../audio/sfx';

const LINKS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'grid' },
  { id: 'engineering', label: 'Engineering', icon: 'gear' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'contact', label: 'Contact', icon: 'chat' },
];

export default function Nav() {
  const [active, setActive] = useState('home');
  const { soundOn, setSoundOn } = useSound();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (next) {
      sfx.setEnabled(true);
      sfx.open();
    }
  };

  return (
    <header className="nav-wrap">
      <nav className="nav glass" aria-label="Main">
        <a href="#home" className="nav-logo" aria-label="Qwertxy, back to top">
          <span className="orb orb--chrome orb--xs" />
          <span className="nav-logo-text">QX</span>
        </a>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={`nav-link ${active === l.id ? 'is-active' : ''}`} aria-current={active === l.id ? 'true' : undefined}>
                <Icon name={l.icon} size={16} />
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`nav-sound ${soundOn ? 'is-on' : ''}`}
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute sound effects' : 'Turn on sound effects'}
          title={soundOn ? 'Sound on' : 'Sound off'}
        >
          <Icon name={soundOn ? 'soundOn' : 'soundOff'} size={17} />
        </button>
      </nav>
    </header>
  );
}
