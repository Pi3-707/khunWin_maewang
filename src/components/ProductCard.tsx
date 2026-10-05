import { Link } from 'react-router-dom';
import { availabilityLabel, formatPrice } from '../lib/format';
import { coverUrl } from '../lib/product';
import type { ProductListItem } from '../lib/types';

export function ProductCard({ p }: { p: ProductListItem }) {
  const materials = p.product_materials.map((m) => m.materials?.name).filter(Boolean) as string[];
  return (
    <Link to={`/products/${p.id}`} className="card">
      <img src={coverUrl(p)} alt={p.name} loading="lazy" />
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted">{formatPrice(p.reference_price)}</p>
        <span className={`badge ${p.availability === 'ready' ? 'badge-ready' : ''}`}>{availabilityLabel(p.availability)}</span>
        {materials.map((m) => (
          <span key={m} className="badge">{m}</span>
        ))}
      </div>
    </Link>
  );
}
