import { contact, site } from '../content';
import Icon from './Icon';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-copy">
        <p className="hero-status glass-chip">
          <span className="led" /> online · portfolio.{new Date().getFullYear()}
        </p>
        <p className="hero-name">{site.name}</p>
        <h1 className="hero-title chrome" data-text={site.handle}>
          {site.handle}
        </h1>
        <p className="hero-tagline">{site.tagline}</p>
        <div className="hero-actions">
          <a href="#work" className="btn btn--aqua btn--lg">
            <Icon name="grid" /> View my work
          </a>
          <a href="#contact" className="btn btn--lg">
            Say hi <Icon name="arrow" />
          </a>
          {contact.coffee && (
            <a href={contact.coffee.href} className="btn btn--coffee btn--lg" target="_blank" rel="noreferrer">
              <Icon name="coffee" /> Support me
            </a>
          )}
        </div>
      </div>

      <div className="hero-visual">
        <div className="orb-stage">
          <div className="orb-glow" aria-hidden="true" />
          <div className="orb-ring orb-ring--2" aria-hidden="true" />
          <figure className="portrait">
            <img src="/me.webp" alt={`${site.name} at night above the city lights`} width="900" height="1200" />
            <span className="portrait-gloss" aria-hidden="true" />
          </figure>
          <div className="orb-ring orb-ring--1" aria-hidden="true" />
          <div className="orb orb--aqua orb--sat orb--sat-1" aria-hidden="true" />
          <div className="orb orb--aqua orb--sat orb--sat-2" aria-hidden="true" />
          <div className="orb orb--ice orb--sat orb--sat-3" aria-hidden="true" />
          <div className="glass-chip hero-chip hero-chip--1" aria-hidden="true">
            <Icon name="sparkle" size={13} /> {site.role}
          </div>
          <div className="glass-chip hero-chip hero-chip--2" aria-hidden="true">
            <Icon name="code" size={14} /> web · robotics · design
          </div>
          <div className="orb-floor" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
