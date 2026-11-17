import { useState } from 'react';
import Icon from './Icon';
import { sfx } from '../audio/sfx';

// An Aero-style application window. Minimize folds it up; close just
// refuses with a wiggle, because the portfolio would be sad without it.
export default function Window({ title, icon, children, className = '', bodyClass = '', onClose, closeRef }) {
  const [min, setMin] = useState(false);
  const [nope, setNope] = useState(false);

  const close = () => {
    if (onClose) return onClose();
    sfx.nope();
    setNope(true);
    setTimeout(() => setNope(false), 1400);
  };

  return (
    <div className={`window ${nope ? 'is-nope' : ''} ${min ? 'is-min' : ''} ${className}`}>
      <div className="win-bar">
        <span className="win-icon">
          <Icon name={icon} size={15} />
        </span>
        <span className="win-title">{title}</span>
        <span className="win-tip" role="status">
          {nope ? 'nice try :)' : ''}
        </span>
        <div className="win-controls">
          <button className="win-btn" onClick={() => setMin((m) => !m)} aria-label={min ? 'Restore window' : 'Minimize window'} aria-expanded={!min} data-silent>
            <Icon name="minus" size={12} strokeWidth={3} />
          </button>
          <button className="win-btn" tabIndex={-1} aria-hidden="true" data-silent>
            <Icon name="square" size={11} strokeWidth={2.6} />
          </button>
          <button ref={closeRef} className="win-btn win-btn--close" onClick={close} aria-label="Close window" data-silent>
            <Icon name="x" size={12} strokeWidth={3} />
          </button>
        </div>
      </div>
      <div className={`win-body ${bodyClass}`} hidden={min}>
        {children}
      </div>
    </div>
  );
}
