import { Link } from 'react-router-dom';
import { availabilityLabel, formatPrice } from '../lib/format';
import { categoryLabel } from '../lib/categories';
import { coverUrl } from '../lib/product';
import type { ProductListItem } from '../lib/types';

export function ProductCard({ p }: { p: ProductListItem }) {
  const materials = p.product_materials.map((m) => m.materials?.name).filter(Boolean) as string[];
  return (
    <Link to={`/products/${p.id}`} className="card reveal">
      <div className="card-media">
        <img src={coverUrl(p)} alt={p.name} loading="lazy" />
        <span className="card-tag">{categoryLabel(p.category)} • {availabilityLabel(p.availability)}</span>
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>{p.name}</h3>
          <span className="price">{formatPrice(p.reference_price)}</span>
        </div>
        <p className="card-desc">{p.story_summary ?? p.description ?? ''}</p>
        <div className="card-foot">
          <span className="dot">{materials.join(' · ') || 'งานมือ'}</span>
          <span className="cta">สอบถาม / จอง →</span>
        </div>
      </div>
    </Link>
  );
}
