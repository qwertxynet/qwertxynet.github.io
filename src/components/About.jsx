import { useState } from 'react';
import Window from './Window';
import { about, site } from '../content';

const TABS = ['General', 'Education', 'Skills', 'Now'];

export default function About() {
  const [tab, setTab] = useState('General');

  const onKey = (e) => {
    const i = TABS.indexOf(tab);
    if (e.key === 'ArrowRight') setTab(TABS[(i + 1) % TABS.length]);
    if (e.key === 'ArrowLeft') setTab(TABS[(i - 1 + TABS.length) % TABS.length]);
  };

  return (
    <section id="about" className="section reveal">
      <div className="section-head">
        <p className="eyebrow">03 · About</p>
        <h2 className="section-title chrome">ABOUT ME</h2>
      </div>

      <Window title="System Properties" icon="user" className="about-win" bodyClass="about-body">
        <div className="tabs" role="tablist" aria-label="About sections" onKeyDown={onKey}>
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`panel-${t}`}
              tabIndex={tab === t ? 0 : -1}
              className={`tab ${tab === t ? 'is-on' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tab-panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'General' && (
            <div className="about-general">
              <div className="avatar">
                <img className="avatar-photo" src="/me-face.webp" alt={site.name} width="360" height="360" />
                <span className="avatar-gloss" aria-hidden="true" />
              </div>
              <div className="about-text">
                <h3>{site.name}</h3>
                <p className="about-role">
                  {site.role} · a.k.a. <strong>{site.handle}</strong>
                </p>
                {about.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {tab === 'Education' && (
            <div className="edu">
              <div className="edu-head">
                <div className="edu-badge" aria-hidden="true">
                  <span>{about.education.year}</span>
                </div>
                <div>
                  <h3>{about.education.school}</h3>
                  <p className="about-role">{about.education.program}</p>
                </div>
              </div>
              <fieldset className="skill-group">
                <legend>Coursework</legend>
                <ul className="courses">
                  {about.education.courses.map((c) => (
                    <li key={c}>
                      <span className="course-check" aria-hidden="true">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>
          )}

          {tab === 'Skills' && (
            <div className="skills">
              {Object.entries(about.skills).map(([group, list]) => (
                <fieldset key={group} className="skill-group">
                  <legend>{group}</legend>
                  <div className="chips">
                    {list.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          )}

          {tab === 'Now' && (
            <dl className="now">
              {about.now.map(([k, v]) => (
                <div key={k} className="now-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="dialog-actions">
          <a className="btn btn--sm btn--aqua" href="#contact">
            OK
          </a>
          <a className="btn btn--sm" href="#work">
            Cancel
          </a>
        </div>
      </Window>
    </section>
  );
}
