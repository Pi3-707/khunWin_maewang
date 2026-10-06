import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import type { ProductListItem } from '../lib/types';
import { ProductCard } from './ProductCard';

// A standard shop-style row: heading, "view all" link and a sideways-scrolling strip of product cards.
export function RecommendedRow({ products }: { products: ProductListItem[] }) {
  const { t } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const items = products.filter((p) => p.cover_image_url);
  if (!items.length) return null;
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="band band-white rec">
      <div className="container">
        <div className="rec-head">
          <h2>{t('featured.label')}</h2>
          <div className="rec-tools">
            <Link to="/products" className="link-more">{t('featured.viewAll')}</Link>
            <button type="button" onClick={() => scroll(-1)} aria-label={t('common.prev')}>‹</button>
            <button type="button" onClick={() => scroll(1)} aria-label={t('common.next')}>›</button>
          </div>
        </div>
        <div className="rec-track" ref={track}>
          {items.map((p) => (
            <div key={p.id} className="rec-item"><ProductCard p={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
