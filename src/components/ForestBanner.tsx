import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

// Full-width photo banner with a slow zoom, headline and pill buttons (Patagonia-style).
export function ForestBanner() {
  const { t } = useLang();
  return (
    <section className="forest-banner">
      <div className="forest-banner-photo" aria-hidden="true" />
      <div className="container forest-banner-inner">
        <span className="eyebrow">{t('banner.eyebrow')}</span>
        <h2>{t('banner.title')}</h2>
        <p>{t('banner.text')}</p>
        <div className="pill-row">
          <Link className="pill" to="/products?category=ecoprint">{t('filter.ecoprint')}</Link>
          <Link className="pill" to="/products?category=dung">{t('filter.dung')}</Link>
          <Link className="pill" to="/our-story">{t('banner.explore')}</Link>
        </div>
      </div>
    </section>
  );
}
