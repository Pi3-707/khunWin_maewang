import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { removePhoto, uploadPhoto } from '../../lib/image';
import { saveProduct, type SaveDeps } from '../../lib/saveProduct';
import { CATEGORY_LABEL } from '../../lib/categories';
import { coverUrl } from '../../lib/product';
import { fetchProducts } from '../../lib/queries';
import { supabase } from '../../lib/supabase';
import type { Availability, Category, ProductListItem } from '../../lib/types';
import './admin.css';

interface Draft {
  id?: string; name: string; product_code: string; category: Category;
  description: string; story_summary: string; reference_price: string; availability: Availability;
  name_en: string; description_en: string; story_summary_en: string;
}
const empty: Draft = { name: '', product_code: '', category: 'ayara', description: '', story_summary: '', reference_price: '', availability: 'made_to_order', name_en: '', description_en: '', story_summary_en: '' };

type TextKey = 'name' | 'name_en' | 'product_code' | 'description' | 'description_en' | 'story_summary' | 'story_summary_en';
type Msg = { kind: 'ok' | 'error' | 'busy'; text: string } | null;

function check(r: { error: unknown }) {
  if (r.error) throw r.error;
}

const deps: SaveDeps = {
  async insertProduct(row) {
    const r = await supabase.from('products').insert(row).select('id').single();
    check(r);
    return r.data!.id;
  },
  async updateProduct(id, row) {
    check(await supabase.from('products').update(row).eq('id', id));
  },
  async setCover(id, url) {
    check(await supabase.from('products').update({ cover_image_url: url }).eq('id', id));
  },
  upload: uploadPhoto,
  async addImage(id, url, order) {
    check(await supabase.from('product_images').insert({ product_id: id, url, display_order: order }));
  },
  async countImages(id) {
    const c = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', id);
    check(c);
    return c.count ?? 0;
  },
  removeUpload: removePhoto,
};

// Object URLs for picked files, revoked when the selection changes.
function usePreviews(files: File[]) {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  return urls;
}

const AVAIL_LABEL: Record<Availability, string> = { ready: 'พร้อมส่ง', made_to_order: 'สั่งทำล่วงหน้า' };

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [d, setD] = useState<Draft>(empty);
  const [cover, setCover] = useState<File | null>(null);
  const [extra, setExtra] = useState<File[]>([]);
  const [msg, setMsg] = useState<Msg>(null);
  const formRef = useRef<HTMLElement>(null);
  const coverFiles = useMemo(() => (cover ? [cover] : []), [cover]);
  const coverPreview = usePreviews(coverFiles)[0];
  const extraPreviews = usePreviews(extra);

  const load = () => fetchProducts()
    .then(setProducts)
    .catch(() => setMsg({ kind: 'error', text: 'โหลดสินค้าไม่สำเร็จ ลองรีเฟรชหน้า' }))
    .finally(() => setLoading(false));
  useEffect(() => {
    load();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''));
  }, []);

  const shown = products.filter((p) =>
    (cat === 'all' || p.category === cat) &&
    `${p.name} ${p.name_en ?? ''} ${p.product_code}`.toLowerCase().includes(query.trim().toLowerCase()));
  const editing = d.id ? products.find((p) => p.id === d.id) : undefined;
  const currentImages = editing
    ? [...(editing.cover_image_url ? [editing.cover_image_url] : []),
       ...[...editing.product_images].sort((a, b) => a.display_order - b.display_order).map((i) => i.url)
         .filter((u) => u !== editing.cover_image_url)]
    : [];

  const open = (next: Draft) => {
    setD(next); setCover(null); setExtra([]); setMsg(null);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const edit = (p: ProductListItem) => open({
    id: p.id, name: p.name, product_code: p.product_code, category: p.category,
    description: p.description ?? '', story_summary: p.story_summary ?? '',
    reference_price: p.reference_price == null ? '' : String(p.reference_price), availability: p.availability,
    name_en: p.name_en ?? '', description_en: p.description_en ?? '', story_summary_en: p.story_summary_en ?? '' });
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    const price = d.reference_price === '' ? null : Number(d.reference_price);
    if (price !== null && !Number.isFinite(price)) { setMsg({ kind: 'error', text: 'ราคาต้องเป็นตัวเลข' }); return; }
    setMsg({ kind: 'busy', text: 'กำลังบันทึก…' });
    const row = { name: d.name, product_code: d.product_code, category: d.category,
      description: d.description || null, story_summary: d.story_summary || null,
      reference_price: price, availability: d.availability,
      name_en: d.name_en || null, description_en: d.description_en || null, story_summary_en: d.story_summary_en || null };
    const res = await saveProduct(deps, d.id, row, cover, extra);
    // Keep the id and the unfinished files so a retry updates this product and skips finished uploads.
    if (res.id) setD((prev) => ({ ...prev, id: res.id }));
    if (res.coverDone) setCover(null);
    setExtra(res.pendingExtra);
    load();
    if (res.error) {
      setMsg({ kind: 'error', text: `บันทึกไม่สำเร็จ: ${res.error.message ?? 'ไม่ทราบสาเหตุ'} (กดบันทึกอีกครั้งเพื่อลองใหม่)` });
      return;
    }
    setMsg({ kind: 'ok', text: `บันทึก “${d.name}” แล้ว` }); setD(empty); setCover(null); setExtra([]);
  }

  const busy = msg?.kind === 'busy';
  const text = (label: string, k: TextKey, opts: { required?: boolean; rows?: number; hint?: string } = {}): ReactNode => (
    <label className="adm-field">
      <span>{label}{opts.required && <em className="adm-req"> *</em>}</span>
      {opts.rows
        ? <textarea rows={opts.rows} value={d[k]} onChange={(e) => set(k, e.target.value)} />
        : <input required={opts.required} value={d[k]} onChange={(e) => set(k, e.target.value)} />}
      {opts.hint && <small className="muted">{opts.hint}</small>}
    </label>
  );

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-inner">
          <Link to="/" className="adm-brand"><img src="/emblem.jpg" alt="" /><span><strong>จัดการสินค้า</strong><small>ขุนวินแม่วาง</small></span></Link>
          <span className="adm-user muted">{email}</span>
          <a className="btn btn-ghost adm-sm" href="/products" target="_blank" rel="noreferrer">ดูหน้าเว็บ ↗</a>
          <button className="btn btn-ghost adm-sm" onClick={() => supabase.auth.signOut()}>ออกจากระบบ</button>
        </div>
      </header>

      <main className="adm-main">
        <section className="adm-card">
          <div className="adm-list-head">
            <h2>สินค้าทั้งหมด <span className="adm-count">{products.length}</span></h2>
            <button className="btn" onClick={() => open(empty)}>+ เพิ่มสินค้าใหม่</button>
          </div>
          <div className="adm-filters">
            <input type="search" placeholder="ค้นหาชื่อหรือรหัสสินค้า…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="ค้นหาสินค้า" />
            <div className="adm-chips">
              <button className={cat === 'all' ? 'is-on' : ''} onClick={() => setCat('all')}>ทั้งหมด</button>
              {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
                <button key={v} className={cat === v ? 'is-on' : ''} onClick={() => setCat(v as Category)}>{l}</button>
              ))}
            </div>
          </div>
          {loading ? <p className="muted">กำลังโหลด…</p> : shown.length === 0 ? <p className="muted">ไม่พบสินค้า</p> : (
            <ul className="adm-grid">
              {shown.map((p) => (
                <li key={p.id}>
                  <button className={`adm-item${p.id === d.id ? ' is-active' : ''}`} onClick={() => edit(p)}>
                    <img src={coverUrl(p)} alt="" loading="lazy" />
                    <span className="adm-item-body">
                      <span className="adm-code">{p.product_code}</span>
                      <strong>{p.name}</strong>
                      <span className="adm-item-meta">
                        <span className={`adm-pill${p.availability === 'ready' ? ' adm-pill-ready' : ''}`}>{AVAIL_LABEL[p.availability]}</span>
                        {p.reference_price != null && <span>{Number(p.reference_price).toLocaleString('th-TH')} ฿</span>}
                      </span>
                    </span>
                    <span className="adm-edit">แก้ไข</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card adm-form-card" ref={formRef}>
          <div className="adm-form-head">
            <h2>{d.id ? `แก้ไข: ${editing?.name ?? d.name}` : 'เพิ่มสินค้าใหม่'}</h2>
            {d.id && <a href={`/products/${d.id}`} target="_blank" rel="noreferrer" className="adm-link">ดูหน้าสินค้า ↗</a>}
          </div>
          <form onSubmit={save}>
            <fieldset disabled={busy}>
              <h3 className="adm-step"><span>1</span> ข้อมูลหลัก</h3>
              <div className="adm-cols">
                {text('ชื่อสินค้า (ไทย)', 'name', { required: true })}
                {text('ชื่อสินค้า (English)', 'name_en', { hint: 'เว้นว่างได้ จะแสดงชื่อภาษาไทยแทน' })}
                {text('รหัสสินค้า', 'product_code', { required: true, hint: 'เช่น P020' })}
                <label className="adm-field">
                  <span>ประเภท</span>
                  <select value={d.category} onChange={(e) => set('category', e.target.value as Category)}>
                    {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
                <label className="adm-field">
                  <span>ราคาอ้างอิง (บาท)</span>
                  <input inputMode="decimal" placeholder="เว้นว่างถ้าไม่ระบุ" value={d.reference_price} onChange={(e) => set('reference_price', e.target.value)} />
                </label>
                <div className="adm-field">
                  <span>สถานะ</span>
                  <div className="adm-seg" role="radiogroup" aria-label="สถานะ">
                    {(Object.keys(AVAIL_LABEL) as Availability[]).map((a) => (
                      <button type="button" key={a} role="radio" aria-checked={d.availability === a} className={d.availability === a ? 'is-on' : ''} onClick={() => set('availability', a)}>{AVAIL_LABEL[a]}</button>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="adm-step"><span>2</span> ข้อความ</h3>
              <p className="muted adm-note">ช่อง English เว้นว่างได้ ถ้าว่าง หน้าภาษาอังกฤษจะแสดงข้อความภาษาไทยแทน</p>
              <div className="adm-cols">
                {text('รายละเอียด (ไทย)', 'description', { rows: 4 })}
                {text('รายละเอียด (English)', 'description_en', { rows: 4 })}
                {text('เรื่องสั้น 2–3 ประโยค (ไทย)', 'story_summary', { rows: 3 })}
                {text('เรื่องสั้น (English)', 'story_summary_en', { rows: 3 })}
              </div>

              <h3 className="adm-step"><span>3</span> รูปภาพ</h3>
              {currentImages.length > 0 && (
                <>
                  <p className="muted adm-note">รูปปัจจุบัน (รูปแรกคือรูปหน้าปก)</p>
                  <div className="adm-thumbs">{currentImages.map((u) => <img key={u} src={u} alt="" />)}</div>
                </>
              )}
              <div className="adm-cols">
                <label className="adm-drop">
                  <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
                  {coverPreview ? <img src={coverPreview} alt="" /> : <span className="adm-drop-icon">＋</span>}
                  <strong>{d.id ? 'เปลี่ยนรูปหน้าปก' : 'รูปหน้าปก'}</strong>
                  <small className="muted">{cover ? cover.name : 'แตะเพื่อเลือกรูป'}</small>
                </label>
                <label className="adm-drop">
                  <input type="file" accept="image/*" multiple onChange={(e) => setExtra([...(e.target.files ?? [])])} />
                  {extraPreviews.length ? <span className="adm-drop-many">{extraPreviews.map((u) => <img key={u} src={u} alt="" />)}</span> : <span className="adm-drop-icon">＋</span>}
                  <strong>รูปเพิ่มเติม (หลายมุม)</strong>
                  <small className="muted">{extra.length ? `เลือกแล้ว ${extra.length} รูป` : 'เลือกได้หลายรูปพร้อมกัน'}</small>
                </label>
              </div>
            </fieldset>

            <div className="adm-savebar">
              {msg && <p className={`adm-alert adm-alert-${msg.kind}`} role="status">{msg.text}</p>}
              <div className="adm-savebar-btns">
                {(d.id || d.name) && <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => open(empty)}>ยกเลิก</button>}
                <button className="btn" type="submit" disabled={busy}>{busy ? 'กำลังบันทึก…' : d.id ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}</button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
