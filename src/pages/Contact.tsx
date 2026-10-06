import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FacebookCard } from '../components/FacebookCard';
import { ArrowIcon, ChatIcon, MessengerIcon, PhoneIcon, PinIcon } from '../components/Icons';
import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { buildLineLink, buildMessengerLink, buildTelLink } from '../lib/contact';
import { usePageTitle } from '../lib/usePageTitle';

const LINE = import.meta.env.VITE_LINE_OA_ID ?? '';
const FB = import.meta.env.VITE_FB_PAGE ?? '';
const PHONE = import.meta.env.VITE_PHONE ?? '';

interface Method { icon: ReactElement; title: string; sub: string; href?: string; to?: string; event?: string }

export default function Contact() {
  const { lang, t } = useLang();
  usePageTitle(t('nav.contact'));
  const [qr, setQr] = useState(true);

  const methods: Method[] = [
    { icon: <ChatIcon />, title: 'LINE', sub: t('contact.lineSub'), href: LINE && buildLineLink(LINE, undefined, lang), event: 'click_line' },
    { icon: <MessengerIcon />, title: 'Messenger', sub: t('contact.messengerSub'), href: FB && buildMessengerLink(FB), event: 'click_facebook' },
    { icon: <PhoneIcon />, title: t('contact.phone'), sub: PHONE || t('contact.phoneSub'), href: PHONE && buildTelLink(PHONE), event: 'click_phone' },
    { icon: <PinIcon />, title: t('nav.visit'), sub: t('contact.visitSub'), to: '/visit' },
  ];

  return (
    <section className="band band-white">
      <div className="container contact-grid">
        <div>
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h1>{t('contact.title')}</h1>
          <p className="muted contact-intro">{t('contact.text')}</p>
          <ul className="contact-list">
            {methods.map((m) => {
              const body = (
                <>
                  <span className="contact-icon">{m.icon}</span>
                  <span className="contact-text"><strong>{m.title}</strong><small>{m.href === '' ? t('contact.soon') : m.sub}</small></span>
                  {m.href !== '' && <span className="contact-arrow"><ArrowIcon /></span>}
                </>
              );
              return (
                <li key={m.title}>
                  {m.to ? (
                    <Link className="contact-card" to={m.to}>{body}</Link>
                  ) : m.href ? (
                    <a className="contact-card" href={m.href} target={m.href.startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer" onClick={() => m.event && track(m.event)}>{body}</a>
                  ) : (
                    <div className="contact-card is-soon" aria-disabled="true">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="contact-side">
          <FacebookCard />
          {qr && (
            <figure className="qr-card">
              <img src="/line-qr.png" alt={t('contact.qrAlt')} width={160} height={160} onError={() => setQr(false)} />
              <figcaption>{t('contact.scan')}</figcaption>
            </figure>
          )}
        </aside>
      </div>
    </section>
  );
}
