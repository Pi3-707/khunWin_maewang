import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { ContactButtons } from './ContactButtons';
import { FacebookCard } from './FacebookCard';
import { SponsorBadge } from './SponsorBadge';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer" id="order">
      <div className="container">
        <h2>{t('footer.title')}</h2>
        <p>{t('footer.text')}</p>
        <ContactButtons />
        <FacebookCard />
        <SponsorBadge />
        <div className="footer-meta">
          <span>{t('footer.copy')} · <Link to="/our-story">{t('nav.story')}</Link> · <Link to="/visit">{t('nav.visit')}</Link></span>
          <em>{t('footer.tagline')}</em>
        </div>
      </div>
    </footer>
  );
}
