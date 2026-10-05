import { useEffect, useState, type FormEvent, type ReactElement } from 'react';
import { uploadPhoto } from '../../lib/image';
import { fetchProducts } from '../../lib/queries';
import { supabase } from '../../lib/supabase';
import type { Availability, Category, ProductListItem } from '../../lib/types';

interface Draft {
  id?: string; name: string; product_code: string; category: Category;
  description: string; story_summary: string; reference_price: string; availability: Availability;
}
const empty: Draft = { name: '', product_code: '', category: 'ayara', description: '', story_summary: '', reference_price: '', availability: 'made_to_order' };

function check(r: { error: unknown }) {
  if (r.error) throw r.error;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [d, setD] = useState<Draft>(empty);
  const [cover, setCover] = useState<File | null>(null);
  const [extra, setExtra] = useState<File[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => fetchProducts().then(setProducts).catch(() => setMsg('โหลดสินค้าไม่สำเร็จ'));
  useEffect(() => { load(); }, []);

  const edit = (p: ProductListItem) => {
    setD({ id: p.id, name: p.name, product_code: p.product_code, category: p.category,
      description: p.description ?? '', story_summary: p.story_summary ?? '',
      reference_price: p.reference_price == null ? '' : String(p.reference_price), availability: p.availability });
    setCover(null); setExtra([]); setMsg('');
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    const price = d.reference_price === '' ? null : Number(d.reference_price);
    if (price !== null && !Number.isFinite(price)) { setMsg('ราคาต้องเป็นตัวเลข'); return; }
    setMsg('กำลังบันทึก…');
    try {
      const row = { name: d.name, product_code: d.product_code, category: d.category,
        description: d.description || null, story_summary: d.story_summary || null,
        reference_price: price, availability: d.availability };
      let id = d.id;
      if (id) {
        check(await supabase.from('products').update(row).eq('id', id));
      } else {
        const r = await supabase.from('products').insert(row).select('id').single();
        check(r);
        id = r.data!.id;
      }
      if (cover) {
        const url = await uploadPhoto(id!, cover);
        check(await supabase.from('products').update({ cover_image_url: url }).eq('id', id!));
      }
      if (extra.length) {
        const c = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', id!);
        check(c);
        let order = c.count ?? 0;
        for (const f of extra) {
          const url = await uploadPhoto(id!, f);
          check(await supabase.from('product_images').insert({ product_id: id, url, display_order: ++order }));
        }
      }
      setMsg('บันทึกแล้ว'); setD(empty); setCover(null); setExtra([]); load();
    } catch (err) {
      setMsg(`บันทึกไม่สำเร็จ: ${(err as Error).message ?? 'ไม่ทราบสาเหตุ'}`);
    }
  }

  const field = (label: string, el: ReactElement) => <p><label>{label}<br />{el}</label></p>;
  return (
    <div className="container">
      <h1>จัดการสินค้า</h1>
      <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>ออกจากระบบ</button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} <button className="btn btn-ghost" onClick={() => edit(p)}>แก้ไข</button></li>
        ))}
      </ul>
      <h2>{d.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
      <form onSubmit={save} style={{ maxWidth: 520 }}>
        {field('ชื่อสินค้า', <input required value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} style={{ width: '100%' }} />)}
        {field('รหัสสินค้า', <input required value={d.product_code} onChange={(e) => setD({ ...d, product_code: e.target.value })} style={{ width: '100%' }} />)}
        {field('ประเภท', <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value as Category })}><option value="ayara">Ayara</option><option value="ecoprint">Ecoprint</option></select>)}
        {field('ราคาอ้างอิง (บาท, เว้นว่างถ้าไม่ระบุ)', <input inputMode="decimal" value={d.reference_price} onChange={(e) => setD({ ...d, reference_price: e.target.value })} />)}
        {field('สถานะ', <select value={d.availability} onChange={(e) => setD({ ...d, availability: e.target.value as Availability })}><option value="ready">พร้อมส่ง</option><option value="made_to_order">สั่งทำล่วงหน้า</option></select>)}
        {field('รายละเอียด', <textarea rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} style={{ width: '100%' }} />)}
        {field('เรื่องสั้น 2-3 ประโยค', <textarea rows={3} value={d.story_summary} onChange={(e) => setD({ ...d, story_summary: e.target.value })} style={{ width: '100%' }} />)}
        {field('รูปหน้าปก', <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />)}
        {field('รูปเพิ่มเติม (หลายมุม)', <input type="file" accept="image/*" multiple onChange={(e) => setExtra([...(e.target.files ?? [])])} />)}
        <button className="btn" type="submit">บันทึก</button>{' '}
        {d.id && <button type="button" className="btn btn-ghost" onClick={() => setD(empty)}>ยกเลิก</button>}
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
