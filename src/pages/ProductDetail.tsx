import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import type { LayoutContext } from '../components/Layout';
import { track } from '../lib/analytics';
import { availabilityLabel, formatPrice } from '../lib/format';
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
  return (
    <div className="container">
      <h1>{p.name}</h1>
      <img src={coverUrl(p)} alt={p.name} style={{ maxHeight: 460, objectFit: 'cover', width: '100%', borderRadius: 8 }} />
      <p>
        <strong>{formatPrice(p.reference_price)}</strong>{' '}
        <span className={`badge ${p.availability === 'ready' ? 'badge-ready' : ''}`}>{availabilityLabel(p.availability)}</span>
      </p>
      {p.description && <p>{p.description}</p>}
      {p.story && (
        <section>
          <h2>{p.story.title}</h2>
          {p.story.introduction && <p>{p.story.introduction}</p>}
          {p.story.origin_story && <p>{p.story.origin_story}</p>}
          {p.story.value_story && <p>{p.story.value_story}</p>}
        </section>
      )}
      {p.materials.length > 0 && (
        <section>
          <h2>วัตถุดิบ</h2>
          {p.materials.map((m) => (
            <p key={m.id}><strong>{m.name}</strong>{m.origin ? ` · ${m.origin}` : ''}{m.note ? ` — ${m.note}` : ''}</p>
          ))}
        </section>
      )}
      {p.processes.length > 0 && (
        <section>
          <h2>กระบวนการทำ</h2>
          <ol>
            {p.processes.map((s) => (
              <li key={s.id}><strong>{s.name}</strong>{s.description ? `: ${s.description}` : ''}{s.note ? ` (${s.note})` : ''}</li>
            ))}
          </ol>
        </section>
      )}
      {p.artisans.length > 0 && (
        <section>
          <h2>คนทำ</h2>
          {p.artisans.map((a) => (
            <p key={a.id}><strong>{a.name}</strong> · {a.product_role}{a.bio ? ` — ${a.bio}` : ''}</p>
          ))}
        </section>
      )}
      {p.elephants.length > 0 && (
        <section>
          <h2>ช้างที่อยู่เบื้องหลัง</h2>
          {p.elephants.map((e) => (
            <p key={e.id}><strong>{e.name}</strong>{e.age_years ? ` · ${e.age_years} ปี` : ''}{e.description ? ` — ${e.description}` : ''}</p>
          ))}
        </section>
      )}
      {gallery.length > 0 && (
        <section>
          <h2>ภาพสินค้า</h2>
          <div className="grid">
            {gallery.map((g) => <img key={g.url} src={g.url} alt={p.name} loading="lazy" />)}
          </div>
        </section>
      )}
      {p.channels.length > 0 && (
        <section>
          <h2>ช่องทางสั่งซื้อ</h2>
          <div className="contact-buttons">
            {p.channels.map((c) => (
              <a key={c.id} className="btn btn-ghost" href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
