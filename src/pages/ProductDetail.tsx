import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ContactButtons } from '../components/ContactButtons';
import type { LayoutContext } from '../components/Layout';
import { track } from '../lib/analytics';
import { availabilityLabel, formatPrice } from '../lib/format';
import { categoryLabel } from '../lib/categories';
import { coverUrl } from '../lib/product';
import { fetchProduct } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const { setProductName } = useOutletContext<LayoutContext>();
  const { data: p, error, loading } = useAsync(() => fetchProduct({ id }), [id]);
  usePageTitle(p?.name ?? 'สินค้า');

  useEffect(() => {
    if (!p) return;
    setProductName(p.name);
    track('view_product', { product_name: p.name });
    return () => setProductName(undefined);
  }, [p, setProductName]);

  if (loading) return <div className="container"><p>กำลังโหลด…</p></div>;
  if (error) return <div className="container"><p className="error">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p></div>;
  if (!p) return <NotFound message="ไม่พบสินค้านี้" />;

  const gallery = [...p.product_images].sort((a, b) => a.display_order - b.display_order);
  const story = [p.story?.introduction, p.story?.origin_story, p.story?.value_story].filter(Boolean) as string[];
  const makers = p.artisans.map((a) => a.name).join(', ') || 'ช่างฝีมือในชุมชน';
  return (
    <>
      <section className="detail-band">
        <div className="container">
          <div>
            <span className="eyebrow">{categoryLabel(p.category)} • {availabilityLabel(p.availability)}</span>
            <h1>{p.name}</h1>
            <p className="price">{formatPrice(p.reference_price)}</p>
          </div>
          <img src={coverUrl(p)} alt={p.name} />
        </div>
      </section>

      <div className="container">
        <span className="eyebrow">แนวคิดของชิ้นงาน</span>
        <h2>{p.story?.title ?? 'เรื่องเล่าของชิ้นนี้'}</h2>
        {p.description && <p>{p.description}</p>}
        {story.map((s) => <p key={s}>{s}</p>)}

        <div className="stats">
          <div className="stat"><span className="eyebrow">วัตถุดิบ</span><strong>{p.materials.map((m) => m.name).join(', ') || '—'}</strong></div>
          <div className="stat"><span className="eyebrow">สถานะ</span><strong>{availabilityLabel(p.availability)}</strong></div>
          <div className="stat"><span className="eyebrow">ผู้ทำ</span><strong>{makers}</strong></div>
        </div>

        {p.processes.length > 0 && (
          <section>
            <span className="eyebrow">ทำอย่างไร • {p.processes.length} ขั้นตอนงานมือ</span>
            <ol className="steps">
              {p.processes.map((s, i) => (
                <li key={s.id}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{s.name}</strong>
                  {s.description && <p>{s.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {p.elephants.length > 0 && (
          <section>
            <span className="eyebrow">ช้างที่อยู่เบื้องหลัง</span>
            {p.elephants.map((e) => (
              <p key={e.id}><strong>{e.name}</strong>{e.age_years ? ` · ${e.age_years} ปี` : ''}{e.description ? ` — ${e.description}` : ''}</p>
            ))}
          </section>
        )}

        {gallery.length > 0 && (
          <section>
            <span className="eyebrow">ภาพสินค้า</span>
            <div className="grid">{gallery.map((g) => <img key={g.url} src={g.url} alt={p.name} loading="lazy" style={{ borderRadius: 12 }} />)}</div>
          </section>
        )}

        <section style={{ margin: '32px 0' }}>
          <span className="eyebrow">สั่งซื้อตรงจากช่างฝีมือ</span>
          <ContactButtons productName={p.name} />
          {p.channels.length > 0 && (
            <div className="contact-buttons" style={{ marginTop: 10 }}>
              {p.channels.map((c) => (
                <a key={c.id} className="btn btn-ghost" href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
