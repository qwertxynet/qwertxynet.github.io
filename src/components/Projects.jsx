import { useEffect, useMemo, useState } from 'react';
import Window from './Window';
import Icon from './Icon';
import { projects as cfg, site } from '../content';
import { session } from '../storage';

const GEM = {
  JavaScript: '#f2cf4a',
  TypeScript: '#3f86e0',
  GDScript: '#45b7c9',
  Python: '#5a8fd0',
  HTML: '#f07a4d',
  CSS: '#8f6fe0',
  'C#': '#7bc96f',
};

const CACHE_KEY = 'qx-repos-v1';
const pretty = (name) => cfg.titles[name] || name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const liveUrl = (name) => `https://${site.github}.github.io/${name}/`;

function ago(iso) {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

function order(list) {
  const rank = (r) => {
    const i = cfg.featured.indexOf(r.name);
    return i === -1 ? Infinity : i;
  };
  return [...list].sort((a, b) => rank(a) - rank(b) || new Date(b.updated) - new Date(a.updated));
}

function normalize(r) {
  return {
    name: r.name,
    description: r.description || '',
    language: r.language,
    stars: r.stargazers_count,
    updated: r.pushed_at || r.updated_at,
    url: r.html_url,
    live: r.homepage || (r.has_pages ? liveUrl(r.name) : null),
  };
}

const CLIENT = (cfg.client || []).map((c) => ({ ...c, client: true, url: null }));

function useRepos() {
  const [state, setState] = useState({ status: 'loading', repos: [] });

  useEffect(() => {
    try {
      const cached = JSON.parse(session.get(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.at < 3600_000) {
        setState({ status: 'live', repos: cached.repos });
        return;
      }
    } catch { /* ignore bad cache */ }

    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${site.github}/repos?per_page=100&sort=pushed`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        const hide = new Set([...cfg.hide, `${site.github}.github.io`].map((s) => s.toLowerCase()));
        const repos = order(data.filter((r) => !r.fork && !r.archived && !r.private && !hide.has(r.name.toLowerCase())).map(normalize));
        session.set(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
        setState({ status: 'live', repos });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const repos = order(
          cfg.fallback.map((r) => ({
            ...r,
            url: `https://github.com/${site.github}/${r.name}`,
            live: r.live ? liveUrl(r.name) : null,
          })),
        );
        setState({ status: 'offline', repos });
      });
    return () => ctrl.abort();
  }, []);

  return state;
}

function ProjectCard({ repo, index }) {
  const gem = GEM[repo.language] || '#9fb3c6';
  return (
    <article className={`card glass ${repo.client ? 'card--client' : ''}`} style={{ '--gem': gem, '--i': index }}>
      <div className="card-shine" aria-hidden="true" />
      {repo.client && (
        <span className="card-ribbon">
          <Icon name="sparkle" size={11} /> Client work
        </span>
      )}
      <header className="card-head">
        <span className="gem" aria-hidden="true" />
        <div className="card-heading">
          <h3 className="card-title">{repo.title || pretty(repo.name)}</h3>
          {repo.role && <p className="card-role">{repo.role}</p>}
        </div>
      </header>
      <p className="card-desc" dir="auto">
        {repo.description || 'No description yet.'}
      </p>
      <div className="card-meta">
        {repo.client ? (
          repo.stack.map((s) => (
            <span key={s} className="pill">
              {s}
            </span>
          ))
        ) : (
          <>
            {repo.language && <span className="pill">{repo.language}</span>}
            <span className="card-stat" title={`${repo.stars} stars`}>
              <Icon name="star" size={13} /> {repo.stars}
            </span>
            <span className="card-stat">updated {ago(repo.updated)}</span>
          </>
        )}
      </div>
      <footer className="card-actions">
        {repo.url && (
          <a className="btn btn--sm" href={repo.url} target="_blank" rel="noreferrer">
            <Icon name="code" size={15} /> Code
          </a>
        )}
        {repo.live && (
          <a className="btn btn--sm btn--aqua" href={repo.live} target="_blank" rel="noreferrer">
            <Icon name="play" size={13} /> {repo.client ? `Visit ${repo.live.replace(/^https?:\/\//, '')}` : 'Live'}
          </a>
        )}
      </footer>
    </article>
  );
}

export default function Projects() {
  const { status, repos: ghRepos } = useRepos();
  const [filter, setFilter] = useState('All');

  const repos = useMemo(() => (status === 'loading' ? [] : [...CLIENT, ...ghRepos]), [status, ghRepos]);
  const languages = useMemo(
    () => ['All', ...(CLIENT.length ? ['Client'] : []), ...new Set(repos.map((r) => r.language).filter(Boolean))],
    [repos],
  );
  const shown =
    filter === 'All' ? repos : filter === 'Client' ? repos.filter((r) => r.client) : repos.filter((r) => r.language === filter);

  return (
    <section id="work" className="section reveal">
      <div className="section-head">
        <p className="eyebrow">01 · Work</p>
        <h2 className="section-title chrome">PROJECTS</h2>
        <p className="section-intro">{cfg.intro}</p>
      </div>

      <Window title={`C:\\${site.handle}\\Projects`} icon="grid" bodyClass="projects-body">
        <div className="toolbar">
          <div className="segmented" role="tablist" aria-label="Filter by language">
            {languages.map((l) => (
              <button key={l} role="tab" aria-selected={filter === l} className={filter === l ? 'is-on' : ''} onClick={() => setFilter(l)}>
                {l}
              </button>
            ))}
          </div>
          <span className={`sync sync--${status}`}>
            <span className="led" />
            {status === 'loading' ? 'syncing with GitHub…' : status === 'live' ? `${ghRepos.length} live from GitHub` : 'offline copy'}
          </span>
        </div>

        {status === 'loading' ? (
          <div className="loading">
            <div className="xp-bar">
              <span />
              <span />
              <span />
            </div>
            <p>Fetching repositories…</p>
          </div>
        ) : (
          <div className="cards">
            {shown.map((r, i) => (
              <ProjectCard key={r.name} repo={r} index={i} />
            ))}
          </div>
        )}

        <div className="win-status">
          <span>{shown.length} object(s)</span>
          <a href={`https://github.com/${site.github}`} target="_blank" rel="noreferrer">
            github.com/{site.github} <Icon name="external" size={12} />
          </a>
        </div>
      </Window>
    </section>
  );
}
