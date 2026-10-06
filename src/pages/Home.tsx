import { Link } from 'react-router-dom';
import { FeaturedShowcase } from '../components/FeaturedShowcase';
import { ProductCard } from '../components/ProductCard';
import { fetchHomeStory, fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

const MATERIAL_TYPE: Record<string, string> = { natural_material: 'วัตถุดิบธรรมชาติ', textile: 'ผ้าทอ' };

function useShowVideo() {
  if (typeof window === 'undefined') return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as any).connection?.saveData === true;
  return !reduce && !saveData;
}

const short = (s: string | null, n = 34) => (s && s.length > n ? `${s.slice(0, n)}…` : s ?? '');

export default function Home() {
  usePageTitle('งานคราฟต์จากชุมชน');
  const showVideo = useShowVideo();
  const story = useAsync(fetchHomeStory, []);
  const products = useAsync(() => fetchProducts(), []);
  const materials = story.data?.materials.slice(0, 3) ?? [];
  const steps = story.data?.processes.slice(0, 3) ?? [];

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="eyebrow">ชุมชนขุนวินแม่วาง • เชียงใหม่</span>
            <h1>ผ้าและงานคราฟต์ จากป่า คน และช้าง</h1>
            <p>วัตถุดิบจากธรรมชาติรอบชุมชน ย้อมสีจากใบไม้และมูลช้าง ทอและเย็บด้วยมือของคนในหมู่บ้าน ทุกชิ้นมีเรื่องเล่าของตัวเอง</p>
            <div className="hero-actions">
              <Link className="btn" to="/products">ดูสินค้าทั้งหมด</Link>
              <Link className="btn btn-ghost" to="/our-story">เรื่องราวของเรา</Link>
            </div>
            <span className="hero-tag">อ.แม่วาง จ.เชียงใหม่</span>
          </div>
          <div className="hero-media">
            {showVideo && (
              <video autoPlay muted loop playsInline preload="metadata" poster="/stitch/hero.jpg">
                <source src="/hero.webm" type="video/webm" />
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </section>

      {products.data && <FeaturedShowcase products={products.data} />}

      <section className="band band-white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">คลังงานคราฟต์ • ทำมือในชุมชน</span>
            <h2>Living Artifacts</h2>
            <p>งานมือจากช่างในหมู่บ้าน ใช้วัตถุดิบธรรมชาติจากป่ารอบชุมชน</p>
          </div>
          {products.error && <p className="error">โหลดสินค้าไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
          <div className="grid">{products.data?.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <section className="band band-paper">
        <div className="container story-split">
          <div className="story-photo reveal">
            <img src="/stitch/fabric.jpg" alt="ผ้าพิมพ์ลายใบไม้" loading="lazy" />
            <span>สตูดิโอหุบเขาแม่วาง</span>
          </div>
          <div className="story-card reveal">
            <h2>เรื่องราวของเรา</h2>
            <div className="story-cols">
              <p>ทุกเช้า ช้างในชุมชนออกหากินในป่าบนเขา กินไผ่ หญ้า และผลไม้ป่า วิถีนี้เป็นส่วนหนึ่งของหมู่บ้านมาหลายรุ่น</p>
              <p>ใยธรรมชาติและใบไม้จากป่าถูกเก็บอย่างระมัดระวัง ตากแดด แล้วนำมาย้อมและทอเป็นงานคราฟต์โดยช่างในชุมชน</p>
            </div>
            <div className="story-foot"><span>รายได้กลับสู่ชุมชนโดยตรง</span><strong>ไม่ตัดไม้ทำลายป่า</strong></div>
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">วงจรของวัตถุดิบธรรมชาติ</span>
            <h2>จากป่า สู่งานมือ</h2>
          </div>
          {story.error && <p className="error">โหลดข้อมูลไม่สำเร็จ</p>}
          <div className="cycle">
            <div className="callouts left">
              {materials.map((m) => (
                <div key={m.id} className="callout"><strong>{m.name}</strong><span>{MATERIAL_TYPE[m.type] ?? m.type}</span></div>
              ))}
            </div>
            <div className="cycle-photo"><img src="/stitch/pots.jpg" alt="" loading="lazy" /></div>
            <div className="callouts right">
              {steps.map((s, i) => (
                <div key={s.id} className="callout"><strong>{`0${i + 1}`} {s.name}</strong><span>{short(s.description)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
