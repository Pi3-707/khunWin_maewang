import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

function useShowVideo() {
  if (typeof window === 'undefined') return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as any).connection?.saveData === true;
  return !reduce && !saveData;
}

// Full-width opening banner (Patagonia-style). Plays public/hero.mp4 when present;
// otherwise the slowly zooming photo shows through.
export function ForestBanner() {
  const { t } = useLang();
  const [videoOk, setVideoOk] = useState(true);
  const showVideo = useShowVideo() && videoOk;
  return (
    <section className="forest-banner">
      <div className="forest-banner-photo" aria-hidden="true" />
      {showVideo && (
        <video className="forest-banner-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          {/* Fires when the file is missing or cannot play: hide the video so the moving photo stays visible. */}
          <source src="/hero.mp4" type="video/mp4" onError={() => setVideoOk(false)} />
        </video>
      )}
      <div className="container forest-banner-inner">
        <span className="eyebrow">{t('banner.eyebrow')}</span>
        <h1>{t('banner.title')}</h1>
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
