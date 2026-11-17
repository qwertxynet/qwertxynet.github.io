import { marquee } from '../content';
import Icon from './Icon';

export default function Marquee() {
  const row = (hidden) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {marquee.map((word, i) => (
        <span key={i} className="marquee-item">
          {word}
          <Icon name="sparkle" size={14} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
