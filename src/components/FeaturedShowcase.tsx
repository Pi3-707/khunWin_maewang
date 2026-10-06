import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { track } from '../lib/analytics';
import { buildLineLink } from '../lib/contact';
import { formatPrice } from '../lib/format';
import type { ProductListItem } from '../lib/types';

export function FeaturedShowcase({ products }: { products: ProductListItem[] }) {
  const items = products.filter((p) => p.cover_image_url);
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const n = items.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const p = items[i % n];
  const materials = p.product_materials.map((m) => m.materials?.name).filter(Boolean).join(' · ');
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };

  return (
    <section className="band band-white featured" tabIndex={0} onKeyDown={onKey} aria-roledescription="carousel" aria-label="ผลงานแนะนำ">
      <div className="container featured-grid">
        <div className="frame">
          <div className="frame-mat">
            <img key={p.id} src={p.cover_image_url!} alt={p.name} />
          </div>
        </div>
        <div className="featured-info" aria-live="polite">
          <span className="eyebrow">ผลงานแนะนำ • {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <h2>{p.name}</h2>
          <p className="featured-price">{formatPrice(p.reference_price)}</p>
          <p className="muted">{p.story_summary ?? p.description}</p>
          {materials && <p className="dot">{materials}</p>}
          <div className="featured-actions">
            <a className="btn" href={buildLineLink(import.meta.env.VITE_LINE_OA_ID ?? '', p.name)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_line', { product_name: p.name })}>สอบถาม / จอง</a>
            <Link to={`/products/${p.id}`} className="link-more">ดูรายละเอียด →</Link>
          </div>
          <div className="featured-nav">
            <button onClick={() => go(-1)} aria-label="ก่อนหน้า">‹</button>
            <button onClick={() => go(1)} aria-label="ถัดไป">›</button>
          </div>
        </div>
      </div>
      <div className="container thumbs">
        {items.map((t, k) => (
          <button key={t.id} className={k === i % n ? 'on' : ''} onClick={() => setI(k)} aria-label={t.name}>
            <img src={t.cover_image_url!} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}
