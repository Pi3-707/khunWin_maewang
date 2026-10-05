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
    <section className="band band-white">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">คลังงานคราฟต์ • ทำมือในชุมชน</span>
          <h1>Living Artifacts</h1>
          <p>เลือกดูงานมือแต่ละชิ้น แล้วทักสอบถามหรือจองผ่าน LINE ได้ทันที</p>
        </div>
        <div className="filters">
          {FILTERS.map(([value, label]) => (
            <button key={value} className={`btn ${category === (value || undefined) ? '' : 'btn-ghost'}`}
              onClick={() => setParams(value ? { category: value } : {})}>
              {label}
            </button>
          ))}
        </div>
        {loading && <p>กำลังโหลด…</p>}
        {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
        {data && data.length === 0 && <p>ยังไม่มีสินค้าในหมวดนี้</p>}
        <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}
