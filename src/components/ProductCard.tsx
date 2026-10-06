import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { categoryLabel } from '../lib/categories';
import { availabilityLabel, formatPrice } from '../lib/format';
import { coverUrl } from '../lib/product';
import type { ProductListItem } from '../lib/types';

export function ProductCard({ p }: { p: ProductListItem }) {
  const { lang, t, pick } = useLang();
  const materials = p.product_materials.map((m) => pick(m.materials, 'name')).filter(Boolean) as string[];
  const name = pick(p, 'name') ?? p.name;
  return (
    <Link to={`/products/${p.id}`} className="card reveal">
      <div className="card-media">
        <img src={coverUrl(p)} alt={name} loading="lazy" />
        <span className="card-tag">{categoryLabel(p.category, lang)} • {availabilityLabel(p.availability, lang)}</span>
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>{name}</h3>
          <span className="price">{formatPrice(p.reference_price, lang)}</span>
        </div>
        <p className="card-desc">{pick(p, 'story_summary') ?? pick(p, 'description') ?? ''}</p>
        <div className="card-foot">
          <span className="dot">{materials.join(' · ') || t('common.handmade')}</span>
          <span className="cta">{t('common.inquire')} →</span>
        </div>
      </div>
    </Link>
  );
}
