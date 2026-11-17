import Window from './Window';
import Icon from './Icon';
import { contact, site } from '../content';

export default function Contact() {
  return (
    <section id="contact" className="section reveal">
      <div className="section-head">
        <p className="eyebrow">04 · Contact</p>
        <h2 className="section-title chrome">SAY HI</h2>
      </div>

      <div className="contact-grid">
        <Window title={`Buddy List · ${site.handle.toLowerCase()}`} icon="chat" bodyClass="buddy-body">
          <div className="buddy-me">
            <div className="orb orb--chrome orb--sm" />
            <div>
              <strong>{site.handle.toLowerCase()}</strong>
              <span className="buddy-state">
                <span className="led" /> Available
              </span>
            </div>
          </div>
          <p className="buddy-group">▾ Find me online ({contact.links.length})</p>
          <ul className="buddy-list">
            {contact.links.map((l) => (
              <li key={l.href}>
                <a className="buddy" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <span className={`buddy-icon ${l.tone ? `buddy-icon--${l.tone}` : ''}`}>
                    <Icon name={l.icon} size={18} />
                  </span>
                  <span className="buddy-name">
                    <strong>{l.label}</strong>
                    <em>{l.handle}</em>
                  </span>
                  <Icon name="external" size={14} className="buddy-go" />
                </a>
              </li>
            ))}
          </ul>
        </Window>

        <div className="away glass">
          <p className="away-label">Away message</p>
          <blockquote className="away-bubble">{contact.away}</blockquote>
          <div className="away-actions">
            <a className="btn btn--aqua btn--lg" href={contact.links[0]?.href} target="_blank" rel="noreferrer">
              <Icon name={contact.links[0]?.icon || 'mail'} /> Message me
            </a>
            {contact.coffee && (
              <a className="btn btn--coffee btn--lg" href={contact.coffee.href} target="_blank" rel="noreferrer">
                <Icon name="coffee" /> {contact.coffee.label}
              </a>
            )}
          </div>
          {contact.coffee && <p className="away-note">Like what I make? A coffee keeps the chrome polished.</p>}
        </div>
      </div>
    </section>
  );
}
