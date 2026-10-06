import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { track } from '../lib/analytics';
import { buildLineLink } from '../lib/contact';
import { formatPrice } from '../lib/format';
import type { ProductListItem } from '../lib/types';

export function FeaturedShowcase({ products }: { products: ProductListItem[] }) {
  const { lang, t, pick } = useLang();
  const items = products.filter((p) => p.cover_image_url);
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const n = items.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const p = items[i % n];
  const name = pick(p, 'name') ?? p.name;
  const materials = p.product_materials.map((m) => pick(m.materials, 'name')).filter(Boolean).join(' · ');
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };

  return (
    <section className="band band-white featured" tabIndex={0} onKeyDown={onKey} aria-roledescription="carousel" aria-label={t('featured.label')}>
      <div className="container featured-grid">
        <div className="frame">
          <div className="frame-mat">
            <img key={p.id} src={p.cover_image_url!} alt={name} />
          </div>
        </div>
        <div className="featured-info" aria-live="polite">
          <span className="eyebrow">{t('featured.label')} • {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <h2>{name}</h2>
          <p className="featured-price">{formatPrice(p.reference_price, lang)}</p>
          <p className="muted">{pick(p, 'story_summary') ?? pick(p, 'description')}</p>
          {materials && <p className="dot">{materials}</p>}
          <div className="featured-actions">
            <a className="btn" href={buildLineLink(import.meta.env.VITE_LINE_OA_ID ?? '', name, lang)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_line', { product_name: p.name })}>{t('common.inquire')}</a>
            <Link to={`/products/${p.id}`} className="link-more">{t('common.details')}</Link>
          </div>
          <div className="featured-nav">
            <button onClick={() => go(-1)} aria-label={t('common.prev')}>‹</button>
            <button onClick={() => go(1)} aria-label={t('common.next')}>›</button>
          </div>
        </div>
      </div>
      <div className="container thumbs">
        {items.map((it, k) => (
          <button key={it.id} className={k === i % n ? 'on' : ''} onClick={() => setI(k)} aria-label={pick(it, 'name') ?? it.name}>
            <img src={it.cover_image_url!} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}
