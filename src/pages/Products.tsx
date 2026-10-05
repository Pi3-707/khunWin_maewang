import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import type { Category } from '../lib/types';

const FILTERS: [Category | '', string][] = [['', 'ทั้งหมด'], ['ayara', 'Ayara'], ['ecoprint', 'Ecoprint']];

export default function Products() {
  usePageTitle('สินค้า');
  const [params, setParams] = useSearchParams();
  const raw = params.get('category');
  const category = raw === 'ayara' || raw === 'ecoprint' ? raw : undefined;
  const { data, error, loading } = useAsync(() => fetchProducts(category), [category]);

  return (
    <div className="container">
      <h1>สินค้า</h1>
      <p>
        {FILTERS.map(([value, label]) => (
          <button key={value} className={`btn ${category === (value || undefined) ? '' : 'btn-ghost'}`} style={{ marginRight: 8 }}
            onClick={() => setParams(value ? { category: value } : {})}>
            {label}
          </button>
        ))}
      </p>
      {loading && <p>กำลังโหลด…</p>}
      {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
      {data && data.length === 0 && <p>ยังไม่มีสินค้าในหมวดนี้</p>}
      <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  );
}
