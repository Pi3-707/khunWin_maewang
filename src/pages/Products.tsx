import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_LABEL, DUNG_GROUP, filterCategories, parseFilter, type Filter } from '../lib/categories';
import { fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

const TOP: [Filter | '', string][] = [['', 'ทั้งหมด'], ['ecoprint', 'Eco-print'], ['dung', 'จากมูลช้าง']];
const SUB: Record<string, string> = { ayara: 'ผ้าย้อม', dung_pot: 'กระถาง', dung_sculpture: 'งานปั้น' };

export default function Products() {
  usePageTitle('สินค้า');
  const [params, setParams] = useSearchParams();
  const filter = parseFilter(params.get('category'));
  const inDung = filter === 'dung' || DUNG_GROUP.includes(filter as never);
  const { data, error, loading } = useAsync(() => fetchProducts(filterCategories(filter)), [filter]);
  const pick = (v: Filter | '') => setParams(v ? { category: v } : {});
  const isTop = (v: Filter | '') => (v === 'dung' ? inDung : (filter ?? '') === v);

  return (
    <section className="band band-white">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">คลังงานคราฟต์ • ทำมือในชุมชน</span>
          <h1>Living Artifacts</h1>
          <p>เลือกดูงานมือแต่ละชิ้น แล้วทักสอบถามหรือจองผ่าน LINE ได้ทันที</p>
        </div>
        <div className="filters">
          {TOP.map(([v, label]) => (
            <button key={v} className={`btn ${isTop(v) ? '' : 'btn-ghost'}`} onClick={() => pick(v)}>{label}</button>
          ))}
        </div>
        {inDung && (
          <div className="filters sub-filters">
            {DUNG_GROUP.map((c) => (
              <button key={c} className={`btn ${filter === c ? '' : 'btn-ghost'}`} onClick={() => pick(filter === c ? 'dung' : c)} title={CATEGORY_LABEL[c]}>
                {SUB[c]}
              </button>
            ))}
          </div>
        )}
        {loading && <p>กำลังโหลด…</p>}
        {error && <p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
        {data && data.length === 0 && <p>ยังไม่มีสินค้าในหมวดนี้</p>}
        <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}
