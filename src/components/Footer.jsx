import { useEffect, useState } from 'react';
import { contact, site } from '../content';
import { local } from '../storage';

const BADGES = [
  ['MADE WITH', 'REACT'],
  ['BEST VIEWED', '1024×768'],
  ['Y2K', 'COMPLIANT'],
  ['AERO', 'INSIDE'],
];

// An honest hit counter: it counts *your* visits, in your browser only.
function useVisits() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const v = (parseInt(local.get('qx-visits') || '0', 10) || 0) + 1;
    local.set('qx-visits', String(v));
    setN(v);
  }, []);
  return n;
}

export default function Footer() {
  const visits = useVisits();
  return (
    <footer className="footer">
      <div className="badges">
        {BADGES.map(([a, b]) => (
          <span key={a} className="badge88">
            <span>{a}</span>
            <strong>{b}</strong>
          </span>
        ))}
        {contact.coffee && (
          <a className="badge88 badge88--coffee" href={contact.coffee.href} target="_blank" rel="noreferrer" aria-label="Buy me a coffee">
            <span>BUY ME A</span>
            <strong>COFFEE ☕</strong>
          </a>
        )}
      </div>
      <div className="counter" title="How many times you have visited, counted in your own browser">
        <span>your visits</span>
        <span className="counter-digits">
          {String(visits).padStart(6, '0').split('').map((d, i) => (
            <b key={i}>{d}</b>
          ))}
        </span>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} {site.name} · {site.handle} · hand-polished chrome
      </p>
    </footer>
  );
}
