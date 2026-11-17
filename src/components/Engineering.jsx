import { useCallback, useEffect, useRef, useState } from 'react';
import Window from './Window';
import Icon from './Icon';
import { engineering } from '../engineering';
import { sfx } from '../audio/sfx';

function Viewer({ media, title }) {
  const [i, setI] = useState(0);
  const item = media[i];
  const go = useCallback((d) => setI((n) => (n + d + media.length) % media.length), [media.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <div className="viewer">
      <figure className="viewer-stage">
        {item.video ? (
          <video key={item.src} src={item.src} controls playsInline loop muted autoPlay className="viewer-media" />
        ) : (
          <img key={item.src} src={item.src} alt={`${title}: ${item.caption}`} className={`viewer-media ${item.fit === 'contain' ? 'is-contain' : ''}`} />
        )}
        {media.length > 1 && (
          <>
            <button className="viewer-nav viewer-nav--prev" onClick={() => go(-1)} aria-label="Previous image">
              <Icon name="chevronL" size={18} strokeWidth={2.6} />
            </button>
            <button className="viewer-nav viewer-nav--next" onClick={() => go(1)} aria-label="Next image">
              <Icon name="chevronR" size={18} strokeWidth={2.6} />
            </button>
          </>
        )}
        <figcaption className="viewer-cap">
          <span>{item.caption}</span>
          <span className="viewer-count">
            {i + 1} / {media.length}
          </span>
        </figcaption>
      </figure>
      {media.length > 1 && (
        <div className="thumbs" role="tablist" aria-label="Images">
          {media.map((m, n) => (
            <button
              key={m.src}
              role="tab"
              aria-selected={n === i}
              aria-label={m.caption}
              className={`thumb ${n === i ? 'is-on' : ''}`}
              onClick={() => setI(n)}
            >
              {m.video ? (
                <span className="thumb-video">
                  <Icon name="play" size={16} />
                </span>
              ) : (
                <img src={m.src} alt="" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CaseStudy({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="case-overlay" role="dialog" aria-modal="true" aria-label={project.title} onClick={onClose}>
      <div className="case-shell" onClick={(e) => e.stopPropagation()}>
        <Window title={`${project.title}.prj`} icon="gear" bodyClass="case-body" onClose={onClose} closeRef={closeRef}>
          <Viewer media={project.media} title={project.title} />
          <div className="case-info">
            <p className="eyebrow">
              {project.kind} · {project.year}
            </p>
            <h3 className="case-title">{project.title}</h3>
            {project.summary.map((p, n) => (
              <p key={n} className="case-p">
                {p}
              </p>
            ))}
            <h4 className="case-h">What I did</h4>
            <ul className="case-list">
              {project.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="chips case-tools">
              {project.tools.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
}

export default function Engineering() {
  const [open, setOpen] = useState(null);

  const show = (p) => {
    sfx.open();
    setOpen(p);
  };
  const hide = useCallback(() => {
    sfx.close();
    setOpen(null);
  }, []);

  return (
    <section id="engineering" className="section reveal">
      <div className="section-head">
        <p className="eyebrow">02 · Engineering</p>
        <h2 className="section-title chrome">ENGINEERING</h2>
        <p className="section-intro">{engineering.intro}</p>
      </div>

      <div className="eng-grid">
        {engineering.projects.map((p, i) => (
          <article key={p.id} className={`eng-card glass ${i === 0 ? 'eng-card--hero' : ''}`}>
            <button className="eng-cover" onClick={() => show(p)} aria-label={`Open ${p.title}`} data-silent>
              <img src={p.cover} alt="" loading="lazy" />
              <span className="eng-cover-gloss" aria-hidden="true" />
              <span className="eng-count">
                <Icon name="image" size={13} /> {p.media.filter((m) => !m.video).length}
                {p.media.some((m) => m.video) && (
                  <>
                    <span aria-hidden="true">·</span>
                    <Icon name="play" size={11} /> video
                  </>
                )}
              </span>
            </button>
            <div className="eng-text">
              <p className="eng-kind">
                {p.kind} · {p.year}
              </p>
              <h3 className="eng-title">{p.title}</h3>
              <p className="eng-blurb">{p.blurb}</p>
              {i === 0 && (
                <ul className="case-list eng-hero-list">
                  {p.did.slice(1, 4).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
              <div className="eng-foot">
                <div className="eng-tools">
                  {p.tools.slice(0, 3).map((t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ))}
                </div>
                <button className="btn btn--sm btn--aqua" onClick={() => show(p)} data-silent>
                  Open <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {open && <CaseStudy project={open} onClose={hide} />}
    </section>
  );
}
