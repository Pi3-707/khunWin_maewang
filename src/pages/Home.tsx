import { Link } from 'react-router-dom';
import { CollageLayer } from '../components/CollageLayer';
import { ProductCard } from '../components/ProductCard';
import { ThreadLine } from '../components/ThreadLine';
import { chapters } from '../content/chapters';
import { fetchHomeStory, fetchProducts } from '../lib/queries';
import { useAsync } from '../lib/useAsync';
import { usePageTitle } from '../lib/usePageTitle';

function useShowVideo() {
  if (typeof window === 'undefined') return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as any).connection?.saveData === true;
  return !reduce && !saveData;
}

export default function Home() {
  usePageTitle('งานคราฟต์จากชุมชน');
  const showVideo = useShowVideo();
  const story = useAsync(fetchHomeStory, []);
  const products = useAsync(() => fetchProducts(), []);
  const [place, people, craft, artifacts, visit] = chapters;

  return (
    <div className="story">
      <ThreadLine />
      <section className="hero">
        {showVideo && (
          <video autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg">
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero-inner">
          <h1>ขุนวินแม่วาง</h1>
          <p>งานคราฟต์ที่เล่าเรื่องของป่า ผู้คน และช้าง</p>
          <Link className="btn" to="/products">ดูสินค้า</Link>
          <p className="scroll-cue">เลื่อนลงเพื่ออ่านเรื่องราว ↓</p>
        </div>
      </section>

      <section className="chapter">
        <div className="chapter-text reveal"><span className="stamp">ตอน 1 / 5</span><h2>{place.title}</h2><p>{place.text}</p></div>
        <CollageLayer srcs={["/mock/m1.svg", "/mock/m2.svg"]} />
      </section>

      <section className="chapter">
        <div className="chapter-text reveal"><span className="stamp">ตอน 2 / 5</span><h2>{people.title}</h2><p>{people.text}</p></div>
        <CollageLayer srcs={["/mock/m3.svg", "/mock/m4.svg"]} bw />
      </section>

      <section className="chapter">
        <div className="chapter-text reveal">
          <span className="stamp">ตอน 3 / 5</span><h2>{craft.title}</h2>
          <p>{craft.text}</p>
          {story.data?.materials.map((m) => <span key={m.id} className="badge">{m.name}</span>)}
          <ol>{story.data?.processes.map((s) => <li key={s.id}>{s.name}</li>)}</ol>
          {story.error && <p className="error">โหลดข้อมูลไม่สำเร็จ</p>}
        </div>
        <CollageLayer srcs={story.data?.processes.slice(0, 2).map((s) => s.image_url || '/mock/m5.svg') ?? ["/mock/m5.svg", "/mock/m6.svg"]} bw />
      </section>

      <section className="chapter" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chapter-text reveal"><span className="stamp">ตอน 4 / 5</span><h2>{artifacts.title}</h2><p>{artifacts.text}</p></div>
        <div className="grid">{products.data?.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        {products.error && <p className="error">โหลดสินค้าไม่สำเร็จ</p>}
      </section>

      <section className="chapter">
        <div className="chapter-text reveal">
          <span className="stamp">ตอน 5 / 5</span><h2>{visit.title}</h2>
          <p>{visit.text}</p>
          <Link className="btn" to="/visit">ข้อมูลการเยี่ยมชม</Link>{' '}
          <Link className="btn btn-ghost" to="/products">สินค้าทั้งหมด</Link>
        </div>
        <CollageLayer srcs={["/mock/m2.svg", "/mock/m6.svg"]} />
      </section>
    </div>
  );
}
